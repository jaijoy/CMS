/* =========================================================
   CLINIC MANAGEMENT SYSTEM - COMPLETE ADMIN MODULE
   ========================================================= */

const DB_STAFF_KEY = 'quad_clinic_staff_full_clean_v1';
const DB_PATIENT_KEY = 'quad_clinic_patients_clean_v1';
const SESSION_KEY = 'quad_clinic_active_user';

// 1. Initial Staff & Doctor Records
const DEFAULT_STAFF = [
  { 
    id: '1', 
    empId: 'EMP-1001', 
    name: 'Anjali Menon', 
    role: 'Receptionist', 
    email: 'reception@quadclinic.com', 
    contact: '9847011223', 
    salary: '24,000', 
    fee: 'N/A', 
    hours: '08:00 AM - 04:00 PM', 
    status: 'Active', 
    password: 'rec123' 
  },
  { 
    id: '2', 
    empId: 'EMP-1002', 
    name: 'Dr. Arvind Nair', 
    role: 'Doctor', 
    email: 'doctor@quadclinic.com', 
    contact: '9447122334', 
    salary: '95,000', 
    fee: '₹500', 
    hours: '09:00 AM - 01:00 PM', 
    status: 'Active', 
    password: 'doc123' 
  },
  { 
    id: '3', 
    empId: 'EMP-1003', 
    name: 'Dr. Meera Krishnan', 
    role: 'Doctor', 
    email: 'meera@quadclinic.com', 
    contact: '9895233445', 
    salary: '88,000', 
    fee: '₹600', 
    hours: '04:00 PM - 08:00 PM', 
    status: 'Active', 
    password: 'doc123' 
  },
  { 
    id: '4', 
    empId: 'EMP-1004', 
    name: 'Rahul Vijayan', 
    role: 'Lab Technician', 
    email: 'lab@quadclinic.com', 
    contact: '9746344556', 
    salary: '28,500', 
    fee: 'N/A', 
    hours: '07:30 AM - 03:30 PM', 
    status: 'Active', 
    password: 'lab123' 
  },
  { 
    id: '5', 
    empId: 'EMP-1005', 
    name: 'Sneha Thomas', 
    role: 'Pharmacist', 
    email: 'pharmacy@quadclinic.com', 
    contact: '9633455667', 
    salary: '30,000', 
    fee: 'N/A', 
    hours: '09:00 AM - 05:00 PM', 
    status: 'Active', 
    password: 'pharm123' 
  }
];

// 2. Initial Patient Records
const DEFAULT_PATIENTS = [
  { id: 'PAT-501', name: 'John Mathew', email: 'john@gmail.com', phone: '9846012345', doctor: 'Dr. Arvind Nair', fee: '₹500' },
  { id: 'PAT-502', name: 'Priya Varma', email: 'priya@gmail.com', phone: '9447198765', doctor: 'Dr. Meera Krishnan', fee: '₹600' }
];

let staffList = [];
let patientList = [];
let currentFilter = 'ALL';

function loadData() {
  const staffData = localStorage.getItem(DB_STAFF_KEY);
  staffList = staffData ? JSON.parse(staffData) : JSON.parse(JSON.stringify(DEFAULT_STAFF));

  const patientData = localStorage.getItem(DB_PATIENT_KEY);
  patientList = patientData ? JSON.parse(patientData) : JSON.parse(JSON.stringify(DEFAULT_PATIENTS));
  
  saveData();
}

function saveData() {
  localStorage.setItem(DB_STAFF_KEY, JSON.stringify(staffList));
  localStorage.setItem(DB_PATIENT_KEY, JSON.stringify(patientList));
}

// 3. UI Helpers on Login Dropdown
function handleRoleDropdownNotice(role) {
  const tip = document.getElementById('patientTip');
  const userLabel = document.getElementById('loginUserLabel');
  const passLabel = document.getElementById('loginPassLabel');

  if (role === 'Patient') {
    tip.style.display = 'block';
    userLabel.textContent = 'Patient Email ID';
    passLabel.textContent = 'Password (Your Phone Number)';
  } else {
    tip.style.display = 'none';
    userLabel.textContent = 'Email or Employee ID';
    passLabel.textContent = 'Password';
  }
}

// 4. Login Authentication
function handleLogin(event) {
  event.preventDefault();
  const msgBox = document.getElementById('loginMsg');
  msgBox.style.display = 'none';

  const role = document.getElementById('loginRole').value;
  const username = document.getElementById('loginUser').value.trim().toLowerCase();
  const password = document.getElementById('loginPass').value.trim();

  // CASE A: Administrator Login
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

  // CASE B: Patient Login
  if (role === 'Patient') {
    const matchedPatient = patientList.find(p => p.email.toLowerCase() === username);
    if (!matchedPatient) {
      msgBox.textContent = `No patient found with email "${username}". Please register at Reception.`;
      msgBox.style.display = 'block';
      return;
    }
    if (matchedPatient.phone !== password) {
      msgBox.textContent = 'Invalid password. (Hint: Your password is your registered phone number).';
      msgBox.style.display = 'block';
      return;
    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ role: 'Patient', ...matchedPatient }));
    alert(`Welcome ${matchedPatient.name}! Logged in as Patient. Assigned Doctor: ${matchedPatient.doctor} (Fee: ${matchedPatient.fee}).`);
    return;
  }

  // CASE C: Clinical Staff
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

  const pages = {
    'Receptionist': 'receptionist.html',
    'Doctor': 'doctor.html',
    'Lab Technician': 'lab.html',
    'Pharmacist': 'pharmacist.html'
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(matched));
  window.location.href = pages[role];
}

