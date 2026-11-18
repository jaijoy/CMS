/* =========================================================
   STRICT ROLE-BASED CONFIGURATION & CREDENTIALS
   ========================================================= */
const STORAGE_KEY = 'quad_clinic_admin_staff_v1';
const SESSION_KEY = 'quad_clinic_active_session';

// Strict Administrator Account
const ADMIN_ACCOUNT = {
  role: 'Admin',
  email: 'admin@quadclinic.com',
  username: 'admin',
  password: 'admin123',
  displayName: 'Mr.ADMIN'
};

// Default Role Accounts for testing all roles immediately
const DEFAULT_ROLE_ACCOUNTS = {
  'Receptionist':   { email: 'reception@quadclinic.com', pass: 'rec123',   empId: 'EMP-1001', name: 'Anjali Menon' },
  'Doctor':         { email: 'doctor@quadclinic.com',    pass: 'doc123',   empId: 'EMP-1002', name: 'Dr. Arvind Nair' },
  'Lab Technician': { email: 'lab@quadclinic.com',       pass: 'lab123',   empId: 'EMP-1004', name: 'Rahul Vijayan' },
  'Pharmacist':     { email: 'pharmacy@quadclinic.com',  pass: 'pharm123', empId: 'EMP-1005', name: 'Sneha Thomas' }
};

// Optional external teammate files:
// Keep null so it NEVER triggers "Cannot GET /receptionist.html".
// When your teammates merge their HTML files later, you can set e.g. 'Receptionist': 'receptionist.html'
const EXTERNAL_TEAMMATE_FILES = {
  'Receptionist':   null,
  'Doctor':         null,
  'Lab Technician': null,
  'Pharmacist':     null
};

const DEFAULT_STAFF = [
  {
    id: 'REC-101',
    empId: 'EMP-1001',
    role: 'Receptionist',
    name: 'Anjali Menon',
    contact: '9847011223',
    age: '26',
    gender: 'Female',
    address: 'Pattom, Trivandrum',
    salary: '24,000'
  },
  {
    id: 'DOC-102',
    empId: 'EMP-1002',
    role: 'Doctor',
    name: 'Dr. Arvind Nair',
    contact: '9447122334',
    age: '41',
    gender: 'Male',
    address: 'Kowdiar, Trivandrum',
    salary: '95,000'
  },
  {
    id: 'DOC-103',
    empId: 'EMP-1003',
    role: 'Doctor',
    name: 'Dr. Meera Krishnan',
    contact: '9895233445',
    age: '36',
    gender: 'Female',
    address: 'Vazhuthacaud, TVM',
    salary: '88,000'
  },
  {
    id: 'LAB-104',
    empId: 'EMP-1004',
    role: 'Lab Technician',
    name: 'Rahul Vijayan',
    contact: '9746344556',
    age: '29',
    gender: 'Male',
    address: 'Kazhakootam, TVM',
    salary: '28,500'
  },
  {
    id: 'PHA-105',
    empId: 'EMP-1005',
    role: 'Pharmacist',
    name: 'Sneha Thomas',
    contact: '9633455667',
    age: '27',
    gender: 'Female',
    address: 'Kesavadasapuram',
    salary: '30,000'
  },
  {
    id: 'REC-106',
    empId: 'EMP-1006',
    role: 'Receptionist',
    name: 'Vishnu Prasad',
    contact: '9567566778',
    age: '24',
    gender: 'Male',
    address: 'Sreekaryam, TVM',
    salary: '22,500'
  }
];

let staffList = [];
let currentRoleFilter = 'ALL';

/* =========================================================
   DATABASE INITIALIZATION
   ========================================================= */
function loadDatabase() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      staffList = JSON.parse(saved);
    } else {
      staffList = JSON.parse(JSON.stringify(DEFAULT_STAFF));
      saveDatabase();
    }
  } catch (e) {
    staffList = JSON.parse(JSON.stringify(DEFAULT_STAFF));
  }
}

function saveDatabase() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staffList));
  } catch (e) {}
}

