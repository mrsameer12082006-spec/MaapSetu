import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const token = authHeader.replace('Bearer ', '')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check user role securely using explicit JWT
    const {
      data: { user },
      error: authError
    } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Verify Officer role
    const { data: profile } = await supabaseClient.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'officer') {
      throw new Error('Unauthorized. Only Officers can submit verification results.')
    }

    const { applicationId, outcome, checklist_results, technical_test_results, officer_remarks, rejection_reason, photo_evidence_urls } = await req.json()

    // Verify officer is assigned to this application
    const { data: officer } = await supabaseAdmin.from('officers').select('id').eq('user_id', user.id).single()
    if (!officer) throw new Error('Officer profile not found')

    const { data: app } = await supabaseAdmin.from('applications').select('assigned_officer_id, status').eq('id', applicationId).single()
    
    if (app?.assigned_officer_id !== officer.id) {
      throw new Error('Unauthorized. You are not assigned to this application.')
    }

    if (outcome === 'FAIL') {
      if (!rejection_reason || typeof rejection_reason !== 'string' || !rejection_reason.trim()) {
        throw new Error('Rejection reason is required when outcome is FAIL.')
      }
      if (rejection_reason.trim() === 'Other') {
        throw new Error('Specific rejection explanation must be provided when "Other" failure reason is selected.')
      }
    }

    // Insert verification result
    const { error: vrError } = await supabaseAdmin.from('verification_results').insert({
      application_id: applicationId,
      officer_id: officer.id,
      outcome: outcome,
      checklist_results: checklist_results || {},
      technical_test_results: technical_test_results || {},
      officer_remarks: officer_remarks,
      rejection_reason: outcome === 'FAIL' ? rejection_reason.trim() : null,
      photo_evidence_urls: photo_evidence_urls || [],
      verified_at: new Date().toISOString()
    })

    if (vrError) throw vrError

    const newStatus = outcome === 'PASS' ? 'passed' : 'failed'

    // Update Application Status
    const { error: appError } = await supabaseAdmin.from('applications').update({
      status: newStatus,
      completed_at: new Date().toISOString()
    }).eq('id', applicationId)

    if (appError) throw appError
    
    if (newStatus === 'failed') {
      // Also update instrument status to rejected if failed
      const { data: appData } = await supabaseAdmin.from('applications').select('instrument_id').eq('id', applicationId).single()
      if (appData) {
        await supabaseAdmin.from('instruments').update({ status: 'rejected' }).eq('id', appData.instrument_id)
      }
    }

    // Timeline event
    await supabaseAdmin.from('app_timeline').insert({
      application_id: applicationId,
      event_type: 'VERIFICATION',
      step: `Verification ${outcome}`,
      old_status: app?.status || 'assigned',
      new_status: newStatus,
      actor_user_id: user.id,
      actor_role: 'officer',
      message: officer_remarks || `Verification completed with result: ${outcome}`
    })

    return new Response(JSON.stringify({ success: true, outcome: outcome }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
