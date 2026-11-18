/* ==========================================================================
   MODULE: QUAD CLINIC SYSTEM - ADMINISTRATOR & AUTHENTICATION ENGINE
   ========================================================================== */

// 1. CONFIGURATION CONSTANTS
const DATABASE_KEY = 'quad_clinic_staff_v5'; // Persists personnel records in localStorage
const SESSION_KEY = 'quad_clinic_session_user';

// Strict Administrator Credentials
const ADMIN_ACCOUNT = {
  role: 'Admin',
  email: 'admin@quadclinic.com',
  username: 'admin',
  password: 'admin123',
  name: 'Mr. ADMIN'
};

// Target Dashboard files for Teammate Modules
const TEAMMATE_PAGES = {
  'Receptionist':   'receptionist.html',
  'Doctor':         'doctor.html',
  'Lab Technician': 'lab.html',
  'Pharmacist':     'pharmacist.html'
};

// Initial Seed Data (All default credentials work out of the box)
const DEFAULT_STAFF = [
  { id: 'REC-101', empId: 'EMP-1001', email: 'reception@quadclinic.com', role: 'Receptionist', name: 'Anjali Menon', contact: '9847011223', age: '26', gender: 'Female', address: 'Pattom, TVM', salary: '24,000', password: 'rec123' },
  { id: 'DOC-102', empId: 'EMP-1002', email: 'doctor@quadclinic.com',    role: 'Doctor',       name: 'Dr. Arvind Nair', contact: '9447122334', age: '41', gender: 'Male', address: 'Kowdiar, TVM', salary: '95,000', password: 'doc123' },
  { id: 'DOC-103', empId: 'EMP-1003', email: 'meera@quadclinic.com',     role: 'Doctor',       name: 'Dr. Meera Krishnan', contact: '9895233445', age: '36', gender: 'Female', address: 'Vazhuthacaud, TVM', salary: '88,000', password: 'doc123' },
  { id: 'LAB-104', empId: 'EMP-1004', email: 'lab@quadclinic.com',       role: 'Lab Technician', name: 'Rahul Vijayan', contact: '9746344556', age: '29', gender: 'Male', address: 'Kazhakootam, TVM', salary: '28,500', password: 'lab123' },
  { id: 'PHA-105', empId: 'EMP-1005', email: 'pharmacy@quadclinic.com',  role: 'Pharmacist',   name: 'Sneha Thomas', contact: '9633455667', age: '27', gender: 'Female', address: 'Kesavadasapuram', salary: '30,000', password: 'pharm123' }
];

let staffList = [];
let currentFilterRole = 'ALL';

/* ==========================================================================
   2. DATABASE PERSISTENCE (LocalStorage CRUD)
   ========================================================================== */
function loadDatabase() {
  try {
    const data = localStorage.getItem(DATABASE_KEY);
    staffList = data ? JSON.parse(data) : JSON.parse(JSON.stringify(DEFAULT_STAFF));
  } catch (err) {
    staffList = JSON.parse(JSON.stringify(DEFAULT_STAFF));
  }
}

function saveDatabase() {
  try {
    localStorage.setItem(DATABASE_KEY, JSON.stringify(staffList));
  } catch (err) {}
}

/* ==========================================================================
   3. AUTHENTICATION & LOGIN HANDLER
   ========================================================================== */
function handleLoginSubmit(event) {
  event.preventDefault();
  hideLoginError();

  const role = document.getElementById('loginRole').value;
  const identifier = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  // Validate dropdown selection
  if (!role) {
    showLoginError('Please select a role from the dropdown.');
    return;
  }

  // Branch A: Administrator Login -> Opens Admin Dashboard
  if (role === 'Admin') {
    const isUserMatch = (identifier.toLowerCase() === ADMIN_ACCOUNT.email || identifier.toLowerCase() === ADMIN_ACCOUNT.username);
    const isPassMatch = (password === ADMIN_ACCOUNT.password);

    if (!isUserMatch || !isPassMatch) {
      showLoginError('Invalid Administrator credentials. Use admin@quadclinic.com / admin123.');
      return;
    }

    const session = { role: 'Admin', name: ADMIN_ACCOUNT.name, authenticated: true };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

    // Transition view from Login to Administrator Dashboard
    document.getElementById('view-login').classList.remove('active');
    document.getElementById('view-admin').classList.add('active');
    openAdminSubscreen('home');
    showToast('Signed in successfully as Administrator.');
    return;
  }

  // Branch B: Clinical Staff Login -> Validates against database and forwards to teammate file
  const query = identifier.toLowerCase();
  const matchedPersonnel = staffList.find(staff => 
    staff.role === role && 
    (
      (staff.email && staff.email.toLowerCase() === query) ||
      (staff.empId && staff.empId.toLowerCase() === query) ||
      (staff.name && staff.name.toLowerCase() === query)
    )
  );

  if (!matchedPersonnel) {
    showLoginError(`No registered ${role} found for "${identifier}". Please check with Admin.`);
    return;
  }

  if (matchedPersonnel.password !== password) {
    showLoginError(`Incorrect password for ${matchedPersonnel.name}.`);
    return;
  }

  // Save session and redirect to teammate's file
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    role: matchedPersonnel.role,
    empId: matchedPersonnel.empId,
    name: matchedPersonnel.name,
    email: matchedPersonnel.email
  }));

  const targetFile = TEAMMATE_PAGES[role];
  if (targetFile) {
    window.location.href = targetFile;
  } else {
    showLoginError(`No dashboard configured for ${role}.`);
  }
}