/* =========================================================
   STRICT SESSION & AUTHORIZATION GUARD
   ========================================================= */
function getActiveSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function isAdminAuthenticated() {
  const session = getActiveSession();
  return Boolean(session && session.role === 'Admin' && session.authenticated === true);
}

// Blocks any non-admin from invoking Admin UI or CRUD operations
function requireAdminAuth() {
  if (!isAdminAuthenticated()) {
    lockDownToLogin('Unauthorized access blocked. Administrator privileges required.');
    return false;
  }
  return true;
}

function hideAllTopViews() {
  document.getElementById('view-login').classList.remove('active');
  document.getElementById('view-admin').classList.remove('active');
  document.getElementById('view-staff-portal').classList.remove('active');
}

function lockDownToLogin(errorMessage) {
  sessionStorage.removeItem(SESSION_KEY);
  hideAllTopViews();
  document.getElementById('view-login').classList.add('active');

  if (errorMessage) {
    showLoginError(errorMessage);
  }
}

/* =========================================================
   STRICT ROLE-BASED LOGIN HANDLER
   ========================================================= */
function clearLoginError() {
  const errBox = document.getElementById('loginErrorAlert');
  if (errBox) {
    errBox.style.display = 'none';
    errBox.textContent = '';
  }
}

function showLoginError(msg) {
  const errBox = document.getElementById('loginErrorAlert');
  if (errBox) {
    errBox.textContent = msg;
    errBox.style.display = 'block';
  }
}

function handleRoleSelectionChange(selectedRole) {
  clearLoginError();
  const emailInput = document.getElementById('loginEmail');
  if (!emailInput) return;

  if (selectedRole === 'Admin') {
    emailInput.placeholder = 'Admin Email (admin@quadclinic.com)';
  } else {
    emailInput.placeholder = `${selectedRole} Email or EMP ID (e.g. EMP-1001)`;
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  clearLoginError();

  const role = document.getElementById('loginRole').value;
  const emailInput = document.getElementById('loginEmail').value.trim().toLowerCase();
  const passwordInput = document.getElementById('loginPassword').value.trim();

  if (!role) {
    showLoginError('Please select your role from the dropdown list.');
    return;
  }

  // =========================================================
  // CASE 1: ADMINISTRATOR LOGIN (Strictly checks Admin credentials)
  // =========================================================
  if (role === 'Admin') {
    const isValidAdminUser =
      emailInput === ADMIN_ACCOUNT.email || emailInput === ADMIN_ACCOUNT.username;
    const isValidAdminPass = passwordInput === ADMIN_ACCOUNT.password;

    if (!isValidAdminUser || !isValidAdminPass) {
      showLoginError('Invalid Administrator credentials. Use admin@quadclinic.com / admin123.');
      return;
    }

    const adminSession = {
      role: 'Admin',
      name: ADMIN_ACCOUNT.displayName,
      email: ADMIN_ACCOUNT.email,
      authenticated: true,
      loginTime: new Date().toISOString()
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(adminSession));
    localStorage.setItem('quad_logged_in_user', JSON.stringify(adminSession));

    hideAllTopViews();
    document.getElementById('view-admin').classList.add('active');
    openAdminSubscreen('home');
    showToast('Authenticated as Administrator (Mr.ADMIN).');
    return;
  }

  // =========================================================
  // CASE 2: NON-ADMIN ROLES (Receptionist, Doctor, Lab Technician, Pharmacist)
  // =========================================================
  if (emailInput === ADMIN_ACCOUNT.email || emailInput === ADMIN_ACCOUNT.username) {
    showLoginError(`Role Mismatch: Administrator account cannot log in as ${role}.`);
    return;
  }

  const roleDefault = DEFAULT_ROLE_ACCOUNTS[role];
  const matchedDefault =
    roleDefault &&
    emailInput === roleDefault.email.toLowerCase() &&
    passwordInput === roleDefault.pass;

  // Check if a staff member added by Admin in localStorage matches the selected Role
  const matchedStaffMember = staffList.find(
    staff =>
      staff.role === role &&
      (staff.empId.toLowerCase() === emailInput ||
       staff.name.toLowerCase() === emailInput) &&
      (passwordInput.toLowerCase() === staff.empId.toLowerCase() ||
       passwordInput === roleDefault?.pass ||
       passwordInput === '123456')
  );

  // Check if user entered an EMP ID belonging to a DIFFERENT role
  const wrongRoleRecord = staffList.find(
    staff =>
      staff.role !== role &&
      (staff.empId.toLowerCase() === emailInput || staff.name.toLowerCase() === emailInput)
  );

  if (wrongRoleRecord) {
    showLoginError(
      `Access Denied: ${wrongRoleRecord.name} (${wrongRoleRecord.empId}) is registered as ${wrongRoleRecord.role}, not ${role}.`
    );
    return;
  }

  if (!matchedDefault && !matchedStaffMember) {
    showLoginError(
      `Invalid ${role} credentials. Use ${roleDefault.email} / ${roleDefault.pass} or your assigned EMP ID.`
    );
    return;
  }

  const resolvedRecord = matchedStaffMember || staffList.find(s => s.empId === roleDefault.empId) || {
    empId: roleDefault.empId,
    name: roleDefault.name,
    role: role,
    contact: 'Verified Clinic Line',
    address: 'Quad Clinic Campus'
  };

  const staffSession = {
    role: role,
    empId: resolvedRecord.empId,
    name: resolvedRecord.name,
    contact: resolvedRecord.contact || 'N/A',
    address: resolvedRecord.address || 'N/A',
    email: emailInput,
    authenticated: true,
    loginTime: new Date().toISOString()
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(staffSession));
  localStorage.setItem('quad_logged_in_user', JSON.stringify(staffSession));

  // If an external teammate HTML file is explicitly configured, redirect there;
  // Otherwise open the built-in isolated Staff Portal view so "Cannot GET" NEVER happens.
  const externalFile = EXTERNAL_TEAMMATE_FILES[role];
  if (externalFile) {
    window.location.href = externalFile;
  } else {
    openIsolatedStaffPortal(staffSession);
  }
}

function logoutSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('quad_logged_in_user');
  const form = document.getElementById('quadLoginForm');
  if (form) form.reset();
  clearLoginError();

  hideAllTopViews();
  document.getElementById('view-login').classList.add('active');
  showToast('Logged out securely.');
}

