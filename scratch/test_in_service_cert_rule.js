import assert from 'assert';

console.log('====================================================');
console.log('STAGE SEMANTICS TEST SUITE: TESTS A THROUGH H');
console.log('====================================================\n');

// Server-side stage derivation function matching submit-verification/index.ts
function deriveVerificationStage(applicationType, clientStage) {
  const dbType = String(applicationType || '').trim().toLowerCase();
  const client = String(clientStage || '').trim().toLowerCase();

  // 1. Check if application itself is an in-service inspection / surveillance
  if (
    dbType.includes('in-service') ||
    dbType.includes('in_service') ||
    dbType.includes('surveillance') ||
    dbType === 'inspection' ||
    dbType === 'in_service_inspection'
  ) {
    return 'IN_SERVICE_INSPECTION';
  }

  // 2. If client explicitly conducted an in-service inspection check
  if (
    client === 'in_service_inspection' ||
    client.includes('in-service') ||
    client.includes('in_service')
  ) {
    return 'IN_SERVICE_INSPECTION';
  }

  // 3. Periodic or Subsequent re-verification
  if (
    dbType.includes('re-verification') ||
    dbType.includes('reverification') ||
    dbType.includes('periodic') ||
    dbType.includes('subsequent') ||
    dbType.includes('repair') ||
    client === 'subsequent_verification'
  ) {
    return 'SUBSEQUENT_VERIFICATION';
  }

  // 4. Default is Initial Verification
  return 'INITIAL_VERIFICATION';
}

function createMockStore() {
  return {
    profiles: [
      { id: 'user-biz-1', role: 'business', name: 'Acme Weighing Ltd' },
      { id: 'user-biz-2', role: 'business', name: 'Beta Industries' },
      { id: 'user-off-1', role: 'officer', name: 'Inspector Sharma' },
      { id: 'user-off-2', role: 'officer', name: 'Inspector Patel' }
    ],
    officers: [
      { id: 'off-1', user_id: 'user-off-1' },
      { id: 'off-2', user_id: 'user-off-2' }
    ],
    instruments: [
      { id: 'inst-1', category: 'Class III Platform Scale', status: 'under_verification' },
      { id: 'inst-2', category: 'Class II Electronic Balance', status: 'under_verification' },
      { id: 'inst-3', category: 'Fuel Dispenser', status: 'active' }
    ],
    applications: [
      {
        id: 'app-initial',
        application_number: 'APP-INIT-001',
        applicant_id: 'user-biz-1',
        instrument_id: 'inst-1',
        status: 'assigned',
        assigned_officer_id: 'off-1',
        application_type: 'Initial Verification'
      },
      {
        id: 'app-periodic',
        application_number: 'APP-PERIODIC-002',
        applicant_id: 'user-biz-1',
        instrument_id: 'inst-2',
        status: 'assigned',
        assigned_officer_id: 'off-1',
        application_type: 'Periodic Re-verification'
      },
      {
        id: 'app-inservice',
        application_number: 'APP-INSPECT-003',
        applicant_id: 'user-biz-2',
        instrument_id: 'inst-3',
        status: 'assigned',
        assigned_officer_id: 'off-1',
        application_type: 'In-Service Inspection'
      }
    ],
    verification_results: [],
    certificates: [],
    app_timeline: []
  };
}

