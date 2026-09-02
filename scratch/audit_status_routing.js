import { INITIAL_APPLICATIONS } from '../frontend/src/data/initialData.js';
import {
  STATUS_CATEGORIES,
  calculateLmdDashboardCounts,
  getActionableLmdApplications,
  getApplicationStatusCategory
} from '../frontend/src/utils/statusClassification.js';

console.log('====================================================');
console.log('AUDIT TEST 1: CURRENT DATASET (INITIAL_APPLICATIONS)');
console.log('====================================================');

console.log(`Total applications: ${INITIAL_APPLICATIONS.length}`);
const counts = calculateLmdDashboardCounts(INITIAL_APPLICATIONS);
console.log('Computed Category Counts:');
console.log(`  NEW:             ${counts[STATUS_CATEGORIES.NEW]}`);
console.log(`  IN PROGRESS:     ${counts[STATUS_CATEGORIES.IN_PROGRESS]}`);
console.log(`  AWAITING ASSIGN: ${counts[STATUS_CATEGORIES.AWAITING_ASSIGN]}`);
console.log(`  VERIFICATION:    ${counts[STATUS_CATEGORIES.VERIFICATION]}`);
console.log(`  COMPLETED:       ${counts[STATUS_CATEGORIES.COMPLETED]}`);
console.log(`  TOTAL:           ${counts.total}`);

const sumCategories = counts[STATUS_CATEGORIES.NEW] +
  counts[STATUS_CATEGORIES.IN_PROGRESS] +
  counts[STATUS_CATEGORIES.AWAITING_ASSIGN] +
  counts[STATUS_CATEGORIES.VERIFICATION] +
  counts[STATUS_CATEGORIES.COMPLETED];

console.log(`Check: sum(${sumCategories}) === total(${counts.total}) -> ${sumCategories === counts.total ? 'PASS' : 'FAIL'}`);

console.log('\nPer-application breakdown:');
INITIAL_APPLICATIONS.forEach(app => {
  console.log(`  - [${app.id}] status='${app.status}' assignedOfficerId='${app.assignedOfficerId || 'none'}' => ${getApplicationStatusCategory(app)}`);
});

console.log('\n====================================================');
console.log('AUDIT TEST 2: RE-VERIFICATION & MULTIPLE VERIFICATION RESULTS');
console.log('====================================================');

// Simulate application that failed, was re-inspected, and passed
const reVerificationApp = {
  id: 'fd6e922c-f0e7-4b45-8a1a-9c044ac54700',
  status: 'passed', // latest status after re-verification
  assignedOfficerId: 'officer-uuid-1',
  verificationHistory: [
    { outcome: 'FAIL', rejectionReason: 'MPE exceeded', createdAt: '2026-09-02T08:00:00Z' },
    { outcome: 'PASS', rejectionReason: null, createdAt: '2026-09-02T10:00:00Z' }
  ]
};

// Simulate raw join duplicate test: what if caller passes array with duplicated row from SQL join?
const rawJoinSimulatedApps = [
  reVerificationApp,
  { ...reVerificationApp }, // 2nd row from 1:N join
  { id: 'app-submitted-1', status: 'submitted' },
  { id: 'app-under-review-1', status: 'under_review' }, // no reviewedAt
  { id: 'app-awaiting-assign-1', status: 'under_review', reviewedAt: '2026-09-02T11:00:00Z' }, // reviewedAt set, no assigned officer
  { id: 'app-assigned-1', status: 'assigned', assignedOfficerId: 'officer-uuid-2' }
];

const deduplicatedCounts = calculateLmdDashboardCounts(rawJoinSimulatedApps);
console.log('Counts with 1:N join duplicate rows:');
console.log(deduplicatedCounts);
console.log(`Total unique applications counted: ${deduplicatedCounts.total} (Expected: 5) -> ${deduplicatedCounts.total === 5 ? 'PASS' : 'FAIL'}`);
console.log(`COMPLETED count: ${deduplicatedCounts[STATUS_CATEGORIES.COMPLETED]} (Expected: 1) -> ${deduplicatedCounts[STATUS_CATEGORIES.COMPLETED] === 1 ? 'PASS' : 'FAIL'}`);

console.log('\n====================================================');
console.log('AUDIT TEST 3: ACTIONABLE PREVIEW LOGIC');
console.log('====================================================');

const actionable = getActionableLmdApplications(rawJoinSimulatedApps);
console.log(`Actionable applications count: ${actionable.length}`);
actionable.forEach(a => {
  console.log(`  - [${a.id}] status='${a.status}' category='${getApplicationStatusCategory(a)}' certificateId='${a.certificateId || 'none'}'`);
});
// Verify that 'app-assigned-1' is NOT in actionable (since officer is currently inspecting in field)
const hasAssignedInActionable = actionable.some(a => a.id === 'app-assigned-1');
console.log(`Assigned officer active inspection excluded from LMD actionable queue: ${!hasAssignedInActionable ? 'PASS' : 'FAIL'}`);

// Verify passed without cert IS in actionable:
const hasPassedAwaitingCert = actionable.some(a => a.id === reVerificationApp.id);
console.log(`Passed application without certificate included for LMD cert issuance: ${hasPassedAwaitingCert ? 'PASS' : 'FAIL'}`);
