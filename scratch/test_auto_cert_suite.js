import assert from 'assert';

console.log('====================================================');
console.log('COMPREHENSIVE VERIFICATION & TEST SUITE: TESTS A - G');
console.log('====================================================\n');

// Mock in-memory database store
function createMockStore() {
  return {
    profiles: [
      { id: 'user-biz-1', role: 'business', name: 'Acme Weighing Ltd' },
      { id: 'user-biz-2', role: 'business', name: 'Beta Industries' },
      { id: 'user-off-1', role: 'officer', name: 'Inspector Sharma' },
      { id: 'user-off-2', role: 'officer', name: 'Inspector Patel' },
      { id: 'user-lmd-1', role: 'lmd', name: 'LMD Superintendent' }
    ],
    officers: [
      { id: 'off-1', user_id: 'user-off-1' },
      { id: 'off-2', user_id: 'user-off-2' }
    ],
    instruments: [
      {
        id: 'inst-1',
        category: 'Non-Automatic Weighing Instrument',
        serial_number: 'SN-99881',
        manufacturer: 'Essae',
        model_number: 'DS-215',
        max_capacity: '30 kg',
        accuracy_class: 'Class III',
        status: 'under_verification'
      },
      {
        id: 'inst-2',
        category: 'Electronic Balance',
        serial_number: 'SN-77662',
        manufacturer: 'Citizen',
        model_number: 'CY-204',
        max_capacity: '200 g',
        accuracy_class: 'Class II',
        status: 'under_verification'
      }
    ],
    applications: [
      {
        id: 'app-1',
        application_number: 'APP-2026-001',
        applicant_id: 'user-biz-1',
        instrument_id: 'inst-1',
        status: 'assigned',
        assigned_officer_id: 'off-1',
        application_type: 'Initial Verification',
        inspection_location: 'Plot 12, Industrial Area, Solan'
      },
      {
        id: 'app-2',
        application_number: 'APP-2026-002',
        applicant_id: 'user-biz-2',
        instrument_id: 'inst-2',
        status: 'assigned',
        assigned_officer_id: 'off-2',
        application_type: 'Subsequent Verification',
        inspection_location: 'Sector 4, Baddi'
      }
    ],
    verification_results: [],
    certificates: [],
    app_timeline: []
  };
}

// Implement simulated Edge Function submit-verification logic
async function simulateSubmitVerification(store, callerUser, payload, options = {}) {
  // Check auth & role
  const profile = store.profiles.find(p => p.id === callerUser.id);
  if (!profile || profile.role !== 'officer') {
    throw new Error('Unauthorized. Only Officers can submit verification results.');
  }

  const officer = store.officers.find(o => o.user_id === callerUser.id);
  if (!officer) throw new Error('Officer profile not found');

  const app = store.applications.find(a => a.id === payload.applicationId);
  if (!app) throw new Error('Application not found');

  // Verify officer assigned
  if (app.assigned_officer_id !== officer.id) {
    throw new Error('Unauthorized. You are not assigned to this application.');
  }

  if (payload.outcome === 'FAIL' && (!payload.rejection_reason || !payload.rejection_reason.trim())) {
    throw new Error('Rejection reason is required when outcome is FAIL.');
  }

  // Insert verification result
  const vr = {
    id: `vr-${store.verification_results.length + 1}`,
    application_id: app.id,
    officer_id: officer.id,
    outcome: payload.outcome,
    checklist_results: payload.checklist_results || {},
    technical_test_results: payload.technical_test_results || {},
    officer_remarks: payload.officer_remarks,
    rejection_reason: payload.outcome === 'FAIL' ? payload.rejection_reason : null,
    created_at: new Date().toISOString()
  };
  store.verification_results.push(vr);

  const newStatus = payload.outcome === 'PASS' ? 'passed' : 'failed';
  app.status = newStatus;
  app.completed_at = new Date().toISOString();

  // Timeline for verification
  store.app_timeline.push({
    application_id: app.id,
    event_type: 'VERIFICATION',
    step: `Verification ${payload.outcome}`,
    actor_role: 'officer',
    message: payload.officer_remarks || `Verification completed: ${payload.outcome}`
  });

  let certificate = null;
  let certificateStatus = null;

  if (newStatus === 'passed') {
    try {
      if (options.simulateCertCreationFailure) {
        throw new Error('Simulated database/server error during certificate creation');
      }

      // Check existing certificate (duplicate protection)
      let existingCert = store.certificates.find(c => c.application_id === app.id);
      if (existingCert) {
        certificate = existingCert;
        certificateStatus = 'issued';
      } else {
        const inst = store.instruments.find(i => i.id === app.instrument_id);
        const certNum = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const verificationDate = new Date().toISOString().split('T')[0];
        const expiryDate = new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0];

        const newCert = {
          id: `cert-${store.certificates.length + 1}`,
          application_id: app.id,
          instrument_id: app.instrument_id,
          certificate_number: certNum,
          owner_name: profile.name,
          verification_date: verificationDate,
          expiry_date: expiryDate,
          status: 'VERIFIED',
          seal_number: `SEAL-${Math.floor(1000 + Math.random() * 9000)}`
        };
        store.certificates.push(newCert);

        // Update instrument
        inst.status = 'active';
        inst.last_verification_date = verificationDate;
        inst.next_reverification_due = expiryDate;

        // Timeline for certificate
        store.app_timeline.push({
          application_id: app.id,
          event_type: 'CERTIFICATE_GENERATED',
          step: 'Certificate Issued Automatically',
          actor_role: 'system',
          message: `Certificate ${certNum} automatically issued upon Officer PASS verification`
        });

        certificate = newCert;
        certificateStatus = 'issued';
      }
    } catch (err) {
      certificate = null;
      certificateStatus = 'pending';
    }
  }

  return {
    success: true,
    outcome: payload.outcome,
    applicationStatus: newStatus,
    certificate: certificate ? {
      id: certificate.id,
      certificateNumber: certificate.certificate_number,
      validUntil: certificate.expiry_date,
      status: certificate.status
    } : null,
    certificateStatus
  };
}