// 5. Admin Navigation & View
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
  document.getElementById('tabHome').style.display = 'none';
  document.getElementById('tabAdd').style.display = 'none';
  document.getElementById('tabTable').style.display = 'none';
  document.getElementById('tabPatients').style.display = 'none';

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
  } else if (tabName === 'patients') {
    document.getElementById('tabPatients').style.display = 'block';
    document.getElementById('tabPatientBtn').classList.add('active');
    renderPatientTable();
  }
}

function filterByRole(role) {
  setFilter(role);
  switchAdminTab('table');
}

// 6. Dynamic Form Fields for Doctors
function toggleDoctorFields(role) {
  const box = document.getElementById('doctorExtraFields');
  if (role === 'Doctor') {
    box.style.display = 'block';
    if (!document.getElementById('doctorFee').value) document.getElementById('doctorFee').value = '₹500';
    if (!document.getElementById('doctorHours').value) document.getElementById('doctorHours').value = '09:00 AM - 01:00 PM';
  } else {
    box.style.display = 'none';
  }
}

function openAddForm(presetRole) {
  document.getElementById('staffForm').reset();
  document.getElementById('editStaffId').value = '';
  document.getElementById('formTitle').textContent = 'Register Personnel Details';
  document.getElementById('saveBtn').textContent = 'Save Member';

  const role = presetRole || 'Receptionist';
  document.getElementById('staffRole').value = role;
  toggleDoctorFields(role);

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
  const status = document.getElementById('staffStatus').value;

  const fee = role === 'Doctor' ? (document.getElementById('doctorFee').value.trim() || '₹500') : 'N/A';
  const hours = role === 'Doctor' ? (document.getElementById('doctorHours').value.trim() || '09:00 AM - 01:00 PM') : '09:00 AM - 05:00 PM';

  if (editId) {
    const idx = staffList.findIndex(s => s.id === editId);
    if (idx !== -1) {
      staffList[idx] = { id: editId, empId, name, role, email, contact, salary, fee, hours, status, password };
    }
  } else {
    const newMember = {
      id: Date.now().toString(),
      empId,
      name,
      role,
      email,
      contact,
      salary,
      fee,
      hours,
      status,
      password
    };
    staffList.unshift(newMember);
  }

  saveData();
  setFilter('ALL');
  switchAdminTab('table');
}

// 7. Staff Directory Table & Alt Status Toggle
function setFilter(role) {
  currentFilter = role;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  const activePill = document.getElementById(`pill-${role}`);
  if (activePill) activePill.classList.add('active');
  renderTable();
}

function toggleStaffStatus(id) {
  const staff = staffList.find(s => s.id === id);
  if (!staff) return;

  if (staff.status === 'Active') staff.status = 'On Leave';
  else if (staff.status === 'On Leave') staff.status = 'Inactive';
  else staff.status = 'Active';

  saveData();
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
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #888;">No matching personnel records.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td><strong>${s.empId}</strong></td>
      <td>
        <strong>${s.name}</strong><br>
        <span class="badge ${s.role === 'Doctor' ? 'badge-doctor' : ''}">${s.role}</span>
      </td>
      <td>
        ${s.email}<br>
        <small style="color:#64748b;">${s.contact}</small>
      </td>
      <td>
        ${s.role === 'Doctor' ? `<strong>${s.fee}</strong><br><small>${s.hours}</small>` : `<small>${s.hours}</small>`}
      </td>
      <td>
        <span class="status-badge status-${s.status.replace(/\s+/g, '-')}" onclick="toggleStaffStatus('${s.id}')" title="Click to Alt / Toggle Status">
          ${s.status} &#x21bb;
        </span>
      </td>
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
  document.getElementById('staffStatus').value = s.status || 'Active';

  toggleDoctorFields(s.role);
  if (s.role === 'Doctor') {
    document.getElementById('doctorFee').value = s.fee || '₹500';
    document.getElementById('doctorHours').value = s.hours || '09:00 AM - 01:00 PM';
  }

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

// 8. Patient Directory & Credentials Table
function renderPatientTable() {
  const tbody = document.getElementById('patientTableBody');
  tbody.innerHTML = patientList.map(p => `
    <tr>
      <td><strong>${p.id}</strong></td>
      <td><strong>${p.name}</strong></td>
      <td>${p.email}</td>
      <td><code>${p.phone}</code></td>
      <td>${p.doctor}</td>
      <td><strong>${p.fee}</strong></td>
      <td>
        <button class="btn-sm-del" onclick="deletePatient('${p.id}')">Remove</button>
      </td>
    </tr>
  `).join('');
}

function openAddPatientModal() {
  const name = prompt("Enter Patient Full Name:");
  if (!name) return;
  const email = prompt("Enter Patient Email (Username):");
  if (!email) return;
  const phone = prompt("Enter Patient Phone Number (Password):");
  if (!phone) return;

  const doctors = staffList.filter(s => s.role === 'Doctor');
  const docName = doctors.length > 0 ? doctors[0].name : 'Dr. Arvind Nair';
  const docFee = doctors.length > 0 ? doctors[0].fee : '₹500';

  const newPatient = {
    id: `PAT-${patientList.length + 501}`,
    name,
    email,
    phone,
    doctor: docName,
    fee: docFee
  };

  patientList.push(newPatient);
  saveData();
  renderPatientTable();
  alert(`Patient Registered!\nUsername: ${email}\nPassword: ${phone}\nAssigned Doctor: ${docName}`);
}

function deletePatient(id) {
  if (confirm("Remove patient record?")) {
    patientList = patientList.filter(p => p.id !== id);
    saveData();
    renderPatientTable();
  }
}

// 9. Session Check on Load
window.addEventListener('DOMContentLoaded', () => {
  loadData();
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  if (session && session.role === 'Admin') {
    showAdminView();
  }
});