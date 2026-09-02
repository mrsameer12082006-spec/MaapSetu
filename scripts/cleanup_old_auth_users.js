#!/usr/bin/env node
/**
 * cleanup_old_auth_users.js
 * Deletes ONLY the 3 known old demo auth users by explicit UUID.
 * Run AFTER db push has cleared their profiles rows.
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

if (!SERVICE_KEY) { console.error('SUPABASE_SERVICE_ROLE_KEY required'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Explicit UUIDs identified during dry-run
const OLD_USER_IDS = [
  { id: 'eec2402d-402a-4d94-b0d6-cd2468d6b297', email: 'r.sharma.lmo@maapsetu.gov.in' },
  { id: '3803e3c5-8ffd-409c-868a-a7b3f0116642', email: 'admin.ngp@maapsetu.gov.in' },
  { id: 'e2d90364-0d9e-410e-97c1-7895498302be', email: 'v.mehta@apexlogistics.in' },
];

console.log('Deleting 3 old demo auth users by explicit UUID...');
for (const u of OLD_USER_IDS) {
  const { error } = await supabase.auth.admin.deleteUser(u.id);
  if (error) {
    console.warn(`  ✗ Could not delete ${u.email} (${u.id}): ${error.message}`);
  } else {
    console.log(`  ✓ Deleted: ${u.email}`);
  }
}
console.log('Done.');
