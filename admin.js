/* =========================================================
   CLINIC MANAGEMENT SYSTEM - ADMIN & LOGIN ENGINE
   ========================================================= */

const DB_KEY = 'quad_clinic_data_simple_v1';
const SESSION_KEY = 'quad_clinic_active_user';

// 1. Initial Default Staff Records
const DEFAULT_STAFF = [
  { id: '1', empId: 'EMP-1001', name: 'Anjali Menon', role: 'Receptionist', email: 'reception@quadclinic.com', contact: '9847011223', salary: '24,000', password: 'rec123' },
  { id: '2', empId: 'EMP-1002', name: 'Dr. Arvind Nair', role: 'Doctor', email: 'doctor@quadclinic.com', contact: '9447122334', salary: '95,000', password: 'doc123' },
  { id: '3', empId: 'EMP-1003', name: 'Dr. Meera Krishnan', role: 'Doctor', email: 'meera@quadclinic.com', contact: '9895233445', salary: '88,000', password: 'doc123' },
  { id: '4', empId: 'EMP-1004', name: 'Rahul Vijayan', role: 'Lab Technician', email: 'lab@quadclinic.com', contact: '9746344556', salary: '28,500', password: 'lab123' },
  { id: '5', empId: 'EMP-1005', name: 'Sneha Thomas', role: 'Pharmacist', email: 'pharmacy@quadclinic.com', contact: '9633455667', salary: '30,000', password: 'pharm123' }
];

let staffList = [];
let currentFilter = 'ALL';

// 2. Load / Save Database to LocalStorage
function loadData() {
  const data = localStorage.getItem(DB_KEY);
  if (data) {
    staffList = JSON.parse(data);
  } else {
    staffList = JSON.parse(JSON.stringify(DEFAULT_STAFF));
    saveData();
  }
}

function saveData() {
  localStorage.setItem(DB_KEY, JSON.stringify(staffList));
}

// 3. Login Authentication
function handleLogin(event) {
  event.preventDefault();
  const msgBox = document.getElementById('loginMsg');
  msgBox.style.display = 'none';

  const role = document.getElementById('loginRole').value;
  const username = document.getElementById('loginUser').value.trim().toLowerCase();
  const password = document.getElementById('loginPass').value.trim();

  // Admin Login Check
  if (role === 'Admin') {
    if ((username === 'admin@quadclinic.com' || username === 'admin') && password === 'admin123') {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ role: 'Admin', user: username }));
      showAdminView();
      return;
    } else {
      msgBox.textContent = 'Invalid Admin credentials. Use admin@quadclinic.com / admin123';
      msgBox.style.display = 'block';
      return;
    }
  }

  // Clinical Staff Login Check (Receptionist, Doctor, Lab, Pharmacy)
  const matched = staffList.find(s => 
    s.role === role && 
    (s.email.toLowerCase() === username || s.empId.toLowerCase() === username || s.name.toLowerCase() === username)
  );

  if (!matched) {
    msgBox.textContent = `No ${role} found matching "${username}". Check with Administrator.`;
    msgBox.style.display = 'block';
    return;
  }

  if (matched.password !== password) {
    msgBox.textContent = `Incorrect password for ${matched.name}.`;
    msgBox.style.display = 'block';
    return;
  }

  // Teammate redirect map
  const pages = {
    'Receptionist': 'receptionist.html',
    'Doctor': 'doctor.html',
    'Lab Technician': 'lab.html',
    'Pharmacist': 'pharmacist.html'
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(matched));
  window.location.href = pages[role];
}

// 4. Admin View Controls
function showAdminView() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('adminView').style.display = 'block';
  document.getElementById('topNavUser').style.display = 'flex';
  switchAdminTab('home');
}

function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById('loginForm').reset();
  document.getElementById('loginView').style.display = 'block';
  document.getElementById('adminView').style.display = 'none';
  document.getElementById('topNavUser').style.display = 'none';
}

function switchAdminTab(tabName) {
  // Hide all tabs
  document.getElementById('tabHome').style.display = 'none';
  document.getElementById('tabAdd').style.display = 'none';
  document.getElementById('tabTable').style.display = 'none';

  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  if (tabName === 'home') {
    document.getElementById('tabHome').style.display = 'block';
    document.getElementById('tabHomeBtn').classList.add('active');
  } else if (tabName === 'add') {
    document.getElementById('tabAdd').style.display = 'block';
    document.getElementById('tabAddBtn').classList.add('active');
  } else if (tabName === 'table') {
    document.getElementById('tabTable').style.display = 'block';
    document.getElementById('tabTableBtn').classList.add('active');
    renderTable();
  }
}