function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById('quadLoginForm').reset();
  hideLoginError();

  document.getElementById('view-admin').classList.remove('active');
  document.getElementById('view-login').classList.add('active');
  showToast('Logged out of Admin Portal.');
}

function showLoginError(msg) {
  const box = document.getElementById('loginErrorAlert');
  box.textContent = msg;
  box.style.display = 'block';
}

function hideLoginError() {
  const box = document.getElementById('loginErrorAlert');
  box.style.display = 'none';
  box.textContent = '';
}

function handleForgotPassword() {
  showToast('Contact Clinic Admin (Mr. ADMIN) to look up or reset credentials.');
}

/* ==========================================================================
   4. ADMINISTRATOR PORTAL NAVIGATION & SCREENS
   ========================================================================== */
function openAdminSubscreen(screenName) {
  // Hide all screens & deactivate nav buttons
  document.querySelectorAll('.subscreen').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-menu-btn').forEach(btn => btn.classList.remove('active'));

  if (screenName === 'home') {
    document.getElementById('subscreen-home').classList.add('active');
    document.getElementById('btnNavHome').classList.add('active');
  } else if (screenName === 'add') {
    document.getElementById('subscreen-add').classList.add('active');
    document.getElementById('btnNavAdd').classList.add('active');
  } else if (screenName === 'table') {
    document.getElementById('subscreen-table').classList.add('active');
    document.getElementById('btnNavTable').classList.add('active');
    renderStaffTable();
  }
}

function handleManageCardClick(type) {
  setRoleFilter(type === 'DOCTOR' ? 'Doctor' : 'ALL');
  openAdminSubscreen('table');
}

/* ==========================================================================
   5. PERSONNEL CRUD: CREATE & UPDATE
   ========================================================================== */
function generateNextEmpId() {
  const highestId = staffList.reduce((max, item) => {
    const num = parseInt((item.empId || '').replace(/\D/g, '') || 1000, 10);
    return Math.max(max, num);
  }, 1000);
  return `EMP-${highestId + 1}`;
}

function openAddStaffForm(defaultRole) {
  const form = document.getElementById('staffRegForm');
  form.reset();
  document.getElementById('editRecordId').value = '';

  const role = defaultRole || (currentFilterRole !== 'ALL' ? currentFilterRole : 'Receptionist');
  document.getElementById('staffRole').value = role;
  document.getElementById('staffEmpId').value = generateNextEmpId();
  document.getElementById('staffEmail').value = `${role.toLowerCase().replace(/\s+/g, '')}@quadclinic.com`;
  document.getElementById('staffPassword').value = `${role.substring(0, 3).toLowerCase()}123`;

  handleFormRoleChange(role);
  document.getElementById('staffSubmitBtn').textContent = 'Save Record';
  openAdminSubscreen('add');
}

function handleFormRoleChange(role) {
  const editId = document.getElementById('editRecordId').value;
  const heading = document.getElementById('staffFormHeading');
  heading.textContent = editId ? `EDIT ${role.toUpperCase()} RECORD` : `ADD ${role.toUpperCase()} RECORD`;
}

