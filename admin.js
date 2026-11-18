/* =========================================================
   QUAD CLINIC - ADMIN & APPOINTMENT JAVASCRIPT
   ========================================================= */

const DB_STAFF_KEY = 'quad_clinic_staff_clean_v4';
const DB_PATIENT_KEY = 'quad_clinic_patients_clean_v4';
const DB_BOOKINGS_KEY = 'quad_clinic_bookings_clean_v4';
const SESSION_KEY = 'quad_clinic_user_session';

// Doctor Consultation 30-Minute Time Slots by Shift
const MORNING_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"
];

const AFTERNOON_SLOTS = [
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
];

// Initial Staff: Only Doctors have department, fee, and shift.
// Receptionist, Lab Tech, and Pharmacist do not have fees, slots, or shifts.
const DEFAULT_STAFF = [
  { 
    id: '1', 
    name: 'Dr. Arun', 
    role: 'Doctor', 
    dept: 'Cardiology',
    gender: 'Male',
    dob: '1984-05-12',
    joiningDate: '2020-01-15',
    email: 'arun@quadclinic.com', 
    contact: '9447112233', 
    salary: '1,20,000', 
    fee: '₹750', 
    shift: 'Both', // 9am-12pm & 2pm-4pm
    status: 'Active', 
    password: 'doc123' 
  },
  { 
    id: '2', 
    name: 'Dr. Arvind Nair', 
    role: 'Doctor', 
    dept: 'General Medicine',
    gender: 'Male',
    dob: '1982-10-24',
    joiningDate: '2019-06-01',
    email: 'doctor@quadclinic.com', 
    contact: '9447122334', 
    salary: '95,000', 
    fee: '₹500', 
    shift: 'Morning', // 9am-12pm
    status: 'Active', 
    password: 'doc123' 
  },
  { 
    id: '3', 
    name: 'Dr. Meera Krishnan', 
    role: 'Doctor', 
    dept: 'Pediatrics',
    gender: 'Female',
    dob: '1988-03-18',
    joiningDate: '2021-08-10',
    email: 'meera@quadclinic.com', 
    contact: '9895233445', 
    salary: '90,000', 
    fee: '₹600', 
    shift: 'Afternoon', // 2pm-4pm
    status: 'Active', 
    password: 'doc123' 
  },
  { 
    id: '4', 
    name: 'Dr. Deepa Thomas', 
    role: 'Doctor', 
    dept: 'Orthopedics',
    gender: 'Female',
    dob: '1985-11-05',
    joiningDate: '2020-11-20',
    email: 'deepa@quadclinic.com', 
    contact: '9895001122', 
    salary: '95,000', 
    fee: '₹650', 
    shift: 'Both',
    status: 'Active', 
    password: 'doc123' 
  },
  { 
    id: '5', 
    name: 'Dr. Sanjay Patel', 
    role: 'Doctor', 
    dept: 'Dermatology',
    gender: 'Male',
    dob: '1986-07-29',
    joiningDate: '2022-03-01',
    email: 'sanjay@quadclinic.com', 
    contact: '9811223344', 
    salary: '85,000', 
    fee: '₹500', 
    shift: 'Both',
    status: 'Active', 
    password: 'doc123' 
  },
  { 
    id: '6', 
    name: 'Anjali Menon', 
    role: 'Receptionist', 
    dept: 'Administration',
    gender: 'Female',
    dob: '1998-09-14',
    joiningDate: '2023-02-15',
    email: 'reception@quadclinic.com', 
    contact: '9847011223', 
    salary: '24,000', 
    fee: null, 
    shift: null, 
    status: 'Active', 
    password: 'rec123' 
  },
  { 
    id: '7', 
    name: 'Rahul Vijayan', 
    role: 'Lab Technician', 
    dept: 'Pathology',
    gender: 'Male',
    dob: '1995-12-03',
    joiningDate: '2022-07-10',
    email: 'lab@quadclinic.com', 
    contact: '9746344556', 
    salary: '28,500', 
    fee: null, 
    shift: null, 
    status: 'Active', 
    password: 'lab123' 
  },
  { 
    id: '8', 
    name: 'Sneha Thomas', 
    role: 'Pharmacist', 
    dept: 'Dispensary',
    gender: 'Female',
    dob: '1996-04-22',
    joiningDate: '2023-01-05',
    email: 'pharmacy@quadclinic.com', 
    contact: '9633455667', 
    salary: '30,000', 
    fee: null, 
    shift: null, 
    status: 'Active', 
    password: 'pharm123' 
  }
];