function filterByRole(role) {
  setFilter(role);
  switchAdminTab('table');
}

// 5. Add / Edit Staff Form
function openAddForm() {
  document.getElementById('staffForm').reset();
  document.getElementById('editStaffId').value = '';
  document.getElementById('formTitle').textContent = 'Add Staff Member';
  document.getElementById('saveBtn').textContent = 'Save Member';

  // Auto-generate Next EMP ID
  const nextNum = staffList.length + 1001;
  document.getElementById('staffEmpId').value = `EMP-${nextNum}`;
  document.getElementById('staffPass').value = 'staff123';

  switchAdminTab('add');
}

function handleStaffSubmit(event) {
  event.preventDefault();

  const editId = document.getElementById('editStaffId').value;
  const role = document.getElementById('staffRole').value;
  const empId = document.getElementById('staffEmpId').value.trim();
  const name = document.getElementById('staffName').value.trim();
  const email = document.getElementById('staffEmail').value.trim();
  const contact = document.getElementById('staffContact').value.trim();
  const salary = document.getElementById('staffSalary').value.trim();
  const password = document.getElementById('staffPass').value.trim();

  if (editId) {
    // Update existing member
    const idx = staffList.findIndex(s => s.id === editId);
    if (idx !== -1) {
      staffList[idx] = { id: editId, empId, name, role, email, contact, salary, password };
    }
  } else {
    // Add new member
    const newMember = {
      id: Date.now().toString(),
      empId,
      name,
      role,
      email,
      contact,
      salary,
      password
    };
    staffList.unshift(newMember);
  }

  saveData();
  setFilter('ALL');
  switchAdminTab('table');
}

// 6. Directory Table & Search/Filter
function setFilter(role) {
  currentFilter = role;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  const activePill = document.getElementById(`pill-${role}`);
  if (activePill) activePill.classList.add('active');
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('staffTableBody');
  const query = (document.getElementById('searchInput').value || '').toLowerCase();

  const filtered = staffList.filter(s => {
    const roleMatch = (currentFilter === 'ALL' || s.role === currentFilter);
    const queryMatch = !query || 
      s.name.toLowerCase().includes(query) || 
      s.email.toLowerCase().includes(query) || 
      s.empId.toLowerCase().includes(query);
    return roleMatch && queryMatch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #888;">No staff members found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td><strong>${s.empId}</strong></td>
      <td>${s.name}</td>
      <td><span class="badge">${s.role}</span></td>
      <td>${s.email}</td>
      <td>${s.contact}</td>
      <td>${s.salary}</td>
      <td><code>${s.password}</code></td>
      <td>
        <button class="btn-sm-edit" onclick="editStaff('${s.id}')">Edit</button>
        <button class="btn-sm-del" onclick="deleteStaff('${s.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function editStaff(id) {
  const s = staffList.find(item => item.id === id);
  if (!s) return;

  document.getElementById('editStaffId').value = s.id;
  document.getElementById('staffRole').value = s.role;
  document.getElementById('staffEmpId').value = s.empId;
  document.getElementById('staffName').value = s.name;
  document.getElementById('staffEmail').value = s.email;
  document.getElementById('staffContact').value = s.contact;
  document.getElementById('staffSalary').value = s.salary;
  document.getElementById('staffPass').value = s.password;

  document.getElementById('formTitle').textContent = `Edit Details - ${s.name}`;
  document.getElementById('saveBtn').textContent = 'Update Member';

  switchAdminTab('add');
}

function deleteStaff(id) {
  const s = staffList.find(item => item.id === id);
  if (!s) return;

  if (confirm(`Remove ${s.name} (${s.empId}) from records?`)) {
    staffList = staffList.filter(item => item.id !== id);
    saveData();
    renderTable();
  }
}

// 7. Check Active Session on Page Load
window.addEventListener('DOMContentLoaded', () => {
  loadData();
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  if (session && session.role === 'Admin') {
    showAdminView();
  }
});