function handleForgotPassword() {
  showToast('Please contact the Clinic System Administrator to reset your password.');
}

/* =========================================================
   ISOLATED STAFF PORTAL VIEW (STRICTLY BLOCKS ADMIN ACCESS)
   ========================================================= */
function openIsolatedStaffPortal(session) {
  hideAllTopViews();
  document.getElementById('view-staff-portal').classList.add('active');

  document.getElementById('staffPortalRoleHeading').textContent = session.role.toUpperCase();
  document.getElementById('staffPortalUserName').textContent = session.name;
  document.getElementById('staffPortalEmpId').textContent = session.empId;

  const doctors = staffList.filter(s => s.role === 'Doctor');
  const doctorRows = doctors
    .map(
      d => `
      <tr>
        <td><strong>${escapeHtml(d.empId)}</strong></td>
        <td>${escapeHtml(d.name)}</td>
        <td>${escapeHtml(d.contact)}</td>
        <td>Available</td>
      </tr>`
    )
    .join('');

  const roleModules = {
    'Receptionist': {
      title: 'Receptionist Front-Desk Workspace',
      summary: 'Authorized for Patient Registration, Token Queue & Doctor Appointment Scheduling only.',
      tableHeaders: ['Doctor EMP ID', 'Doctor Name', 'Clinic Contact', 'OPD Status'],
      tableRows: doctorRows || '<tr><td colspan="4">No doctors registered yet.</td></tr>'
    },
    'Doctor': {
      title: 'Doctor Consultation & OPD Workspace',
      summary: 'Authorized for Patient Consultation, Diagnosis Notes, Lab Orders & Prescriptions only.',
      tableHeaders: ['Token / ID', 'Doctor On Duty', 'Department Contact', 'Session Status'],
      tableRows: `
        <tr>
          <td><strong>${escapeHtml(session.empId)}</strong></td>
          <td>${escapeHtml(session.name)}</td>
          <td>${escapeHtml(session.contact)}</td>
          <td>Active OPD Consultation</td>
        </tr>`
    },
    'Lab Technician': {
      title: 'Clinical Laboratory Diagnostics Workspace',
      summary: 'Authorized for Sample Collection, Hematology/Biochemistry Tests & Lab Report Entry only.',
      tableHeaders: ['Technician ID', 'Assigned Specialist', 'Lab Contact', 'Equipment Status'],
      tableRows: `
        <tr>
          <td><strong>${escapeHtml(session.empId)}</strong></td>
          <td>${escapeHtml(session.name)}</td>
          <td>${escapeHtml(session.contact)}</td>
          <td>Diagnostics Online</td>
        </tr>`
    },
    'Pharmacist': {
      title: 'Pharmacy Dispensing & Inventory Workspace',
      summary: 'Authorized for Prescription Verification, Medicine Dispensing & Stock Alerts only.',
      tableHeaders: ['Pharmacist ID', 'On-Duty Pharmacist', 'Dispensary Contact', 'Counter Status'],
      tableRows: `
        <tr>
          <td><strong>${escapeHtml(session.empId)}</strong></td>
          <td>${escapeHtml(session.name)}</td>
          <td>${escapeHtml(session.contact)}</td>
          <td>Dispensary Open</td>
        </tr>`
    }
  };

  const cfg = roleModules[session.role] || roleModules['Receptionist'];

  document.getElementById('staffPortalContent').innerHTML = `
    <div class="staff-portal-banner">
      <h2>${escapeHtml(cfg.title)}</h2>
      <span class="rbac-lock-badge">Admin Controls Locked (${escapeHtml(session.role)} Role)</span>
    </div>

    <div class="staff-profile-card">
      <div><strong>Authenticated Staff</strong>${escapeHtml(session.name)}</div>
      <div><strong>Assigned Role</strong>${escapeHtml(session.role)}</div>
      <div><strong>Employee ID</strong>${escapeHtml(session.empId)}</div>
      <div><strong>Access Scope</strong>${escapeHtml(cfg.summary)}</div>
    </div>

    <div class="wf-table-frame">
      <table class="wf-grid-table">
        <thead>
          <tr>
            ${cfg.tableHeaders.map(h => `<th>${escapeHtml(h)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${cfg.tableRows}
        </tbody>
      </table>
    </div>
  `;

  showToast(`Logged in as ${session.role}: ${session.name}`);
}

/* =========================================================
   ADMIN SUB-SCREEN NAVIGATION (GUARDED BY requireAdminAuth)
   ========================================================= */
function openAdminSubscreen(sub) {
  if (!requireAdminAuth()) return;

  document.querySelectorAll('.admin-subscreen').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.side-nav-btn').forEach(el => el.classList.remove('active-nav'));

  const roleHeading = document.getElementById('sidebarRoleTitle');
  const userName = document.getElementById('sidebarUserName');
  const logoutText = document.getElementById('logoutLabelText');

  if (sub === 'home') {
    document.getElementById('admin-sub-home').classList.add('active');
    document.getElementById('sideBtnHome').classList.add('active-nav');

    roleHeading.textContent = 'ADMINISTRATOR';
    roleHeading.classList.remove('title-case');
    userName.textContent = 'Mr.ADMIN';
    userName.classList.remove('blue-text');
    logoutText.textContent = 'Logout';
    logoutText.classList.remove('blue-logout');
  } else if (sub === 'add') {
    document.getElementById('admin-sub-add').classList.add('active');
    document.getElementById('sideBtnAdd').classList.add('active-nav');

    roleHeading.textContent = 'Administrator';
    roleHeading.classList.add('title-case');
    userName.textContent = 'Mr.ADMIN';
    userName.classList.remove('blue-text');
    logoutText.textContent = 'Log Out';
    logoutText.classList.remove('blue-logout');
  } else if (sub === 'table') {
    document.getElementById('admin-sub-table').classList.add('active');
    document.getElementById('sideBtnTable').classList.add('active-nav');

    roleHeading.textContent = 'ADMINISTRATOR';
    roleHeading.classList.remove('title-case');
    userName.textContent = 'Mr.Admin';
    userName.classList.add('blue-text');
    logoutText.textContent = 'Log Out';
    logoutText.classList.add('blue-logout');

    renderStaffTable();
  }
}

/* =========================================================
   MANAGE STAFF & MANAGE DOCTOR CARDS
   ========================================================= */
function handleManageCardClick(type) {
  if (!requireAdminAuth()) return;

  if (type === 'DOCTOR') {
    setRoleFilter('Doctor');
    openAdminSubscreen('table');
  } else {
    setRoleFilter('ALL');
    openAdminSubscreen('table');
  }
}

/* =========================================================
   ADD & EDIT STAFF FORM LOGIC (ADMIN ONLY)
   ========================================================= */
function generateNextEmpId() {
  const maxNum = staffList.reduce((acc, item) => {
    const match = String(item.empId).match(/\d+/);
    const num = match ? parseInt(match[0], 10) : 1000;
    return Math.max(acc, num);
  }, 1000);
  return `EMP-${maxNum + 1}`;
}

function openAddStaffForm(defaultRole) {
  if (!requireAdminAuth()) return;

  const form = document.getElementById('staffRegForm');
  form.reset();
  document.getElementById('editRecordId').value = '';

  const selectedRole = defaultRole || (currentRoleFilter !== 'ALL' ? currentRoleFilter : 'Receptionist');
  document.getElementById('staffRole').value = selectedRole;
  document.getElementById('staffEmpId').value = generateNextEmpId();

  handleFormRoleChange(selectedRole);
  document.getElementById('staffSubmitBtn').textContent = 'Submit';
  openAdminSubscreen('add');
}

function handleFormRoleChange(role) {
  const editId = document.getElementById('editRecordId').value;
  const heading = document.getElementById('staffFormHeading');
  if (editId) {
    heading.textContent = `EDIT ${role.toUpperCase()} DETAILS`;
  } else {
    heading.textContent = role === 'Doctor' ? 'ADD DOCTOR DETAILS' : 'ADD STAFF DETAILS';
  }
}

function handleSaveStaff(event) {
  event.preventDefault();
  if (!requireAdminAuth()) return;

  const editId = document.getElementById('editRecordId').value.trim();
  const role = document.getElementById('staffRole').value;
  const name = document.getElementById('staffName').value.trim();
  const contact = document.getElementById('staffContact').value.trim();
  const age = document.getElementById('staffAge').value.trim();
  const gender = document.getElementById('staffGender').value.trim();
  const address = document.getElementById('staffAddress').value.trim();
  const salary = document.getElementById('staffSalary').value.trim();
  const empId = document.getElementById('staffEmpId').value.trim();

  if (editId) {
    const idx = staffList.findIndex(item => item.id === editId);
    if (idx !== -1) {
      staffList[idx] = { ...staffList[idx], role, name, contact, age, gender, address, salary, empId };
      saveDatabase();
      showToast(`Updated ${role}: ${name} (${empId})`);
    }
  } else {
    const prefix = role.substring(0, 3).toUpperCase();
    const newRecord = {
      id: `${prefix}-${Date.now()}`,
      empId,
      role,
      name,
      contact,
      age,
      gender,
      address,
      salary
    };
    staffList.unshift(newRecord);
    saveDatabase();
    showToast(`Added ${role}: ${name} (${empId}). They can now log in with ${empId}.`);
  }

  setRoleFilter('ALL');
  openAdminSubscreen('table');
}

/* =========================================================
   SEARCH, FILTER, EDIT & DELETE TABLE LOGIC (ADMIN ONLY)
   ========================================================= */
function setRoleFilter(role) {
  if (!requireAdminAuth()) return;

  currentRoleFilter = role;
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
  const activeChip = document.getElementById(`chip-${role}`);
  if (activeChip) activeChip.classList.add('active');
  renderStaffTable();
}

function renderStaffTable() {
  if (!requireAdminAuth()) return;

  const tbody = document.getElementById('staffGridBody');
  if (!tbody) return;

  const query = (document.getElementById('staffSearchInput')?.value || '').trim().toLowerCase();

  const filtered = staffList.filter(item => {
    const matchesRole = currentRoleFilter === 'ALL' || item.role === currentRoleFilter;
    const matchesQuery =
      !query ||
      item.empId.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query) ||
      item.contact.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query);
    return matchesRole && matchesQuery;
  });

  // Maintain 9 wireframe rows to match the reference screenshot
  const TOTAL_WIREFRAME_ROWS = Math.max(9, filtered.length);
  let rowsHtml = '';

  for (let i = 0; i < TOTAL_WIREFRAME_ROWS; i++) {
    const staff = filtered[i];
    if (staff) {
      rowsHtml += `
        <tr>
          <td><strong>${escapeHtml(staff.empId)}</strong></td>
          <td style="text-align:left; padding-left:10px;">
            ${escapeHtml(staff.name)}
            <span class="role-mini-badge">${escapeHtml(staff.role)}</span>
          </td>
          <td>${escapeHtml(staff.contact)}</td>
          <td>${escapeHtml(staff.gender)}</td>
          <td>${escapeHtml(staff.address)}</td>
          <td>${escapeHtml(staff.age)}</td>
          <td>
            <div class="wf-row-actions">
              <button type="button" class="wf-btn-edit" onclick="editStaffRecord('${staff.id}')">EDIT</button>
              <button type="button" class="wf-btn-delete" onclick="deleteStaffRecord('${staff.id}')">DELETE</button>
            </div>
          </td>
        </tr>
      `;
    } else {
      rowsHtml += `
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>
            <div class="wf-row-actions">
              <button type="button" class="wf-btn-edit" disabled>EDIT</button>
              <button type="button" class="wf-btn-delete" disabled>DELETE</button>
            </div>
          </td>
        </tr>
      `;
    }
  }

  tbody.innerHTML = rowsHtml;
}

function editStaffRecord(id) {
  if (!requireAdminAuth()) return;

  const rec = staffList.find(item => item.id === id);
  if (!rec) return;

  document.getElementById('editRecordId').value = rec.id;
  document.getElementById('staffRole').value = rec.role;
  document.getElementById('staffName').value = rec.name;
  document.getElementById('staffContact').value = rec.contact;
  document.getElementById('staffAge').value = rec.age;
  document.getElementById('staffGender').value = rec.gender;
  document.getElementById('staffAddress').value = rec.address;
  document.getElementById('staffSalary').value = rec.salary;
  document.getElementById('staffEmpId').value = rec.empId;

  handleFormRoleChange(rec.role);
  document.getElementById('staffSubmitBtn').textContent = 'Update';
  openAdminSubscreen('add');
}

function deleteStaffRecord(id) {
  if (!requireAdminAuth()) return;

  const idx = staffList.findIndex(item => item.id === id);
  if (idx === -1) return;
  const removed = staffList[idx];
  staffList.splice(idx, 1);
  saveDatabase();
  renderStaffTable();
  showToast(`Deleted ${removed.role}: ${removed.name} (${removed.empId})`);
}

/* =========================================================
   UTILITIES & INITIALIZATION
   ========================================================= */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('quadToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3200);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Restore active session on refresh without allowing unauthorized role escalation
window.addEventListener('DOMContentLoaded', () => {
  loadDatabase();

  const session = getActiveSession();
  if (!session || !session.authenticated) {
    lockDownToLogin();
    return;
  }

  if (session.role === 'Admin') {
    hideAllTopViews();
    document.getElementById('view-admin').classList.add('active');
    openAdminSubscreen('home');
  } else {
    openIsolatedStaffPortal(session);
  }
});