// Initial Patients matching demo records
const DEFAULT_PATIENTS = [
  { id: '1', mmr: 'MMR1003', name: 'jaii', gender: 'Female', dob: '2000-08-15', email: 'jaii@gmail.com', phone: '45678' },
  { id: '2', mmr: 'MMR1171', name: 'lol', gender: 'Female', dob: '1998-02-10', email: 'lol@gmail.com', phone: '123823293' },
  { id: '3', mmr: 'MMR4186', name: 'new', gender: 'Female', dob: '1995-11-25', email: 'new@gmail.com', phone: '9876543' }
];

// Initial Bookings (Matches reference screenshot exactly)
const DEFAULT_BOOKINGS = [
  {
    id: 'BOK-101',
    mmr: 'MMR1003',
    patientEmail: 'jaii@gmail.com',
    patientName: 'jaii',
    patientGender: 'Female',
    patientPhone: '45678',
    doctor: 'Dr. Arun',
    dept: 'Cardiology',
    date: '2026-11-18',
    slot: '09:00 AM',
    fee: '₹750',
    status: 'Confirmed'
  },
  {
    id: 'BOK-102',
    mmr: 'MMR1171',
    patientEmail: 'lol@gmail.com',
    patientName: 'lol',
    patientGender: 'Female',
    patientPhone: '123823293',
    doctor: 'Dr. Sanjay Patel',
    dept: 'Dermatology',
    date: '2026-11-18',
    slot: '09:00 AM',
    fee: '₹500',
    status: 'Confirmed'
  },
  {
    id: 'BOK-103',
    mmr: 'MMR4186',
    patientEmail: 'new@gmail.com',
    patientName: 'new',
    patientGender: 'Female',
    patientPhone: '9876543',
    doctor: 'Dr. Arun',
    dept: 'Cardiology',
    date: '2026-11-18',
    slot: '09:00 AM',
    fee: '₹750',
    status: 'Confirmed'
  }
];

let staffList = [];
let patientList = [];
let bookingList = [];
let currentFilter = 'ALL';

function loadData() {
  const staff = localStorage.getItem(DB_STAFF_KEY);
  staffList = staff ? JSON.parse(staff) : JSON.parse(JSON.stringify(DEFAULT_STAFF));

  const patients = localStorage.getItem(DB_PATIENT_KEY);
  patientList = patients ? JSON.parse(patients) : JSON.parse(JSON.stringify(DEFAULT_PATIENTS));

  const bookings = localStorage.getItem(DB_BOOKINGS_KEY);
  bookingList = bookings ? JSON.parse(bookings) : JSON.parse(JSON.stringify(DEFAULT_BOOKINGS));

  saveData();
}

function saveData() {
  localStorage.setItem(DB_STAFF_KEY, JSON.stringify(staffList));
  localStorage.setItem(DB_PATIENT_KEY, JSON.stringify(patientList));
  localStorage.setItem(DB_BOOKINGS_KEY, JSON.stringify(bookingList));
}

/* =========================================================
   1. LOGIN
   ========================================================= */
function handleRoleChange(role) {
  const tip = document.getElementById('patientNotice');
  const userLabel = document.getElementById('loginUserLabel');
  const passLabel = document.getElementById('loginPassLabel');

  if (role === 'Patient') {
    tip.style.display = 'block';
    userLabel.textContent = 'Patient Email';
    passLabel.textContent = 'Password (Phone Number)';
  } else {
    tip.style.display = 'none';
    userLabel.textContent = 'Email Address';
    passLabel.textContent = 'Password';
  }
}

