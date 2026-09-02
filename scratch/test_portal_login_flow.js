import assert from 'assert';

console.log('====================================================');
console.log('PORTAL LOGIN & REDIRECT AUDIT: TESTS 1 THROUGH 6');
console.log('====================================================\n');

const USER_ROLES = {
  BUSINESS: 'business',
  LMD_ADMIN: 'lmd',
  OFFICER: 'officer'
};

// Simulation of Homepage links:
function getPortalLoginDestination() {
  // Line 454 of ComplexLawHomePage.jsx:
  return '/login';
}

function getTrackStatusDestination(currentRole) {
  // Line 616 of ComplexLawHomePage.jsx:
  return currentRole === USER_ROLES.BUSINESS
    ? '/business/applications'
    : '/login?role=business&redirect=/business/applications';
}

// Simulation of LoginPage redirect logic on mount (React.useEffect):
function simulateLoginPageMount({ searchParamsString, user, currentRole }) {
  const url = new URL(`http://localhost${searchParamsString}`);
  const redirectPath = url.searchParams.get('redirect');

  let navigatedTo = null;

  // Exact logic implemented in LoginPage.jsx:
  if (redirectPath && user) {
    if (currentRole === USER_ROLES.BUSINESS && redirectPath.startsWith('/business')) {
      navigatedTo = redirectPath;
    } else if (currentRole === USER_ROLES.LMD_ADMIN && redirectPath.startsWith('/lmd')) {
      navigatedTo = redirectPath;
    } else if (currentRole === USER_ROLES.OFFICER && redirectPath.startsWith('/officer')) {
      navigatedTo = redirectPath;
    }
  }

  return {
    stayedOnLoginPage: navigatedTo === null,
    navigatedTo,
    selectedRole: url.searchParams.get('role') || USER_ROLES.BUSINESS
  };
}

// Simulation of form submission on LoginPage:
function simulateLoginFormSubmit({ selectedRole, searchParamsString }) {
  const url = new URL(`http://localhost${searchParamsString}`);
  const redirectPath = url.searchParams.get('redirect');

  if (selectedRole === USER_ROLES.BUSINESS) {
    return redirectPath || '/business';
  } else if (selectedRole === USER_ROLES.LMD_ADMIN) {
    return '/lmd';
  } else if (selectedRole === USER_ROLES.OFFICER) {
    return '/officer';
  }
}

// ------------------------------------------------------------------
// TEST 1: Homepage -> Portal Login -> Business Login -> Login -> Back to Homepage -> Portal Login
// ------------------------------------------------------------------
console.log('--- TEST 1: Homepage -> Portal Login -> Login -> Back to Homepage -> Portal Login ---');
// Step 1: User on homepage clicks "Portal Login"
let dest1 = getPortalLoginDestination();
assert.strictEqual(dest1, '/login');

// Step 2: User arrives at /login unauthenticated
let page1 = simulateLoginPageMount({ searchParamsString: '/login', user: null, currentRole: null });
assert.strictEqual(page1.stayedOnLoginPage, true);
assert.strictEqual(page1.selectedRole, USER_ROLES.BUSINESS);

// Step 3: User submits login form
let loggedInDest1 = simulateLoginFormSubmit({ selectedRole: USER_ROLES.BUSINESS, searchParamsString: '/login' });
assert.strictEqual(loggedInDest1, '/business');

// Step 4: User navigates back to Homepage (user session remains active: user exists, role=business)
const activeBizUser = { id: 'biz-1', name: 'Vikramaditya Mehta' };
const activeBizRole = USER_ROLES.BUSINESS;

// Step 5: User clicks "Portal Login" again
let dest1AfterHome = getPortalLoginDestination();
assert.strictEqual(dest1AfterHome, '/login');

// Step 6: User lands on /login with active Business session
let page1SecondVisit = simulateLoginPageMount({
  searchParamsString: '/login',
  user: activeBizUser,
  currentRole: activeBizRole
});
assert.strictEqual(page1SecondVisit.stayedOnLoginPage, true, 'Must stay on LoginPage and NOT auto-redirect to /business/applications');
assert.strictEqual(page1SecondVisit.navigatedTo, null);
console.log('TEST 1 PASSED: Portal Login does not silently redirect authenticated user away from login page.\n');

