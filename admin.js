/* =========================================================
   QUAD CLINIC - STRICT VALIDATION (AGE < 60 ENFORCED)
   ========================================================= */

const DB_STAFF_KEY = 'quad_clinic_staff_strict_v9';
const DB_PATIENT_KEY = 'quad_clinic_patients_strict_v9';
const DB_BOOKINGS_KEY = 'quad_clinic_bookings_strict_v9';
const SESSION_KEY = 'quad_clinic_user_session';

// Standard 30-Minute Shifts
const MORNING_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"
];

const AFTERNOON_SLOTS = [
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
];

// Seed Staff (All compliant with: 21 <= Staff < 60, 27 < Doctor < 60)
const DEFAULT_STAFF = [
  { 
    id: '1', 
    name: 'Dr. Arun', 
    role: 'Doctor', 
    dept: 'Cardiology',
    gender: 'Male',
    bloodGroup: 'O+',
    dob: '1984-05-12', // ~42 yrs
    joiningDate: '2020-01-15',
    email: 'arun@quadclinic.com', 
    contact: '9447112233', 
    salary: '120000', 
    fee: '750', 
    shift: 'Both',
    status: 'Active', 
    password: 'doc123' 
  },
  { 
    id: '2', 
    name: 'Dr. Arvind Nair', 
    role: 'Doctor', 
    dept: 'General Medicine',
    gender: 'Male',
    bloodGroup: 'B+',
    dob: '1982-10-24', // ~44 yrs
    joiningDate: '2019-06-01',
    email: 'doctor@quadclinic.com', 
    contact: '9447122334', 
    salary: '95000', 
    fee: '500', 
    shift: 'Morning',
    status: 'Active', 
    password: 'doc123' 
  },
  { 
    id: '3', 
    name: 'Dr. Meera Krishnan', 
    role: 'Doctor', 
    dept: 'Pediatrics',
    gender: 'Female',
    bloodGroup: 'A+',
    dob: '1988-03-18', // ~38 yrs
    joiningDate: '2021-08-10',
    email: 'meera@quadclinic.com', 
    contact: '9895233445', 
    salary: '90000', 
    fee: '600', 
    shift: 'Afternoon',
    status: 'Active', 
    password: 'doc123' 
  },
  { 
    id: '4', 
    name: 'Dr. Deepa Thomas', 
    role: 'Doctor', 
    dept: 'Orthopedics',
    gender: 'Female',
    bloodGroup: 'AB+',
    dob: '1985-11-05', // ~41 yrs
    joiningDate: '2020-11-20',
    email: 'deepa@quadclinic.com', 
    contact: '9895001122', 
    salary: '95000', 
    fee: '650', 
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
    bloodGroup: 'O-',
    dob: '1986-07-29', // ~40 yrs
    joiningDate: '2022-03-01',
    email: 'sanjay@quadclinic.com', 
    contact: '9811223344', 
    salary: '85000', 
    fee: '500', 
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
    bloodGroup: 'A+',
    dob: '1998-09-14', // ~28 yrs
    joiningDate: '2023-02-15',
    email: 'reception@quadclinic.com', 
    contact: '9847011223', 
    salary: '24000', 
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
    bloodGroup: 'B-',
    dob: '1995-12-03', // ~31 yrs
    joiningDate: '2022-07-10',
    email: 'lab@quadclinic.com', 
    contact: '9746344556', 
    salary: '28500', 
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
    bloodGroup: 'O+',
    dob: '1996-04-22', // ~30 yrs
    joiningDate: '2023-01-05',
    email: 'pharmacy@quadclinic.com', 
    contact: '9633455667', 
    salary: '30000', 
    fee: null, 
    shift: null, 
    status: 'Active', 
    password: 'pharm123' 
  }
];