function handleLogin(event) {
  event.preventDefault();
  const msg = document.getElementById('loginMsg');
  msg.style.display = 'none';

  const role = document.getElementById('loginRole').value;
  const username = document.getElementById('loginUser').value.trim().toLowerCase();
  const password = document.getElementById('loginPass').value.trim();

  // Admin Login
  if (role === 'Admin') {
    if ((username === 'admin@quadclinic.com' || username === 'admin') && password === 'admin123') {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ role: 'Admin', user: username }));
      showAdminView();
      return;
    } else {
      msg.textContent = 'Invalid credentials. Use admin@quadclinic.com / admin123';
      msg.style.display = 'block';
      return;
    }
  }

  // Patient Login (Email + Phone Number)
  if (role === 'Patient') {
    const patient = patientList.find(p => p.email.toLowerCase() === username);
    if (!patient) {
      msg.textContent = `No patient found with email "${username}". Please register first.`;
      msg.style.display = 'block';
      return;
    }
    if (patient.phone !== password) {
      msg.textContent = 'Invalid password. (Password is your phone number).';
      msg.style.display = 'block';
      return;
    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ role: 'Patient', ...patient }));
    showPatientView(patient);
    return;
  }

  // Staff Login
  const staff = staffList.find(s => 
    s.role === role && 
    (s.email.toLowerCase() === username || s.name.toLowerCase() === username)
  );

  if (!staff) {
    msg.textContent = `No ${role} found matching "${username}".`;
    msg.style.display = 'block';
    return;
  }

  if (staff.password !== password) {
    msg.textContent = `Incorrect password for ${staff.name}.`;
    msg.style.display = 'block';
    return;
  }

  const pages = {
    'Receptionist': 'receptionist.html',
    'Doctor': 'doctor.html',
    'Lab Technician': 'lab.html',
    'Pharmacist': 'pharmacist.html'
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(staff));
  window.location.href = pages[role];
}

function handleLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById('loginForm').reset();
  document.getElementById('loginView').style.display = 'block';
  document.getElementById('adminView').style.display = 'none';
  document.getElementById('patientView').style.display = 'none';
  document.getElementById('navUserBar').style.display = 'none';
}

/* =========================================================
   2. PATIENT BOOKING UI & RECORDS
   ========================================================= */
function showPatientView(patient) {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('adminView').style.display = 'none';
  document.getElementById('patientView').style.display = 'block';
  document.getElementById('navUserBar').style.display = 'none';

  // Display Patient Details
  document.getElementById('displayMMR').textContent = patient.mmr || 'MMR1003';
  document.getElementById('displayName').textContent = patient.name;
  document.getElementById('displayPhone').textContent = patient.phone;
  document.getElementById('displayGender').textContent = patient.gender || 'Female';

  // Date default to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('selectDate').value = today;

  // Department default
  const dept = document.getElementById('selectDept');
  dept.value = 'Cardiology';
  onDepartmentChanged('Cardiology');

  renderPatientHistory(patient.email);
}

function onDepartmentChanged(dept) {
  const docSelect = document.getElementById('selectDoctor');
  const docs = staffList.filter(s => s.role === 'Doctor' && s.dept === dept);

  if (docs.length === 0) {
    docSelect.innerHTML = `<option value="" disabled selected>No doctors available in ${dept}</option>`;
    document.getElementById('slotsContainer').innerHTML = '<span style="font-size:12px; color:#666;">No slots.</span>';
    return;
  }

  docSelect.innerHTML = docs.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
  refreshTimeSlotButtons();
}

