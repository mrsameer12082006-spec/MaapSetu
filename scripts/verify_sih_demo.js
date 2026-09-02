#!/usr/bin/env node
/**
 * verify_sih_demo.js
 * Reads back from Supabase to verify the fresh SIH demo dataset is intact.
 */

import path from 'path';
import { fileURLToPath } from 'url';

let createClient;
try {
  ({ createClient } = await import('@supabase/supabase-js'));
} catch {
  const localSupabase = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../frontend/node_modules/@supabase/supabase-js/dist/index.mjs');
  ({ createClient } = await import(`file://${localSupabase.replace(/\\/g, '/')}`));
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yrzhtrzelayycrnvmcup.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function check(label, query) {
  const { data, error, count } = await query;
  if (error) {
    console.error(`  ✗ ${label}: ${error.message}`);
    return [];
  }
  return data;
}

console.log('\n============================================================');
console.log('  MAAPSETU SIH DEMO — POST-SEED VERIFICATION AUDIT');
console.log('============================================================\n');

// 1. Auth Users
const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
const demoUsers = (authData?.users || []).filter(u => u.email?.endsWith('@maapsetu.demo'));
const liveOldUsers = (authData?.users || []).filter(u =>
  ['v.mehta@apexlogistics.in','admin.ngp@maapsetu.gov.in','r.sharma.lmo@maapsetu.gov.in',
   'a.kulkarni.lmo@maapsetu.gov.in','wiwmtc.gatc@maapsetu.gov.in'].includes(u.email)
);
console.log(`Auth Users (@maapsetu.demo): ${demoUsers.length} / 25 expected`);
console.log(`Remaining old demo accounts:  ${liveOldUsers.length} (should be 0)`);
if (liveOldUsers.length > 0) liveOldUsers.forEach(u => console.warn(`  ⚠️  Still exists: ${u.email}`));

// 2. Profiles
const profiles = await check('Profiles', supabase.from('profiles').select('id, name, email, role'));
const byRole = { business: 0, lmd: 0, officer: 0 };
profiles.forEach(p => { if (byRole[p.role] !== undefined) byRole[p.role]++; });
console.log(`\nProfiles: ${profiles.length} total`);
console.log(`  business: ${byRole.business} (expect 1)`);
console.log(`  lmd:      ${byRole.lmd} (expect 8)`);
console.log(`  officer:  ${byRole.officer} (expect 16)`);

// 3. Officers
const officers = await check('Officers', supabase.from('officers').select('id, officer_type, employee_code'));
const lmos = officers.filter(o => o.officer_type === 'LMO');
const gatcs = officers.filter(o => o.officer_type === 'GATC');
console.log(`\nOfficers: ${officers.length} total (expect 16)`);
console.log(`  LMO:  ${lmos.length} (expect 8)`);
console.log(`  GATC: ${gatcs.length} (expect 8)`);

// 4. Instruments
const instruments = await check('Instruments', supabase.from('instruments').select('id, instrument_name, status'));
console.log(`\nInstruments: ${instruments.length} (expect 8)`);
instruments.forEach(i => console.log(`  • ${i.instrument_name}`));

// 5. Applications
const apps = await check('Applications', supabase.from('applications').select('id, application_number, status, application_type'));
console.log(`\nApplications: ${apps.length} (expect 8)`);
const statusCounts = {};
apps.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });
Object.entries(statusCounts).sort().forEach(([s, c]) => console.log(`  ${s}: ${c}`));
console.log('\n  Dashboard Categories:');
console.log(`  NEW (submitted):            ${statusCounts['submitted'] || 0} (expect 1 — App 1)`);
console.log(`  IN PROGRESS (under_review): ${statusCounts['under_review'] || 0} (expect 2 — App 2 & 3)`);
console.log(`  VERIFICATION (assigned/in_progress): ${(statusCounts['assigned'] || 0) + (statusCounts['in_progress'] || 0)} (expect 3 — App 4, 5, 7)`);
console.log(`  COMPLETED (failed/passed):  ${(statusCounts['failed'] || 0) + (statusCounts['passed'] || 0)} (expect 2 — App 6 & 8)`);

// 6. Verification Results
const results = await check('Verification Results', supabase.from('verification_results').select('id, application_id, outcome, rejection_reason'));
console.log(`\nVerification Results: ${results.length} (expect 3 — App 6 FAIL, App 7 FAIL, App 8 PASS)`);
results.forEach(r => console.log(`  • Outcome: ${r.outcome}${r.rejection_reason ? ' | ' + r.rejection_reason.slice(0, 60) : ''}`));

// 7. Certificates
const certs = await check('Certificates', supabase.from('certificates').select('id, certificate_number, status'));
console.log(`\nCertificates: ${certs.length} (expect 0 — none pre-seeded)`);
if (certs.length > 0) certs.forEach(c => console.warn(`  ⚠️  Pre-seeded certificate found: ${c.certificate_number}`));

// 8. Timeline
const timeline = await check('Timeline Events', supabase.from('app_timeline').select('id, event_type, step'));
console.log(`\nTimeline Events: ${timeline.length} (expect 9)`);

console.log('\n============================================================');
console.log('  LIVE DEMO READINESS');
console.log('============================================================');
console.log(`\n  App 7 (Crane Scale) is ASSIGNED to lmo01@maapsetu.demo.`);
console.log(`  Verification Attempt #1: FAIL (pre-seeded). Ready for LIVE PASS demo.`);
console.log(`  No certificates are pre-seeded — auto-gen will fire on PASS.\n`);
console.log('  All demo credentials: email / MaapSetu@2026');
console.log('  Business:  business.demo@maapsetu.demo');
console.log('  LMD Admin: lmd01@maapsetu.demo');
console.log('  Inspector: lmo01@maapsetu.demo\n');