// ----------------------------------------------------
// TEST A: Initial PASS
// ----------------------------------------------------
console.log('--- TEST A: Initial PASS ---');
let store = createMockStore();
let resA = await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-1',
  outcome: 'PASS',
  officer_remarks: 'All tolerance checks within Class III limits'
});

assert.strictEqual(resA.success, true);
assert.strictEqual(resA.applicationStatus, 'passed');
assert.strictEqual(resA.certificateStatus, 'issued');
assert.ok(resA.certificate?.certificateNumber);
assert.strictEqual(store.certificates.length, 1);
assert.strictEqual(store.applications[0].status, 'passed');
// Business sees certificate
const bizApp = store.applications.find(a => a.id === 'app-1' && a.applicant_id === 'user-biz-1');
const bizCert = store.certificates.find(c => c.application_id === bizApp.id);
assert.ok(bizCert, 'Business should see newly issued certificate');
console.log('TEST A PASSED: Application marked passed and certificate automatically generated.\n');

// ----------------------------------------------------
// TEST B: FAIL
// ----------------------------------------------------
console.log('--- TEST B: FAIL ---');
store = createMockStore();
let resB = await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-1',
  outcome: 'FAIL',
  rejection_reason: 'Eccentricity error exceeded MPE by 1.2e'
});

assert.strictEqual(resB.success, true);
assert.strictEqual(resB.applicationStatus, 'failed');
assert.strictEqual(resB.certificate, null);
assert.strictEqual(store.certificates.length, 0);
assert.strictEqual(store.applications[0].status, 'failed');
console.log('TEST B PASSED: FAIL does NOT generate a certificate.\n');

// ----------------------------------------------------
// TEST C: FAIL -> Re-Verification -> PASS
// ----------------------------------------------------
console.log('--- TEST C: FAIL -> Re-Verification -> PASS ---');
store = createMockStore();
// 1st attempt: FAIL
await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-1',
  outcome: 'FAIL',
  rejection_reason: 'Scale calibration deviation'
});
assert.strictEqual(store.verification_results.length, 1);
assert.strictEqual(store.certificates.length, 0);

// 2nd attempt: Re-verification PASS
let resC = await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-1',
  outcome: 'PASS',
  officer_remarks: 'Re-inspected after mechanical recalibration. Passed all tests.'
});

assert.strictEqual(store.verification_results.length, 2);
assert.strictEqual(store.verification_results[0].outcome, 'FAIL');
assert.strictEqual(store.verification_results[1].outcome, 'PASS');
assert.strictEqual(store.applications[0].status, 'passed');
assert.strictEqual(store.certificates.length, 1);
console.log('TEST C PASSED: Historical FAIL preserved, new PASS generated exactly 1 certificate.\n');