function refreshTimeSlotButtons() {
  const staffId = document.getElementById('selectDoctor').value;
  const doc = staffList.find(s => s.id === staffId && s.role === 'Doctor');
  const date = document.getElementById('selectDate').value;
  const container = document.getElementById('slotsContainer');

  if (!doc) {
    container.innerHTML = '<span style="font-size:12px; color:#666;">Select a doctor.</span>';
    return;
  }

  const shiftType = doc.shift || 'Both';

  // Check booked slots for this doctor on this date
  const booked = bookingList
    .filter(b => b.doctor === doc.name && b.date === date && b.status === 'Confirmed')
    .map(b => b.slot);

  let firstAvailable = null;
  let html = '';

  // Morning Shift (09:00 AM - 12:00 PM)
  if (shiftType === 'Morning' || shiftType === 'Both') {
    html += '<div class="shift-section-title">Morning Shift (09:00 AM - 12:00 PM)</div><div class="slots-row">';
    MORNING_SLOTS.forEach(slot => {
      const isBooked = booked.includes(slot);
      if (!isBooked && !firstAvailable) firstAvailable = slot;
      html += `<button type="button" class="slot-btn" ${isBooked ? 'disabled' : `onclick="pickSlot('${slot}', this)"`}>${slot}</button>`;
    });
    html += '</div>';
  }

  // Afternoon Shift (02:00 PM - 04:00 PM)
  if (shiftType === 'Afternoon' || shiftType === 'Both') {
    html += '<div class="shift-section-title">Afternoon Shift (02:00 PM - 04:00 PM)</div><div class="slots-row">';
    AFTERNOON_SLOTS.forEach(slot => {
      const isBooked = booked.includes(slot);
      if (!isBooked && !firstAvailable) firstAvailable = slot;
      html += `<button type="button" class="slot-btn" ${isBooked ? 'disabled' : `onclick="pickSlot('${slot}', this)"`}>${slot}</button>`;
    });
    html += '</div>';
  }

  container.innerHTML = html;

  if (firstAvailable) {
    const defaultBtn = Array.from(container.querySelectorAll('.slot-btn')).find(b => !b.disabled);
    if (defaultBtn) pickSlot(firstAvailable, defaultBtn);
  } else {
    document.getElementById('selectedTimeNotice').textContent = 'Selected Time: No slots available for this date';
    document.getElementById('chosenSlotValue').value = '';
  }
}

function pickSlot(slot, btn) {
  document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('selectedTimeNotice').textContent = `Selected Time: ${slot}`;
  document.getElementById('chosenSlotValue').value = slot;
}

function handleConfirmBooking(event) {
  event.preventDefault();
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
  if (!session || session.role !== 'Patient') return;

  const staffId = document.getElementById('selectDoctor').value;
  const doc = staffList.find(s => s.id === staffId);
  const dept = document.getElementById('selectDept').value;
  const date = document.getElementById('selectDate').value;
  const slot = document.getElementById('chosenSlotValue').value;

  if (!slot) {
    alert("Please select a 30-minute time slot.");
    return;
  }

  // Prevent double booking
  const exists = bookingList.find(b => b.doctor === doc.name && b.date === date && b.slot === slot && b.status === 'Confirmed');
  if (exists) {
    alert("This slot has already been booked. Please pick another available slot.");
    refreshTimeSlotButtons();
    return;
  }

  const newBooking = {
    id: `BOK-${Date.now().toString().slice(-4)}`,
    mmr: session.mmr || 'MMR1003',
    patientEmail: session.email,
    patientName: session.name,
    patientGender: session.gender || 'Female',
    patientPhone: session.phone,
    doctor: doc.name,
    dept,
    date,
    slot,
    fee: doc.fee,
    status: 'Confirmed'
  };

  bookingList.unshift(newBooking);
  saveData();

  alert(`Appointment Confirmed!\nDoctor: ${doc.name}\nDate: ${date}\nTime: ${slot}\nFee: ${doc.fee}`);
  refreshTimeSlotButtons();
  renderPatientHistory(session.email);
}

