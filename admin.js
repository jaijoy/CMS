/* =========================================================
   INITIAL STAFF DATABASE (PERSISTED IN LOCALSTORAGE)
   ========================================================= */
const STORAGE_KEY = 'quad_clinic_admin_staff_v1';

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
    name: 'rahul Vijayan',
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
  updateStaffCountBadge();
}

function saveDatabase() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staffList));
  } catch (e) {}
  updateStaffCountBadge();
}

function resetDemoDatabase() {
  staffList = JSON.parse(JSON.stringify(DEFAULT_STAFF));
  saveDatabase();
  renderStaffTable();
  showToast('Demo staff records restored to default.');
}

function updateStaffCountBadge() {
  const badge = document.getElementById('totalStaffCountBadge');
  if (badge) badge.textContent = staffList.length;
}

/* =========================================================
   ROLE DROPDOWN & UNIFIED LOGIN HANDLER
   ========================================================= */
const ROLE_DEMO_CREDS = {
  'Admin':          { email: 'admin@quadclinic.com',      pass: 'admin123', file: 'admin.html' },
  'Receptionist':   { email: 'reception@quadclinic.com',  pass: 'rec123',   file: 'receptionist.html' },
  'Doctor':         { email: 'doctor@quadclinic.com',     pass: 'doc123',   file: 'doctor.html' },
  'Lab Technician': { email: 'lab@quadclinic.com',        pass: 'lab123',   file: 'lab.html' },
  'Pharmacist':     { email: 'pharmacy@quadclinic.com',   pass: 'pharm123', file: 'pharmacist.html' }
};