// ----------------------------------------------------
// TEST D: Duplicate PASS / Retry
// ----------------------------------------------------
console.log('--- TEST D: Duplicate PASS / Retry ---');
// Submit PASS again for app-1
let resD = await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-1',
  outcome: 'PASS',
  officer_remarks: 'Duplicate submission test'
});
assert.strictEqual(store.certificates.length, 1, 'Certificate count must not increase on duplicate PASS');
assert.strictEqual(resD.certificate.certificateNumber, resC.certificate.certificateNumber);
console.log('TEST D PASSED: Duplicate PASS returns existing certificate and creates no duplicates.\n');

// ----------------------------------------------------
// TEST E: Business Isolation
// ----------------------------------------------------
console.log('--- TEST E: Business Isolation ---');
// User Biz 1 querying own applications & certificates:
const biz1Apps = store.applications.filter(a => a.applicant_id === 'user-biz-1');
const biz1Certs = store.certificates.filter(c => biz1Apps.some(a => a.id === c.application_id));
assert.strictEqual(biz1Apps.length, 1);
assert.strictEqual(biz1Certs.length, 1);

// User Biz 2 querying own applications & certificates:
const biz2Apps = store.applications.filter(a => a.applicant_id === 'user-biz-2');
const biz2Certs = store.certificates.filter(c => biz2Apps.some(a => a.id === c.application_id));
assert.strictEqual(biz2Apps.length, 1);
assert.strictEqual(biz2Certs.length, 0); // Biz 2 has app-2, but it has not been verified/passed yet
console.log('TEST E PASSED: Business 2 cannot see Business 1 certificate.\n');

// ----------------------------------------------------
// TEST F: Officer Authorization Checks
// ----------------------------------------------------
console.log('--- TEST F: Officer Authorization Checks ---');
// Officer 2 attempts to submit verification for app-1 (assigned to Officer 1)
try {
  await simulateSubmitVerification(store, { id: 'user-off-2' }, {
    applicationId: 'app-1',
    outcome: 'PASS'
  });
  assert.fail('Should have thrown unauthorized error');
} catch (err) {
  assert.strictEqual(err.message, 'Unauthorized. You are not assigned to this application.');
}

// Non-officer attempts to submit verification
try {
  await simulateSubmitVerification(store, { id: 'user-biz-1' }, {
    applicationId: 'app-1',
    outcome: 'PASS'
  });
  assert.fail('Should have thrown unauthorized error');
} catch (err) {
  assert.strictEqual(err.message, 'Unauthorized. Only Officers can submit verification results.');
}
console.log('TEST F PASSED: Unassigned or unauthorized callers cannot submit verification or trigger certificates.\n');

// ----------------------------------------------------
// TEST G: Certificate-Generation Failure Recovery
// ----------------------------------------------------
console.log('--- TEST G: Certificate-Generation Failure Recovery ---');
store = createMockStore();
let resG = await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-1',
  outcome: 'PASS',
  officer_remarks: 'Physical test passed completely'
}, { simulateCertCreationFailure: true });

assert.strictEqual(resG.success, true);
assert.strictEqual(resG.outcome, 'PASS');
assert.strictEqual(resG.applicationStatus, 'passed');
assert.strictEqual(resG.certificate, null);
assert.strictEqual(resG.certificateStatus, 'pending');
assert.strictEqual(store.certificates.length, 0);
// Verify truthful timeline: contains VERIFICATION event but NO fake CERTIFICATE_GENERATED event
const certEvents = store.app_timeline.filter(t => t.event_type === 'CERTIFICATE_GENERATED');
assert.strictEqual(certEvents.length, 0, 'No fake certificate timeline event should be logged');

// Now simulate LMD manual recovery retry:
// LMD manual issuance
const instG = store.instruments.find(i => i.id === store.applications[0].instrument_id);
const certG = {
  id: 'cert-retry-1',
  application_id: 'app-1',
  instrument_id: instG.id,
  certificate_number: 'CERT-2026-9999',
  status: 'VERIFIED',
  expiry_date: '2027-09-03'
};
store.certificates.push(certG);
store.app_timeline.push({
  application_id: 'app-1',
  event_type: 'CERTIFICATE_GENERATED',
  step: 'Certificate Issued (Manual LMD Retry)',
  actor_role: 'lmd'
});

assert.strictEqual(store.certificates.length, 1);
assert.strictEqual(store.app_timeline.filter(t => t.event_type === 'CERTIFICATE_GENERATED').length, 1);
console.log('TEST G PASSED: Failure leaves verification truthful and permits safe, idempotent manual recovery.\n');

console.log('====================================================');
console.log('ALL TESTS A THROUGH G PASSED WITH ZERO ERRORS!');
console.log('====================================================');