// Seed Patients
const DEFAULT_PATIENTS = [
  { id: '1', mmr: 'MMR1003', name: 'jaii', gender: 'Female', bloodGroup: 'O+', dob: '2000-08-15', email: 'jaii@gmail.com', phone: '9846012345' },
  { id: '2', mmr: 'MMR1171', name: 'lol', gender: 'Female', bloodGroup: 'A+', dob: '1998-02-10', email: 'lol@gmail.com', phone: '8123823293' },
  { id: '3', mmr: 'MMR4186', name: 'new', gender: 'Female', bloodGroup: 'B+', dob: '1995-11-25', email: 'new@gmail.com', phone: '7987654321' }
];

// Seed Bookings
const DEFAULT_BOOKINGS = [
  {
    id: 'BOK-101',
    mmr: 'MMR1003',
    patientEmail: 'jaii@gmail.com',
    patientName: 'jaii',
    patientGender: 'Female',
    patientBloodGroup: 'O+',
    patientPhone: '9846012345',
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
    patientBloodGroup: 'A+',
    patientPhone: '8123823293',
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
    patientBloodGroup: 'B+',
    patientPhone: '7987654321',
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

function parseSlotDateTime(dateStr, slotStr) {
  const [time, modifier] = slotStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  const d = new Date(dateStr);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/* =========================================================
   PASSWORD GENERATOR
   ========================================================= */
function generateRandomPassword() {
  const charsUpper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const charsLower = "abcdefghjkmnpqrstuvwxyz";
  const charsNums = "23456789";
  const charsSpecial = "@#$%=+";

  let pass = "";
  pass += charsUpper.charAt(Math.floor(Math.random() * charsUpper.length));
  pass += charsLower.charAt(Math.floor(Math.random() * charsLower.length));
  pass += charsNums.charAt(Math.floor(Math.random() * charsNums.length));
  pass += charsSpecial.charAt(Math.floor(Math.random() * charsSpecial.length));

  const allChars = charsUpper + charsLower + charsNums + charsSpecial;
  for (let i = 0; i < 4; i++) {
    pass += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  return pass.split('').sort(() => 0.5 - Math.random()).join('');
}

function generateNewPasswordForStaff() {
  document.getElementById('staffPass').value = generateRandomPassword();
}

/* =========================================================
   VALIDATION HELPERS
   ========================================================= */
function calculateAge(dobString) {
  const birth = new Date(dobString);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function isValidName(name) {
  return /^[A-Za-z. ]{3,}$/.test((name || '').trim());
}

function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test((phone || '').trim());
}

function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test((email || '').trim());
}

function isValidBloodGroup(bg) {
  return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(bg);
}

function isNotFutureDate(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return new Date(dateStr) <= today;
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

  if (!role) {
    msg.textContent = 'Please select a system role.';
    msg.style.display = 'block';
    return;
  }

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

  // Patient Login
  if (role === 'Patient') {
    const patient = patientList.find(p => p.email.toLowerCase() === username);
    if (!patient) {
      msg.textContent = `No patient found with email "${username}". Please register first.`;
      msg.style.display = 'block';
      return;
    }
    if (patient.phone !== password) {
      msg.textContent = 'Invalid password. (Password is your 10-digit phone number).';
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
    msg.textContent = `No ${role} record found matching "${username}".`;
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
   2. PATIENT BOOKING UI
   ========================================================= */
function showPatientView(patient) {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('adminView').style.display = 'none';
  document.getElementById('patientView').style.display = 'block';
  document.getElementById('navUserBar').style.display = 'none';

  document.getElementById('displayMMR').textContent = patient.mmr || 'MMR1003';
  document.getElementById('displayName').textContent = patient.name;
  document.getElementById('displayPhone').textContent = patient.phone;
  document.getElementById('displayGender').textContent = patient.gender || 'Female';
  document.getElementById('displayBloodGroup').textContent = patient.bloodGroup || 'O+';

  const todayStr = new Date().toISOString().split('T')[0];
  const datePicker = document.getElementById('selectDate');
  datePicker.min = todayStr;
  datePicker.value = todayStr;

  const dept = document.getElementById('selectDept');
  dept.value = 'Cardiology';
  onDepartmentChanged('Cardiology');

  renderPatientHistory(patient.email);
}

function onDepartmentChanged(dept) {
  const docSelect = document.getElementById('selectDoctor');
  const docs = staffList.filter(s => s.role === 'Doctor' && s.dept === dept && s.status !== 'Inactive');

  if (docs.length === 0) {
    docSelect.innerHTML = `<option value="" disabled selected>No doctors available in ${dept}</option>`;
    document.getElementById('slotsContainer').innerHTML = '<span style="font-size:12px; color:#888;">No slots available.</span>';
    document.getElementById('chosenSlotValue').value = '';
    return;
  }

  docSelect.innerHTML = docs.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
  refreshTimeSlotButtons();
}

function refreshTimeSlotButtons() {
  const staffId = document.getElementById('selectDoctor').value;
  const doc = staffList.find(s => s.id === staffId && s.role === 'Doctor');
  const dateVal = document.getElementById('selectDate').value;
  const container = document.getElementById('slotsContainer');

  if (!doc || !dateVal) {
    container.innerHTML = '<span style="font-size:12px; color:#888;">Select doctor and date.</span>';
    document.getElementById('chosenSlotValue').value = '';
    return;
  }

  const shiftType = doc.shift || 'Both';
  const now = new Date();

  const booked = bookingList
    .filter(b => b.doctor === doc.name && b.date === dateVal && b.status === 'Confirmed')
    .map(b => b.slot);

  let firstAvailable = null;
  let html = '';

  if (shiftType === 'Morning' || shiftType === 'Both') {
    html += '<div class="shift-section-title">Morning Shift (09:00 AM - 12:00 PM)</div><div class="slots-row">';
    MORNING_SLOTS.forEach(slot => {
      const isBooked = booked.includes(slot);
      const slotTime = parseSlotDateTime(dateVal, slot);
      const isPast = slotTime < now;
      const isDisabled = isBooked || isPast;

      if (!isDisabled && !firstAvailable) firstAvailable = slot;

      let btnTitle = isBooked ? 'Slot already booked' : (isPast ? 'Time has passed' : 'Available');
      html += `<button type="button" class="slot-btn" title="${btnTitle}" ${isDisabled ? 'disabled' : `onclick="pickSlot('${slot}', this)"`}>${slot}</button>`;
    });
    html += '</div>';
  }

  if (shiftType === 'Afternoon' || shiftType === 'Both') {
    html += '<div class="shift-section-title">Afternoon Shift (02:00 PM - 04:00 PM)</div><div class="slots-row">';
    AFTERNOON_SLOTS.forEach(slot => {
      const isBooked = booked.includes(slot);
      const slotTime = parseSlotDateTime(dateVal, slot);
      const isPast = slotTime < now;
      const isDisabled = isBooked || isPast;

      if (!isDisabled && !firstAvailable) firstAvailable = slot;

      let btnTitle = isBooked ? 'Slot already booked' : (isPast ? 'Time has passed' : 'Available');
      html += `<button type="button" class="slot-btn" title="${btnTitle}" ${isDisabled ? 'disabled' : `onclick="pickSlot('${slot}', this)"`}>${slot}</button>`;
    });
    html += '</div>';
  }

  container.innerHTML = html;

  if (firstAvailable) {
    const defaultBtn = Array.from(container.querySelectorAll('.slot-btn')).find(b => !b.disabled);
    if (defaultBtn) pickSlot(firstAvailable, defaultBtn);
  } else {
    document.getElementById('selectedTimeNotice').textContent = 'Selected Time: No available slots for this selection';
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
    alert("Please select a valid, active 30-minute time slot.");
    return;
  }

  const slotDateTime = parseSlotDateTime(date, slot);
  if (slotDateTime < new Date()) {
    alert("Cannot book a time slot that has already passed.");
    refreshTimeSlotButtons();
    return;
  }

  const exists = bookingList.find(b => b.doctor === doc.name && b.date === date && b.slot === slot && b.status === 'Confirmed');
  if (exists) {
    alert("This slot has just been reserved. Please pick another available time slot.");
    refreshTimeSlotButtons();
    return;
  }

  const newBooking = {
    id: `BOK-${Date.now().toString().slice(-4)}`,
    mmr: session.mmr || 'MMR1003',
    patientEmail: session.email,
    patientName: session.name,
    patientGender: session.gender || 'Female',
    patientBloodGroup: session.bloodGroup || 'O+',
    patientPhone: session.phone,
    doctor: doc.name,
    dept,
    date,
    slot,
    fee: `₹${doc.fee || 500}`,
    status: 'Confirmed'
  };

  bookingList.unshift(newBooking);
  saveData();

  alert(`Appointment Confirmed!\nDoctor: ${doc.name}\nDate: ${date}\nTime: ${slot}\nFee: ₹${doc.fee || 500}`);
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
    initAdminPatientEntryForm();
    renderAdminPatientTable();
  }
}

function filterByRole(role) {
  setFilter(role);
  switchAdminTab('table');
}

function toggleDoctorFields(role) {
  const box = document.getElementById('doctorExtraFields');
  box.style.display = (role === 'Doctor') ? 'block' : 'none';
  if (role === 'Doctor' && !document.getElementById('doctorFee').value) {
    document.getElementById('doctorFee').value = '500';
  }
}

function openAddForm(presetRole) {
  const form = document.getElementById('staffForm');
  form.reset();
  document.getElementById('editStaffId').value = '';
  document.getElementById('formTitle').textContent = 'Add Staff Details';
  document.getElementById('saveBtn').textContent = 'Submit Record';

  const alertBox = document.getElementById('staffValidationAlert');
  alertBox.style.display = 'none';

  const role = presetRole || 'Receptionist';
  document.getElementById('staffRole').value = role;
  toggleDoctorFields(role);

  const maleRadio = form.querySelector('input[name="staffGender"][value="Male"]');
  if (maleRadio) maleRadio.checked = true;

  // Auto-generate random secure password
  document.getElementById('staffPass').value = generateRandomPassword();
  switchAdminTab('add');
}

/* =========================================================
   STAFF SUBMISSION (STRICT AGE < 60 CHECK)
   ========================================================= */
function handleStaffSubmit(event) {
  event.preventDefault();
  const alertBox = document.getElementById('staffValidationAlert');
  alertBox.style.display = 'none';

  const form = document.getElementById('staffForm');
  const editId = document.getElementById('editStaffId').value;
  const role = document.getElementById('staffRole').value;
  const name = document.getElementById('staffName').value.trim();
  const genderChecked = form.querySelector('input[name="staffGender"]:checked');
  const gender = genderChecked ? genderChecked.value : '';
  const bloodGroup = document.getElementById('staffBloodGroup').value;
  const dob = document.getElementById('staffDOB').value;
  const joiningDate = document.getElementById('staffJoiningDate').value;
  const email = document.getElementById('staffEmail').value.trim();
  const contact = document.getElementById('staffContact').value.trim();
  const salary = document.getElementById('staffSalary').value.trim();
  const password = document.getElementById('staffPass').value.trim();
  const status = document.getElementById('staffStatus').value;

  // 1. Name Check
  if (!isValidName(name)) {
    showStaffValidationError("Name must be at least 3 letters long, letters and spaces only.");
    return;
  }

  // 2. DOB Check
  if (!dob) {
    showStaffValidationError("Please provide a valid Date of Birth.");
    return;
  }
  if (!isNotFutureDate(dob)) {
    showStaffValidationError("Date of Birth cannot be in the future.");
    return;
  }

  // 3. Exact Age Logical Validation
  const age = calculateAge(dob);

  // Maximum Working Age Check (< 60 years)
  if (age >= 60) {
    showStaffValidationError(`Staff member must be below 60 years of age (Current age from DOB: ${age} years).`);
    return;
  }

  // Minimum Age Checks
  if (role === 'Doctor') {
    if (age <= 27) {
      showStaffValidationError(`Doctor age must be strictly greater than 27 years (Current age from DOB: ${age} years).`);
      return;
    }
  } else {
    if (age < 21) {
      showStaffValidationError(`${role} age must be at least 21 years old (Current age from DOB: ${age} years).`);
      return;
    }
  }

  // 4. Joining Date Check
  if (!joiningDate) {
    showStaffValidationError("Please provide a valid Date of Joining.");
    return;
  }
  if (!isNotFutureDate(joiningDate)) {
    showStaffValidationError("Joining Date cannot be in the future.");
    return;
  }
  if (new Date(joiningDate) < new Date(dob)) {
    showStaffValidationError("Joining Date cannot precede Date of Birth.");
    return;
  }
  const ageAtJoining = new Date(joiningDate).getFullYear() - new Date(dob).getFullYear();
  if (ageAtJoining < 18) {
    showStaffValidationError("Employee must be at least 18 years old at joining.");
    return;
  }

  // 5. Phone Validation (6-9 start, exactly 10 digits)
  if (!isValidPhone(contact)) {
    showStaffValidationError("Phone Number must be exactly 10 digits and start with 6, 7, 8, or 9.");
    return;
  }

  // 6. Email Validation
  if (!isValidEmail(email)) {
    showStaffValidationError("Please enter a valid email address.");
    return;
  }

  // 7. Password Check
  if (!password || password.length < 4) {
    showStaffValidationError("Password must be at least 4 characters long.");
    return;
  }

  const isDoc = (role === 'Doctor');
  let dept = isDoc ? document.getElementById('doctorDept').value : 'Support';
  let fee = isDoc ? (document.getElementById('doctorFee').value.trim() || '500') : null;
  let shift = isDoc ? document.getElementById('doctorShiftType').value : null;

  if (editId) {
    const idx = staffList.findIndex(s => s.id === editId);
    if (idx !== -1) {
      staffList[idx] = { id: editId, name, role, dept, gender, bloodGroup, dob, joiningDate, email, contact, salary, fee, shift, status, password };
    }
  } else {
    const newMember = {
      id: Date.now().toString(),
      name,
      role,
      dept,
      gender,
      bloodGroup,
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

function showStaffValidationError(message) {
  const alertBox = document.getElementById('staffValidationAlert');
  alertBox.textContent = message;
  alertBox.style.display = 'block';
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

  if (isDoctorView) {
    theadRow.innerHTML = `
      <th>Name</th>
      <th>Role</th>
      <th>Department</th>
      <th>Gender</th>
      <th>Blood</th>
      <th>DOB</th>
      <th>Joined</th>
      <th>Email</th>
      <th>Fee</th>
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
      <th>Blood</th>
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
      s.dept.toLowerCase().includes(query) ||
      (s.contact && s.contact.includes(query));
    return roleMatch && queryMatch;
  });

  if (filtered.length === 0) {
    const colCount = isDoctorView ? 13 : 11;
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
          <td><strong>${s.bloodGroup || 'O+'}</strong></td>
          <td>${s.dob || 'N/A'}</td>
          <td>${s.joiningDate || 'N/A'}</td>
          <td>${s.email}</td>
          <td>₹${s.fee || '500'}</td>
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

    return `
      <tr>
        <td>${s.name}</td>
        <td>${s.role}</td>
        <td>${s.dept}</td>
        <td>${s.gender}</td>
        <td><strong>${s.bloodGroup || 'O+'}</strong></td>
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

  const form = document.getElementById('staffForm');
  document.getElementById('editStaffId').value = s.id;
  document.getElementById('staffRole').value = s.role;
  document.getElementById('staffName').value = s.name;

  const radio = form.querySelector(`input[name="staffGender"][value="${s.gender}"]`);
  if (radio) radio.checked = true;

  document.getElementById('staffBloodGroup').value = s.bloodGroup || 'O+';
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
    document.getElementById('doctorFee').value = s.fee || '500';
    document.getElementById('doctorShiftType').value = s.shift || 'Both';
  }

  document.getElementById('formTitle').textContent = `Edit Details - ${s.name}`;
  document.getElementById('saveBtn').textContent = 'Update Record';
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

/* =========================================================
   4. INLINE PATIENT REGISTRATION & ENTRY
   ========================================================= */
function initAdminPatientEntryForm() {
  const todayStr = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('newPtDate');
  dateInput.min = todayStr;
  if (!dateInput.value) dateInput.value = todayStr;

  const deptSelect = document.getElementById('newPtDept');
  if (!deptSelect.value) deptSelect.value = 'General Medicine';
  onAdminPatientDeptChange(deptSelect.value);
}

function onAdminPatientDeptChange(dept) {
  const docSelect = document.getElementById('newPtDoctor');
  const availableDocs = staffList.filter(s => s.role === 'Doctor' && s.dept === dept && s.status !== 'Inactive');

  if (availableDocs.length === 0) {
    docSelect.innerHTML = `<option value="" disabled selected>No active doctors in ${dept}</option>`;
    document.getElementById('newPtSlot').innerHTML = '<option value="" disabled selected>No slots</option>';
    return;
  }

  docSelect.innerHTML = availableDocs.map(d => `<option value="${d.id}">${d.name} (Fee: ₹${d.fee || 500})</option>`).join('');
  onAdminPatientDoctorChange(availableDocs[0].id);
}

function onAdminPatientDoctorChange(staffId) {
  onAdminPatientDateChange();
}

function onAdminPatientDateChange() {
  const staffId = document.getElementById('newPtDoctor').value;
  const doc = staffList.find(s => s.id === staffId && s.role === 'Doctor');
  const dateVal = document.getElementById('newPtDate').value;
  const slotSelect = document.getElementById('newPtSlot');

  if (!doc || !dateVal) {
    slotSelect.innerHTML = '<option value="" disabled selected>Select doctor and date</option>';
    return;
  }

  const shiftType = doc.shift || 'Both';
  const now = new Date();

  const booked = bookingList
    .filter(b => b.doctor === doc.name && b.date === dateVal && b.status === 'Confirmed')
    .map(b => b.slot);

  let candidateSlots = [];
  if (shiftType === 'Morning' || shiftType === 'Both') {
    candidateSlots = candidateSlots.concat(MORNING_SLOTS);
  }
  if (shiftType === 'Afternoon' || shiftType === 'Both') {
    candidateSlots = candidateSlots.concat(AFTERNOON_SLOTS);
  }

  const availableSlots = candidateSlots.filter(slot => {
    const isBooked = booked.includes(slot);
    const slotDateTime = parseSlotDateTime(dateVal, slot);
    const isPast = slotDateTime < now;
    return !isBooked && !isPast;
  });

  if (availableSlots.length === 0) {
    slotSelect.innerHTML = '<option value="" disabled selected>No slots available for this date</option>';
    return;
  }

  slotSelect.innerHTML = availableSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('');
}

function handlePatientEntrySubmit(event) {
  event.preventDefault();
  const alertBox = document.getElementById('patientValidationAlert');
  alertBox.style.display = 'none';

  const form = document.getElementById('patientEntryForm');
  const name = document.getElementById('newPtName').value.trim();
  const genderChecked = form.querySelector('input[name="newPtGender"]:checked');
  const gender = genderChecked ? genderChecked.value : '';
  const bloodGroup = document.getElementById('newPtBloodGroup').value;
  const dob = document.getElementById('newPtDOB').value;
  const phone = document.getElementById('newPtPhone').value.trim();
  const email = document.getElementById('newPtEmail').value.trim().toLowerCase();
  const dept = document.getElementById('newPtDept').value;
  const doctorId = document.getElementById('newPtDoctor').value;
  const date = document.getElementById('newPtDate').value;
  const slot = document.getElementById('newPtSlot').value;

  // 1. Name validation
  if (!isValidName(name)) {
    showPatientEntryError("Patient Name must be at least 3 letters long, alphabets and spaces only.");
    return;
  }

  // 2. Gender validation
  if (!gender) {
    showPatientEntryError("Please select a gender option.");
    return;
  }

  // 3. Blood Group validation
  if (!isValidBloodGroup(bloodGroup)) {
    showPatientEntryError("Invalid blood group selected.");
    return;
  }

  // 4. DOB validation: cannot be in future, and realistic age (<= 100 yrs)
  if (!dob) {
    showPatientEntryError("Please provide a valid Date of Birth.");
    return;
  }
  if (!isNotFutureDate(dob)) {
    showPatientEntryError("Patient Date of Birth cannot be in the future.");
    return;
  }
  const ptAge = calculateAge(dob);
  if (ptAge > 100) {
    showPatientEntryError(`Patient age is ${ptAge} years. Maximum valid age is 100 years.`);
    return;
  }

  // 5. Phone validation: exactly 10 digits starting with 6, 7, 8, or 9
  if (!isValidPhone(phone)) {
    showPatientEntryError("Phone Number must be exactly 10 digits and start with 6, 7, 8, or 9.");
    return;
  }

  // 6. Email validation
  if (!isValidEmail(email)) {
    showPatientEntryError("Please enter a valid patient email address.");
    return;
  }

  // Duplicate Check
  const duplicate = patientList.find(p => p.email.toLowerCase() === email || p.phone === phone);
  if (duplicate) {
    showPatientEntryError(`A patient already exists with this email or phone number (MMR: ${duplicate.mmr}, Name: ${duplicate.name}).`);
    return;
  }

  // 7. Doctor and Slot validations
  const doc = staffList.find(s => s.id === doctorId && s.role === 'Doctor');
  if (!doc) {
    showPatientEntryError("Please select an active doctor.");
    return;
  }

  if (!date) {
    showPatientEntryError("Please select an appointment date.");
    return;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (date < todayStr) {
    showPatientEntryError("Appointment date cannot be in the past.");
    return;
  }

  if (!slot) {
    showPatientEntryError("Please select an available 30-minute time slot.");
    return;
  }

  const slotDateTime = parseSlotDateTime(date, slot);
  if (slotDateTime < new Date()) {
    showPatientEntryError("Selected time slot has already passed.");
    onAdminPatientDateChange();
    return;
  }

  // Double booking check
  const conflict = bookingList.find(b => b.doctor === doc.name && b.date === date && b.slot === slot && b.status === 'Confirmed');
  if (conflict) {
    showPatientEntryError("This time slot has just been reserved. Please select another slot.");
    onAdminPatientDateChange();
    return;
  }

  // Generate Automatic Unique MMR
  const mmr = `MMR${Math.floor(1000 + Math.random() * 9000)}`;

  const newPatient = {
    id: Date.now().toString(),
    mmr,
    name,
    gender,
    bloodGroup,
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
    patientBloodGroup: bloodGroup,
    patientPhone: phone,
    doctor: doc.name,
    dept,
    date,
    slot,
    fee: `₹${doc.fee || 500}`,
    status: 'Confirmed'
  };

  patientList.push(newPatient);
  bookingList.push(newBooking);
  saveData();

  renderAdminPatientTable();
  resetPatientEntryForm();
  alert(`Patient Registered & Appointment Confirmed!\nMMR: ${mmr}\nName: ${name}\nAssigned Doctor: ${doc.name}\nDate: ${date}\nSlot: ${slot}\nPatient Password: ${phone}`);
}

function showPatientEntryError(message) {
  const alertBox = document.getElementById('patientValidationAlert');
  alertBox.textContent = message;
  alertBox.style.display = 'block';
}

function resetPatientEntryForm() {
  const form = document.getElementById('patientEntryForm');
  form.reset();
  document.getElementById('patientValidationAlert').style.display = 'none';
  initAdminPatientEntryForm();
}

function renderAdminPatientTable() {
  const tbody = document.getElementById('patientTableBody');
  tbody.innerHTML = bookingList.map(b => {
    return `
      <tr>
        <td>${b.mmr || 'MMR1003'}</td>
        <td>${b.patientName}</td>
        <td>${b.patientGender || 'Female'}</td>
        <td><strong>${b.patientBloodGroup || 'O+'}</strong></td>
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