function handleRoleDropdownChange(selectedRole) {
  const creds = ROLE_DEMO_CREDS[selectedRole];
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  const errBox = document.getElementById('loginErrorAlert');
  if (errBox) errBox.style.display = 'none';

  if (creds && emailInput && passInput) {
    emailInput.value = creds.email;
    passInput.value = creds.pass;
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const role = document.getElementById('loginRole').value;
  const emailOrId = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errBox = document.getElementById('loginErrorAlert');
  errBox.style.display = 'none';

  if (!role) {
    errBox.textContent = 'Please select a role from the dropdown list.';
    errBox.style.display = 'block';
    return;
  }

  // 1. Administrator Login -> Opens Your Administrator Portal
  if (role === 'Admin') {
    if (password.length < 3) {
      errBox.textContent = 'Invalid Administrator password.';
      errBox.style.display = 'block';
      return;
    }
    localStorage.setItem('quad_logged_in_user', JSON.stringify({
      role: 'Admin',
      name: 'Mr.ADMIN',
      email: emailOrId
    }));
    jumpToScreen('admin-home');
    showToast('Welcome Mr.ADMIN! Logged in to Administrator Portal.');
    return;
  }

  // 2. Other Roles (Receptionist, Doctor, Lab Technician, Pharmacist)
  const matchedStaff = staffList.find(
    s => s.role === role &&
    (s.empId.toLowerCase() === emailOrId.toLowerCase() ||
     s.name.toLowerCase().includes(emailOrId.toLowerCase()))
  );

  const displayUser = matchedStaff ? `${matchedStaff.name} (${matchedStaff.empId})` : emailOrId;
  const targetFile = ROLE_DEMO_CREDS[role] ? ROLE_DEMO_CREDS[role].file : 'dashboard.html';

  localStorage.setItem('quad_logged_in_user', JSON.stringify({
    role: role,
    name: displayUser,
    email: emailOrId
  }));

  openTeammateModal(role, displayUser, targetFile);
}

function handleForgotPassword() {
  const role = document.getElementById('loginRole').value || 'Admin';
  showToast(`Password reset request sent to Administrator for role: ${role}`);
}

function logoutToLogin() {
  jumpToScreen('login');
  showToast('Logged out of Administrator session.');
}

/* =========================================================
   SCREEN & SUB-SCREEN NAVIGATION
   ========================================================= */
function jumpToScreen(target) {
  const loginView = document.getElementById('view-login');
  const adminView = document.getElementById('view-admin');

  document.querySelectorAll('.instructor-bar .screen-pill').forEach(b => b.classList.remove('active'));

  if (target === 'login') {
    loginView.classList.add('active');
    adminView.classList.remove('active');
    document.getElementById('pill-login').classList.add('active');
    return;
  }

  loginView.classList.remove('active');
  adminView.classList.add('active');

  if (target === 'admin-home') {
    openAdminSubscreen('home');
  } else if (target === 'admin-add') {
    openAddStaffForm('Receptionist');
  } else if (target === 'admin-table') {
    openAdminSubscreen('table');
  }
}

function openAdminSubscreen(sub) {
  document.querySelectorAll('.admin-subscreen').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.side-nav-btn').forEach(el => el.classList.remove('active-nav'));
  document.querySelectorAll('.instructor-bar .screen-pill').forEach(b => b.classList.remove('active'));

  const roleHeading = document.getElementById('sidebarRoleTitle');
  const userName = document.getElementById('sidebarUserName');
  const logoutText = document.getElementById('logoutLabelText');

  if (sub === 'home') {
    document.getElementById('admin-sub-home').classList.add('active');
    document.getElementById('sideBtnHome').classList.add('active-nav');
    document.getElementById('pill-admin-home').classList.add('active');

    roleHeading.textContent = 'ADMINISTRATOR';
    roleHeading.classList.remove('title-case');
    userName.textContent = 'Mr.ADMIN';
    userName.classList.remove('blue-text');
    logoutText.textContent = 'Logout';
    logoutText.classList.remove('blue-logout');
  } else if (sub === 'add') {
    document.getElementById('admin-sub-add').classList.add('active');
    document.getElementById('sideBtnAdd').classList.add('active-nav');
    document.getElementById('pill-admin-add').classList.add('active');

    roleHeading.textContent = 'Administrator';
    roleHeading.classList.add('title-case');
    userName.textContent = 'Mr.ADMIN';
    userName.classList.remove('blue-text');
    logoutText.textContent = 'Log Out';
    logoutText.classList.remove('blue-logout');
  } else if (sub === 'table') {
    document.getElementById('admin-sub-table').classList.add('active');
    document.getElementById('sideBtnTable').classList.add('active-nav');
    document.getElementById('pill-admin-table').classList.add('active');

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
  if (type === 'DOCTOR') {
    setRoleFilter('Doctor');
    openAdminSubscreen('table');
    showToast('Filtered staff directory to Doctors. Click "+ Add New Record" to register a Doctor.');
  } else {
    setRoleFilter('ALL');
    openAdminSubscreen('table');
    showToast('Opened Staff Management Table (Receptionist, Doctor, Lab Technician, Pharmacist).');
  }
}

/* =========================================================
   ADD & EDIT STAFF FORM LOGIC
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
    showToast(`Added ${role}: ${name} (${empId})`);
  }

  setRoleFilter('ALL');
  openAdminSubscreen('table');
}

/* =========================================================
   SEARCH, FILTER, EDIT & DELETE TABLE LOGIC
   ========================================================= */
function setRoleFilter(role) {
  currentRoleFilter = role;
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
  const activeChip = document.getElementById(`chip-${role}`);
  if (activeChip) activeChip.classList.add('active');
  renderStaffTable();
}

function renderStaffTable() {
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

  // Always show at least 9 rows to match the reference wireframe screenshot
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
              <button type="button" class="wf-btn-edit ghost-row-btn" onclick="openAddStaffForm()">EDIT</button>
              <button type="button" class="wf-btn-delete ghost-row-btn" onclick="showToast('Empty slot — click EDIT or + Add New Record to insert staff.')">DELETE</button>
            </div>
          </td>
        </tr>
      `;
    }
  }

  tbody.innerHTML = rowsHtml;
}

function editStaffRecord(id) {
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
  showToast(`Editing ${rec.name} (${rec.empId})`);
}

function deleteStaffRecord(id) {
  const idx = staffList.findIndex(item => item.id === id);
  if (idx === -1) return;
  const removed = staffList[idx];
  staffList.splice(idx, 1);
  saveDatabase();
  renderStaffTable();
  showToast(`Deleted ${removed.role}: ${removed.name} (${removed.empId})`);
}

/* =========================================================
   TEAMMATE HAND-OFF MODAL & UTILITIES
   ========================================================= */
function openTeammateModal(role, user, targetFile) {
  document.getElementById('handoffRoleBadge').textContent = `${role.toUpperCase()} MODULE`;
  document.getElementById('handoffTitle').textContent = `Logged in as ${user}`;
  document.getElementById('handoffCodeBox').innerHTML =
    `// In script.js (when merging with your teammates' branch):<br>` +
    `if (role === "${role}") {<br>` +
    `&nbsp;&nbsp;window.location.href = "${targetFile}";<br>` +
    `}`;
  document.getElementById('teammateModal').classList.add('open');
}

function closeTeammateModal() {
  document.getElementById('teammateModal').classList.remove('open');
}

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

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  loadDatabase();
  renderStaffTable();
});