/* =========================================================
   AUTHENTICATION & ROLE ROUTING LOGIC
   ========================================================= */
const STORAGE_KEY = 'quad_clinic_admin_staff_v1';
const SESSION_KEY = 'quad_clinic_active_session';

// Administrator Credentials
const ADMIN_ACCOUNT = {
  role: 'Admin',
  email: 'admin@quadclinic.com',
  username: 'admin',
  password: 'admin123',
  displayName: 'Mr.ADMIN'
};

// Target filenames for your teammates' modules
const TEAMMATE_PAGES = {
  'Receptionist':   'receptionist.html',
  'Doctor':         'doctor.html',
  'Lab Technician': 'lab.html',
  'Pharmacist':     'pharmacist.html'
};

const DEFAULT_STAFF = [
  { id: 'REC-101', empId: 'EMP-1001', role: 'Receptionist', name: 'Anjali Menon', contact: '9847011223', age: '26', gender: 'Female', address: 'Pattom, TVM', salary: '24,000' },
  { id: 'DOC-102', empId: 'EMP-1002', role: 'Doctor', name: 'Dr. Arvind Nair', contact: '9447122334', age: '41', gender: 'Male', address: 'Kowdiar, TVM', salary: '95,000' },
  { id: 'DOC-103', empId: 'EMP-1003', role: 'Doctor', name: 'Dr. Meera Krishnan', contact: '9895233445', age: '36', gender: 'Female', address: 'Vazhuthacaud, TVM', salary: '88,000' },
  { id: 'LAB-104', empId: 'EMP-1004', role: 'Lab Technician', name: 'Rahul Vijayan', contact: '9746344556', age: '29', gender: 'Male', address: 'Kazhakootam, TVM', salary: '28,500' },
  { id: 'PHA-105', empId: 'EMP-1005', role: 'Pharmacist', name: 'Sneha Thomas', contact: '9633455667', age: '27', gender: 'Female', address: 'Kesavadasapuram', salary: '30,000' }
];

let staffList = [];
let currentRoleFilter = 'ALL';

function loadDatabase() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    staffList = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_STAFF));
  } catch (e) {
    staffList = JSON.parse(JSON.stringify(DEFAULT_STAFF));
  }
}

function saveDatabase() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staffList));
  } catch (e) {}
}

function getActiveSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch (e) {
    return null;
  }
}

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

/* =========================================================
   LOGIN DISPATCHER
   ========================================================= */
function handleLoginSubmit(event) {
  event.preventDefault();
  clearLoginError();

  const role = document.getElementById('loginRole').value;
  const userInput = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!role) {
    showLoginError('Please select a role.');
    return;
  }

  // 1. If Administrator logs in -> Unlocks Admin Dashboard
  if (role === 'Admin') {
    const isUserValid = (userInput.toLowerCase() === ADMIN_ACCOUNT.email || userInput.toLowerCase() === ADMIN_ACCOUNT.username);
    const isPassValid = (password === ADMIN_ACCOUNT.password);

    if (!isUserValid || !isPassValid) {
      showLoginError('Invalid Administrator credentials. Use admin@quadclinic.com / admin123.');
      return;
    }

    const adminSession = {
      role: 'Admin',
      name: ADMIN_ACCOUNT.displayName,
      email: ADMIN_ACCOUNT.email,
      authenticated: true
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(adminSession));
    localStorage.setItem('quad_logged_in_user', JSON.stringify(adminSession));

    document.getElementById('view-login').classList.remove('active');
    document.getElementById('view-admin').classList.add('active');
    openAdminSubscreen('home');
    showToast('Welcome Mr.ADMIN!');
    return;
  }

  // 2. If Receptionist, Doctor, Lab Technician, or Pharmacist logs in:
  // Hand off directly to your teammates' files without restrictions.
  const staffSession = {
    role: role,
    user: userInput,
    authenticated: true,
    loginTime: new Date().toISOString()
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(staffSession));
  localStorage.setItem('quad_logged_in_user', JSON.stringify(staffSession));

  const targetFile = TEAMMATE_PAGES[role];
  if (targetFile) {
    window.location.href = targetFile;
  } else {
    showLoginError(`No page assigned for role: ${role}`);
  }
}

function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('quad_logged_in_user');
  document.getElementById('quadLoginForm').reset();
  clearLoginError();

  document.getElementById('view-admin').classList.remove('active');
  document.getElementById('view-login').classList.add('active');
  showToast('Logged out.');
}

function handleForgotPassword() {
  showToast('Contact administrator to reset password.');
}

/* =========================================================
   ADMIN DASHBOARD FUNCTIONALITY
   ========================================================= */
function openAdminSubscreen(sub) {
  document.querySelectorAll('.admin-subscreen').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.side-nav-btn').forEach(el => el.classList.remove('active-nav'));

  if (sub === 'home') {
    document.getElementById('admin-sub-home').classList.add('active');
    document.getElementById('sideBtnHome').classList.add('active-nav');
  } else if (sub === 'add') {
    document.getElementById('admin-sub-add').classList.add('active');
    document.getElementById('sideBtnAdd').classList.add('active-nav');
  } else if (sub === 'table') {
    document.getElementById('admin-sub-table').classList.add('active');
    document.getElementById('sideBtnTable').classList.add('active-nav');
    renderStaffTable();
  }
}

function handleManageCardClick(type) {
  if (type === 'DOCTOR') {
    setRoleFilter('Doctor');
  } else {
    setRoleFilter('ALL');
  }
  openAdminSubscreen('table');
}

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

  const role = defaultRole || (currentRoleFilter !== 'ALL' ? currentRoleFilter : 'Receptionist');
  document.getElementById('staffRole').value = role;
  document.getElementById('staffEmpId').value = generateNextEmpId();

  handleFormRoleChange(role);
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
      showToast(`Updated ${role}: ${name}`);
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

  const TOTAL_ROWS = Math.max(9, filtered.length);
  let rowsHtml = '';

  for (let i = 0; i < TOTAL_ROWS; i++) {
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
  const idx = staffList.findIndex(item => item.id === id);
  if (idx === -1) return;
  const removed = staffList[idx];
  staffList.splice(idx, 1);
  saveDatabase();
  renderStaffTable();
  showToast(`Deleted ${removed.role}: ${removed.name}`);
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

window.addEventListener('DOMContentLoaded', () => {
  loadDatabase();
  const session = getActiveSession();
  if (session && session.role === 'Admin') {
    document.getElementById('view-login').classList.remove('active');
    document.getElementById('view-admin').classList.add('active');
    openAdminSubscreen('home');
  }
});