async function simulateSubmitVerification(store, callerUser, payload) {
  const profile = store.profiles.find(p => p.id === callerUser.id);
  if (!profile || profile.role !== 'officer') {
    throw new Error('Unauthorized. Only Officers can submit verification results.');
  }

  const officer = store.officers.find(o => o.user_id === callerUser.id);
  if (!officer) throw new Error('Officer profile not found');

  const app = store.applications.find(a => a.id === payload.applicationId);
  if (!app) throw new Error('Application not found');

  if (app.assigned_officer_id !== officer.id) {
    throw new Error('Unauthorized. You are not assigned to this application.');
  }

  if (payload.outcome === 'FAIL' && (!payload.rejection_reason || !payload.rejection_reason.trim())) {
    throw new Error('Rejection reason is required when outcome is FAIL.');
  }

  // Insert verification result
  store.verification_results.push({
    id: `vr-${store.verification_results.length + 1}`,
    application_id: app.id,
    outcome: payload.outcome,
    rejection_reason: payload.outcome === 'FAIL' ? payload.rejection_reason : null
  });

  const newStatus = payload.outcome === 'PASS' ? 'passed' : 'failed';
  app.status = newStatus;

  // Log verification event
  store.app_timeline.push({
    application_id: app.id,
    event_type: 'VERIFICATION',
    step: `Verification ${payload.outcome}`
  });

  const verificationStage = deriveVerificationStage(
    app.application_type,
    payload.technical_test_results?.verificationStage
  );

  let certificate = null;
  let certificateStatus = null;
  let responseMessage = payload.outcome === 'PASS'
    ? 'Verification passed successfully.'
    : 'Verification failed and inspection record logged.';

  // Automatic Certificate Generation ONLY for INITIAL_VERIFICATION and SUBSEQUENT_VERIFICATION
  if (newStatus === 'passed') {
    if (verificationStage === 'IN_SERVICE_INSPECTION') {
      certificate = null;
      certificateStatus = null;
      responseMessage = 'In-service surveillance inspection completed and verified compliant. No certificate generated for in-service inspections.';
    } else {
      let existingCert = store.certificates.find(c => c.application_id === app.id);
      if (existingCert) {
        certificate = existingCert;
        certificateStatus = 'issued';
      } else {
        const certNum = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const newCert = {
          id: `cert-${store.certificates.length + 1}`,
          application_id: app.id,
          certificate_number: certNum,
          verification_stage: verificationStage
        };
        store.certificates.push(newCert);

        store.app_timeline.push({
          application_id: app.id,
          event_type: 'CERTIFICATE_GENERATED',
          step: 'Certificate Issued Automatically'
        });

        certificate = newCert;
        certificateStatus = 'issued';
      }
    }
  }

  return {
    success: true,
    outcome: payload.outcome,
    applicationStatus: newStatus,
    certificate: certificate ? {
      id: certificate.id,
      certificateNumber: certificate.certificate_number
    } : null,
    certificateStatus,
    verificationStage,
    message: responseMessage
  };
}

// ------------------------------------------------------------------
// TEST A: Initial PASS -> Certificate generated
// ------------------------------------------------------------------
console.log('--- TEST A: Initial Verification PASS ---');
let store = createMockStore();
let resA = await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-initial',
  outcome: 'PASS'
});
assert.strictEqual(resA.verificationStage, 'INITIAL_VERIFICATION');
assert.strictEqual(resA.applicationStatus, 'passed');
assert.strictEqual(resA.certificateStatus, 'issued');
assert.ok(resA.certificate?.certificateNumber);
assert.strictEqual(store.certificates.length, 1);
console.log('TEST A PASSED: Initial Verification PASS generates certificate.\n');

// ------------------------------------------------------------------
// TEST B: Subsequent/Periodic PASS -> Certificate generated
// ------------------------------------------------------------------
console.log('--- TEST B: Subsequent / Periodic PASS ---');
let resB = await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-periodic',
  outcome: 'PASS'
});
assert.strictEqual(resB.verificationStage, 'SUBSEQUENT_VERIFICATION');
assert.strictEqual(resB.applicationStatus, 'passed');
assert.strictEqual(resB.certificateStatus, 'issued');
assert.ok(resB.certificate?.certificateNumber);
assert.strictEqual(store.certificates.length, 2);
console.log('TEST B PASSED: Subsequent Re-verification PASS generates certificate.\n');

// ------------------------------------------------------------------
// TEST C: In-Service Inspection PASS -> NO certificate
// ------------------------------------------------------------------
console.log('--- TEST C: In-Service Inspection PASS ---');
let resC = await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-inservice',
  outcome: 'PASS'
});
assert.strictEqual(resC.verificationStage, 'IN_SERVICE_INSPECTION');
assert.strictEqual(resC.applicationStatus, 'passed');
assert.strictEqual(resC.certificate, null);
assert.strictEqual(resC.certificateStatus, null);
assert.strictEqual(store.certificates.length, 2, 'No new certificate should be added for in-service inspection');
const inServiceCertTimeline = store.app_timeline.filter(t => t.application_id === 'app-inservice' && t.event_type === 'CERTIFICATE_GENERATED');
assert.strictEqual(inServiceCertTimeline.length, 0, 'No CERTIFICATE_GENERATED event should be logged for in-service inspection');
console.log('TEST C PASSED: In-Service Inspection PASS does NOT generate a certificate.\n');