function renderPatientHistory(email) {
  const tbody = document.getElementById('patientBookingHistory');
  const myBookings = bookingList.filter(b => b.patientEmail.toLowerCase() === email.toLowerCase());

  if (myBookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#777;">No appointments yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = myBookings.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.doctor}</td>
      <td>${b.dept}</td>
      <td>${b.date}</td>
      <td>${b.slot}</td>
      <td>${b.fee}</td>
      <td>${b.status}</td>
    </tr>
  `).join('');
}

/* =========================================================
   3. ADMINISTRATOR VIEW
   ========================================================= */
function showAdminView() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('patientView').style.display = 'none';
  document.getElementById('adminView').style.display = 'block';
  document.getElementById('navUserBar').style.display = 'flex';
  document.getElementById('navRoleLabel').textContent = 'Admin: Mr. Administrator';
  switchAdminTab('home');
}

function switchAdminTab(tabName) {
  document.getElementById('tabHome').style.display = 'none';
  document.getElementById('tabAdd').style.display = 'none';
  document.getElementById('tabTable').style.display = 'none';
  document.getElementById('tabPatients').style.display = 'none';

  document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));

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
    renderAdminPatientTable();
  }
}

function filterByRole(role) {
  setFilter(role);
  switchAdminTab('table');
}

function toggleDoctorFields(role) {
  const box = document.getElementById('doctorExtraFields');
  // Strictly display only when role is Doctor
  box.style.display = (role === 'Doctor') ? 'block' : 'none';
  if (role === 'Doctor' && !document.getElementById('doctorFee').value) {
    document.getElementById('doctorFee').value = '₹500';
  }
}

function openAddForm(presetRole) {
  document.getElementById('staffForm').reset();
  document.getElementById('editStaffId').value = '';
  document.getElementById('formTitle').textContent = 'Add Staff Details';
  document.getElementById('saveBtn').textContent = 'Submit';

  const role = presetRole || 'Receptionist';
  document.getElementById('staffRole').value = role;
  toggleDoctorFields(role);

  document.getElementById('staffPass').value = 'staff123';
  switchAdminTab('add');
}

function handleStaffSubmit(event) {
  event.preventDefault();

  const editId = document.getElementById('editStaffId').value;
  const role = document.getElementById('staffRole').value;
  const name = document.getElementById('staffName').value.trim();
  const gender = document.getElementById('staffGender').value;
  const dob = document.getElementById('staffDOB').value;
  const joiningDate = document.getElementById('staffJoiningDate').value;
  const email = document.getElementById('staffEmail').value.trim();
  const contact = document.getElementById('staffContact').value.trim();
  const salary = document.getElementById('staffSalary').value.trim();
  const password = document.getElementById('staffPass').value.trim();
  const status = document.getElementById('staffStatus').value;

  // Restrict department, fee & shift slots strictly to Doctor role only
  const isDoc = (role === 'Doctor');
  const dept = isDoc ? document.getElementById('doctorDept').value : 'General';
  const fee = isDoc ? (document.getElementById('doctorFee').value.trim() || '₹500') : null;
  const shift = isDoc ? document.getElementById('doctorShiftType').value : null;

  if (editId) {
    const idx = staffList.findIndex(s => s.id === editId);
    if (idx !== -1) {
      staffList[idx] = { id: editId, name, role, dept, gender, dob, joiningDate, email, contact, salary, fee, shift, status, password };
    }
  } else {
    const newMember = {
      id: Date.now().toString(),
      name,
      role,
      dept,
      gender,
      dob,
      joiningDate,
      email,
      contact,
      salary,
      fee,
      shift,
      status,
      password
    };
    staffList.unshift(newMember);
  }

  saveData();
  setFilter('ALL');
  switchAdminTab('table');
}

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
  const theadRow = document.getElementById('staffTableHeaderRow');
  const tbody = document.getElementById('staffTableBody');
  const query = (document.getElementById('searchInput').value || '').toLowerCase();

  const isDoctorView = (currentFilter === 'Doctor');

  // Dynamically configure clean table header without awkward empty columns for Staff
  if (isDoctorView) {
    theadRow.innerHTML = `
      <th>Name</th>
      <th>Role</th>
      <th>Department</th>
      <th>Gender</th>
      <th>DOB</th>
      <th>Joined</th>
      <th>Email</th>
      <th>Consultation Fee</th>
      <th>Shift Schedule</th>
      <th>Status</th>
      <th>Password</th>
      <th>Actions</th>
    `;
  } else {
    theadRow.innerHTML = `
      <th>Name</th>
      <th>Role</th>
      <th>Department</th>
      <th>Gender</th>
      <th>DOB</th>
      <th>Joined</th>
      <th>Email</th>
      <th>Status</th>
      <th>Password</th>
      <th>Actions</th>
    `;
  }

  const filtered = staffList.filter(s => {
    const roleMatch = (currentFilter === 'ALL' || s.role === currentFilter);
    const queryMatch = !query || 
      s.name.toLowerCase().includes(query) || 
      s.email.toLowerCase().includes(query) || 
      s.dept.toLowerCase().includes(query);
    return roleMatch && queryMatch;
  });

  if (filtered.length === 0) {
    const colCount = isDoctorView ? 12 : 10;
    tbody.innerHTML = `<tr><td colspan="${colCount}" style="text-align: center; color: #888;">No staff records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const statusClass = s.status === 'Active' ? 'active' : (s.status === 'On Leave' ? 'leave' : 'inactive');

    if (isDoctorView) {
      const shiftDesc = s.shift === 'Morning' ? 'Morning (9 AM - 12 PM)' : (s.shift === 'Afternoon' ? 'Afternoon (2 PM - 4 PM)' : 'Both (9-12 & 2-4)');
      return `
        <tr>
          <td>${s.name}</td>
          <td>${s.role}</td>
          <td>${s.dept}</td>
          <td>${s.gender}</td>
          <td>${s.dob || 'N/A'}</td>
          <td>${s.joiningDate || 'N/A'}</td>
          <td>${s.email}</td>
          <td>${s.fee || '₹500'}</td>
          <td>${shiftDesc}</td>
          <td>
            <span class="status-tag ${statusClass}" onclick="toggleStaffStatus('${s.id}')" title="Click to toggle status">
              ${s.status} &#x21bb;
            </span>
          </td>
          <td><code>${s.password}</code></td>
          <td>
            <button class="btn-action-edit" onclick="editStaff('${s.id}')">Edit</button>
            <button class="btn-action-del" onclick="deleteStaff('${s.id}')">Delete</button>
          </td>
        </tr>
      `;
    }

    // Clean Staff Row: Completely free of Fee / Shift columns
    return `
      <tr>
        <td>${s.name}</td>
        <td>${s.role}</td>
        <td>${s.dept}</td>
        <td>${s.gender}</td>
        <td>${s.dob || 'N/A'}</td>
        <td>${s.joiningDate || 'N/A'}</td>
        <td>${s.email}</td>
        <td>
          <span class="status-tag ${statusClass}" onclick="toggleStaffStatus('${s.id}')" title="Click to toggle status">
            ${s.status} &#x21bb;
          </span>
        </td>
        <td><code>${s.password}</code></td>
        <td>
          <button class="btn-action-edit" onclick="editStaff('${s.id}')">Edit</button>
          <button class="btn-action-del" onclick="deleteStaff('${s.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function editStaff(id) {
  const s = staffList.find(item => item.id === id);
  if (!s) return;

  document.getElementById('editStaffId').value = s.id;
  document.getElementById('staffRole').value = s.role;
  document.getElementById('staffName').value = s.name;
  document.getElementById('staffGender').value = s.gender || 'Male';
  document.getElementById('staffDOB').value = s.dob || '';
  document.getElementById('staffJoiningDate').value = s.joiningDate || '';
  document.getElementById('staffEmail').value = s.email;
  document.getElementById('staffContact').value = s.contact;
  document.getElementById('staffSalary').value = s.salary;
  document.getElementById('staffPass').value = s.password;
  document.getElementById('staffStatus').value = s.status || 'Active';

  toggleDoctorFields(s.role);
  if (s.role === 'Doctor') {
    document.getElementById('doctorDept').value = s.dept || 'Cardiology';
    document.getElementById('doctorFee').value = s.fee || '₹500';
    document.getElementById('doctorShiftType').value = s.shift || 'Both';
  }

  document.getElementById('formTitle').textContent = `Edit Details - ${s.name}`;
  document.getElementById('saveBtn').textContent = 'Update';
  switchAdminTab('add');
}

function deleteStaff(id) {
  const s = staffList.find(item => item.id === id);
  if (!s) return;

  if (confirm(`Delete ${s.name}?`)) {
    staffList = staffList.filter(item => item.id !== id);
    saveData();
    renderTable();
  }
}

// 4. Admin Patient Bookings Table (Exact match to uploaded screenshot)
function renderAdminPatientTable() {
  const tbody = document.getElementById('patientTableBody');
  tbody.innerHTML = bookingList.map(b => {
    return `
      <tr>
        <td>${b.mmr || 'MMR1003'}</td>
        <td>${b.patientName}</td>
        <td>${b.patientGender || 'Female'}</td>
        <td>${b.patientPhone}</td>
        <td>${b.doctor}</td>
        <td>${b.dept}</td>
        <td>${b.date}</td>
        <td>${b.slot}</td>
        <td>${b.fee}</td>
        <td>
          <button class="btn-action-del" onclick="deleteBooking('${b.id}')">Cancel</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddPatientModal() {
  const name = prompt("Enter Patient Name:");
  if (!name) return;
  const email = prompt("Enter Patient Email:");
  if (!email) return;
  const phone = prompt("Enter Patient Phone Number (Password):");
  if (!phone) return;
  const gender = prompt("Enter Gender (Male/Female/Other):", "Female") || "Female";
  const dob = prompt("Enter Patient DOB (YYYY-MM-DD):", "2000-01-01") || "2000-01-01";

  // Prompt for Department
  const dept = prompt("Enter Department (Cardiology, General Medicine, Pediatrics, Orthopedics, Dermatology):", "General Medicine") || "General Medicine";

  // Assign Doctor in that department
  const docs = staffList.filter(s => s.role === 'Doctor' && s.dept.toLowerCase() === dept.toLowerCase());
  const assigned = docs.length > 0 ? docs[0] : (staffList.find(s => s.role === 'Doctor') || { name: 'Dr. Arun', dept: 'Cardiology', fee: '₹750' });

  const mmr = `MMR${Math.floor(1000 + Math.random() * 9000)}`;
  const today = new Date().toISOString().split('T')[0];

  const newPatient = {
    id: Date.now().toString(),
    mmr,
    name,
    gender,
    dob,
    email,
    phone
  };

  const newBooking = {
    id: `BOK-${Date.now().toString().slice(-4)}`,
    mmr,
    patientEmail: email,
    patientName: name,
    patientGender: gender,
    patientPhone: phone,
    doctor: assigned.name,
    dept: assigned.dept,
    date: today,
    slot: '09:00 AM',
    fee: assigned.fee,
    status: 'Confirmed'
  };

  patientList.push(newPatient);
  bookingList.push(newBooking);
  saveData();
  renderAdminPatientTable();
  alert(`Patient Added: ${name}\nMMR: ${mmr}\nDept: ${assigned.dept}\nDoctor: ${assigned.name}\nSlot: ${today} at 09:00 AM`);
}

function deleteBooking(id) {
  if (confirm("Cancel this appointment?")) {
    bookingList = bookingList.filter(b => b.id !== id);
    saveData();
    renderAdminPatientTable();
  }
}

// Session Check on Load
window.addEventListener('DOMContentLoaded', () => {
  loadData();
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  if (session) {
    if (session.role === 'Admin') showAdminView();
    else if (session.role === 'Patient') showPatientView(session);
  }
});