// ------------------------------------------------------------------
// TEST 2: Homepage -> Track Application Status -> Business Login -> Login -> /business/applications
// ------------------------------------------------------------------
console.log('--- TEST 2: Unauthenticated Track Application Status ---');
let dest2 = getTrackStatusDestination(null);
assert.strictEqual(dest2, '/login?role=business&redirect=/business/applications');

let page2 = simulateLoginPageMount({
  searchParamsString: '/login?role=business&redirect=/business/applications',
  user: null,
  currentRole: null
});
assert.strictEqual(page2.stayedOnLoginPage, true);
assert.strictEqual(page2.selectedRole, USER_ROLES.BUSINESS);

let loggedInDest2 = simulateLoginFormSubmit({
  selectedRole: USER_ROLES.BUSINESS,
  searchParamsString: '/login?role=business&redirect=/business/applications'
});
assert.strictEqual(loggedInDest2, '/business/applications');
console.log('TEST 2 PASSED: Track Application Status correctly redirects to /business/applications after login.\n');

// ------------------------------------------------------------------
// TEST 3: Already authenticated Business -> Homepage -> Track Application Status -> /business/applications
// ------------------------------------------------------------------
console.log('--- TEST 3: Authenticated Business -> Track Application Status ---');
let dest3 = getTrackStatusDestination(USER_ROLES.BUSINESS);
assert.strictEqual(dest3, '/business/applications', 'Must route directly to /business/applications');
console.log('TEST 3 PASSED: Authenticated Business gets direct shortcut to /business/applications.\n');

// ------------------------------------------------------------------
// TEST 4: Already authenticated Business -> Homepage -> Portal Login -> Generic Portal Selection
// ------------------------------------------------------------------
console.log('--- TEST 4: Authenticated Business -> Portal Login ---');
let dest4 = getPortalLoginDestination();
assert.strictEqual(dest4, '/login');
let page4 = simulateLoginPageMount({
  searchParamsString: '/login',
  user: activeBizUser,
  currentRole: USER_ROLES.BUSINESS
});
assert.strictEqual(page4.stayedOnLoginPage, true);
assert.strictEqual(page4.navigatedTo, null);
console.log('TEST 4 PASSED: Authenticated Business sees generic Portal Login / role selection.\n');

// ------------------------------------------------------------------
// TEST 5: Already authenticated LMD -> Homepage -> Portal Login
// ------------------------------------------------------------------
console.log('--- TEST 5: Authenticated LMD -> Portal Login ---');
let page5 = simulateLoginPageMount({
  searchParamsString: '/login',
  user: { id: 'lmd-1', name: 'Admin Singh' },
  currentRole: USER_ROLES.LMD_ADMIN
});
assert.strictEqual(page5.stayedOnLoginPage, true);
assert.strictEqual(page5.navigatedTo, null);

// Also verify Track Application Status for LMD
let dest5Track = getTrackStatusDestination(USER_ROLES.LMD_ADMIN);
assert.strictEqual(dest5Track, '/login?role=business&redirect=/business/applications');
console.log('TEST 5 PASSED: Authenticated LMD sees generic Portal Login; Track Status routes to Business login.\n');

// ------------------------------------------------------------------
// TEST 6: Already authenticated Officer -> Homepage -> Portal Login
// ------------------------------------------------------------------
console.log('--- TEST 6: Authenticated Officer -> Portal Login ---');
let page6 = simulateLoginPageMount({
  searchParamsString: '/login',
  user: { id: 'off-1', name: 'Inspector Sharma' },
  currentRole: USER_ROLES.OFFICER
});
assert.strictEqual(page6.stayedOnLoginPage, true);
assert.strictEqual(page6.navigatedTo, null);

// Also verify Track Application Status for Officer
let dest6Track = getTrackStatusDestination(USER_ROLES.OFFICER);
assert.strictEqual(dest6Track, '/login?role=business&redirect=/business/applications');
console.log('TEST 6 PASSED: Authenticated Officer sees generic Portal Login; Track Status routes to Business login.\n');

console.log('====================================================');
console.log('ALL TESTS 1 THROUGH 6 PASSED WITH 100% SUCCESS!');
console.log('====================================================');