function handleSaveStaff(event) {
  event.preventDefault();

  const editId = document.getElementById('editRecordId').value.trim();
  const role = document.getElementById('staffRole').value;
  const name = document.getElementById('staffName').value.trim();
  const email = document.getElementById('staffEmail').value.trim();
  const contact = document.getElementById('staffContact').value.trim();
  const age = document.getElementById('staffAge').value.trim();
  const gender = document.getElementById('staffGender').value.trim();
  const address = document.getElementById('staffAddress').value.trim();
  const salary = document.getElementById('staffSalary').value.trim();
  const empId = document.getElementById('staffEmpId').value.trim();
  const password = document.getElementById('staffPassword').value.trim();

  if (editId) {
    // Update existing record
    const index = staffList.findIndex(item => item.id === editId);
    if (index !== -1) {
      staffList[index] = { ...staffList[index], role, name, email, contact, age, gender, address, salary, empId, password };
      saveDatabase();
      showToast(`Updated record for ${name}`);
    }
  } else {
    // Create new record
    const newStaff = {
      id: `${role.substring(0, 3).toUpperCase()}-${Date.now()}`,
      empId,
      email,
      role,
      name,
      contact,
      age,
      gender,
      address,
      salary,
      password
    };
    staffList.unshift(newStaff);
    saveDatabase();
    showToast(`Registered ${role}: ${name} with password "${password}"`);
  }

  setRoleFilter('ALL');
  openAdminSubscreen('table');
}

/* ==========================================================================
   6. PERSONNEL CRUD: READ, FILTER & DELETE
   ========================================================================== */
function setRoleFilter(role) {
  currentFilterRole = role;
  document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
  const activeTab = document.getElementById(`chip-${role}`);
  if (activeTab) activeTab.classList.add('active');
  renderStaffTable();
}

function renderStaffTable() {
  const tbody = document.getElementById('staffGridBody');
  if (!tbody) return;

  const query = (document.getElementById('staffSearchInput')?.value || '').trim().toLowerCase();

  const filtered = staffList.filter(item => {
    const matchRole = (currentFilterRole === 'ALL' || item.role === currentFilterRole);
    const matchQuery = !query || 
      item.empId.toLowerCase().includes(query) ||
      (item.email && item.email.toLowerCase().includes(query)) ||
      item.name.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query);
    return matchRole && matchQuery;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:#94a3b8;">No matching personnel records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => `
    <tr>
      <td><strong>${escapeHtml(item.empId)}</strong></td>
      <td>
        <strong>${escapeHtml(item.name)}</strong>
        <span class="tag-role">${escapeHtml(item.role)}</span>
      </td>
      <td>${escapeHtml(item.email || 'N/A')}</td>
      <td>${escapeHtml(item.contact)}</td>
      <td>₹${escapeHtml(item.salary)}</td>
      <td><code>${escapeHtml(item.password)}</code></td>
      <td>
        <div class="table-action-btns">
          <button class="btn-table-edit" onclick="editStaffRecord('${item.id}')">Edit</button>
          <button class="btn-table-del" onclick="deleteStaffRecord('${item.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editStaffRecord(id) {
  const item = staffList.find(s => s.id === id);
  if (!item) return;

  document.getElementById('editRecordId').value = item.id;
  document.getElementById('staffRole').value = item.role;
  document.getElementById('staffName').value = item.name;
  document.getElementById('staffEmail').value = item.email || '';
  document.getElementById('staffContact').value = item.contact;
  document.getElementById('staffAge').value = item.age;
  document.getElementById('staffGender').value = item.gender;
  document.getElementById('staffAddress').value = item.address;
  document.getElementById('staffSalary').value = item.salary;
  document.getElementById('staffEmpId').value = item.empId;
  document.getElementById('staffPassword').value = item.password;

  handleFormRoleChange(item.role);
  document.getElementById('staffSubmitBtn').textContent = 'Update Record';
  openAdminSubscreen('add');
}

function deleteStaffRecord(id) {
  const index = staffList.findIndex(s => s.id === id);
  if (index === -1) return;
  const removed = staffList[index];
  
  if (confirm(`Are you sure you want to delete ${removed.name} (${removed.empId})?`)) {
    staffList.splice(index, 1);
    saveDatabase();
    renderStaffTable();
    showToast(`Deleted ${removed.name} from records.`);
  }
}

/* ==========================================================================
   7. UTILITY FUNCTIONS
   ========================================================================== */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('quadToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Check session on page load
window.addEventListener('DOMContentLoaded', () => {
  loadDatabase();
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  if (session && session.role === 'Admin') {
    document.getElementById('view-login').classList.remove('active');
    document.getElementById('view-admin').classList.add('active');
    openAdminSubscreen('home');
  }
});