// ------------------------------------------------------------------
// TEST D: FAIL -> NO certificate
// ------------------------------------------------------------------
console.log('--- TEST D: FAIL (Any stage) ---');
store = createMockStore();
let resD = await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-initial',
  outcome: 'FAIL',
  rejection_reason: 'Observed reading exceeded MPE bounds'
});
assert.strictEqual(resD.applicationStatus, 'failed');
assert.strictEqual(resD.certificate, null);
assert.strictEqual(resD.certificateStatus, null);
assert.strictEqual(store.certificates.length, 0);
console.log('TEST D PASSED: FAIL generates NO certificate.\n');

// ------------------------------------------------------------------
// TEST E: FAIL -> Subsequent Re-Verification PASS -> Certificate generated
// ------------------------------------------------------------------
console.log('--- TEST E: FAIL -> Subsequent Re-Verification PASS ---');
// 2nd attempt on app-initial after recalibration
let resE = await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-initial',
  outcome: 'PASS',
  technical_test_results: { verificationStage: 'SUBSEQUENT_VERIFICATION' }
});
assert.strictEqual(resE.applicationStatus, 'passed');
assert.strictEqual(resE.certificateStatus, 'issued');
assert.ok(resE.certificate?.certificateNumber);
assert.strictEqual(store.certificates.length, 1);
assert.strictEqual(store.verification_results.length, 2);
console.log('TEST E PASSED: Historical FAIL retained, subsequent PASS generates certificate.\n');

// ------------------------------------------------------------------
// TEST F: Duplicate certificate retry -> Idempotent
// ------------------------------------------------------------------
console.log('--- TEST F: Duplicate certificate retry ---');
let resF = await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-initial',
  outcome: 'PASS'
});
assert.strictEqual(store.certificates.length, 1, 'Certificate count must remain 1');
assert.strictEqual(resF.certificate.certificateNumber, resE.certificate.certificateNumber);
console.log('TEST F PASSED: Duplicate verification PASS returns existing certificate idempotently.\n');

// ------------------------------------------------------------------
// TEST G: Officer authorization checks
// ------------------------------------------------------------------
console.log('--- TEST G: Officer authorization checks ---');
try {
  await simulateSubmitVerification(store, { id: 'user-off-2' }, {
    applicationId: 'app-initial',
    outcome: 'PASS'
  });
  assert.fail('Should have rejected unassigned officer');
} catch (err) {
  assert.strictEqual(err.message, 'Unauthorized. You are not assigned to this application.');
}
console.log('TEST G PASSED: Officer authorization remains intact and secure.\n');

// ------------------------------------------------------------------
// TEST H: Business visibility
// ------------------------------------------------------------------
console.log('--- TEST H: Business visibility ---');
// Biz 1 owns app-initial (passed + cert issued)
const biz1App = store.applications.find(a => a.id === 'app-initial' && a.applicant_id === 'user-biz-1');
const biz1Cert = store.certificates.find(c => c.application_id === biz1App.id);
assert.ok(biz1Cert, 'Business 1 should have certificate visible for Initial PASS');

// Biz 2 owns app-inservice (passed + in-service inspection, no cert)
// Run in-service inspection pass on app-inservice for Biz 2
await simulateSubmitVerification(store, { id: 'user-off-1' }, {
  applicationId: 'app-inservice',
  outcome: 'PASS'
});
const biz2App = store.applications.find(a => a.id === 'app-inservice' && a.applicant_id === 'user-biz-2');
const biz2Cert = store.certificates.find(c => c.application_id === biz2App.id);
assert.strictEqual(biz2Cert, undefined, 'Business 2 should NOT have a certificate for In-Service inspection');
assert.strictEqual(biz2App.status, 'passed', 'Business 2 application should still reflect passed inspection status');
console.log('TEST H PASSED: Initial/Subsequent PASS shows certificate, In-Service PASS shows passed inspection without certificate.\n');

console.log('====================================================');
console.log('ALL TESTS A THROUGH H PASSED COMPLETELY!');
console.log('====================================================');
