/* =========================================================================
   LABORATORY TECHNICIAN LOGIC WITH PHYSIOLOGICAL & REAL-LIFE VALIDATIONS
   ========================================================================= */
const DB_DOCTOR_TESTS_KEY = 'quad_clinic_doctor_prescribed_tests_v4';
const DB_LAB_RATES_KEY = 'quad_clinic_lab_rates_list_v4';
const SESSION_KEY = 'quad_clinic_user_session';

const DEFAULT_TEST_RATES = [
  { code: 'LT-01', name: 'Fasting Blood Sugar (FBS)', profile: 'Diabetes', price: 150, available: true },
  { code: 'LT-02', name: 'Postprandial Blood Sugar (PPBS)', profile: 'Diabetes', price: 150, available: true },
  { code: 'LT-03', name: 'HbA1c Glycated Hemoglobin', profile: 'Diabetes', price: 500, available: true },
  { code: 'LT-04', name: 'Blood Pressure & ECG Screening', profile: 'Cardiac & BP', price: 350, available: true },
  { code: 'LT-05', name: 'Lipid Profile (Cholesterol)', profile: 'Cardiac & BP', price: 650, available: true },
  { code: 'LT-06', name: 'Complete Blood Count (CBC)', profile: 'Hematology', price: 450, available: true },
  { code: 'LT-07', name: 'Kidney Function Test (KFT)', profile: 'Renal', price: 600, available: true },
  { code: 'LT-08', name: 'Liver Function Test (LFT)', profile: 'Hepatic', price: 750, available: true },
  { code: 'LT-09', name: 'Thyroid Stimulating Hormone (TSH)', profile: 'Thyroid', price: 400, available: true }
];

const SEED_DOCTOR_TESTS = [
  {
    id: 'TEST-101',
    mmr: 'MMR1003',
    patientName: 'jaii',
    phone: '9846012345',
    doctor: 'Dr. Arun',
    testType: 'Blood Pressure & ECG Screening',
    cost: 350,
    available: true,
    resultValue: '120/80 mmHg',
    status: 'Completed',
    paid: true
  },
  {
    id: 'TEST-102',
    mmr: 'MMR1171',
    patientName: 'lol',
    phone: '8123823293',
    doctor: 'Dr. Sanjay Patel',
    testType: 'Fasting Blood Sugar (FBS)',
    cost: 150,
    available: true,
    resultValue: '',
    status: 'Pending',
    paid: false
  },
  {
    id: 'TEST-103',
    mmr: 'MMR4186',
    patientName: 'new',
    phone: '7987654321',
    doctor: 'Dr. Arvind Nair',
    testType: 'HbA1c Glycated Hemoglobin',
    cost: 500,
    available: false,
    resultValue: '',
    status: 'Pending',
    paid: false
  }
];

let labTests = [];
let testRates = [];
let activeLabTech = null;

function initLabPortal() {
  const sessionData = sessionStorage.getItem(SESSION_KEY);
  if (!sessionData) {
    window.location.href = 'admin.html';
    return;
  }
  activeLabTech = JSON.parse(sessionData);
  if (activeLabTech.role !== 'Lab Technician' && activeLabTech.role !== 'Admin') {
    window.location.href = 'admin.html';
    return;
  }

  document.getElementById('labUserDisplay').textContent = `Technician: ${activeLabTech.name || 'Rahul Vijayan'}`;
  document.getElementById('labTechName').textContent = activeLabTech.name || 'Rahul Vijayan';

  const storedTests = localStorage.getItem(DB_DOCTOR_TESTS_KEY);
  labTests = storedTests ? JSON.parse(storedTests) : JSON.parse(JSON.stringify(SEED_DOCTOR_TESTS));

  const storedRates = localStorage.getItem(DB_LAB_RATES_KEY);
  testRates = storedRates ? JSON.parse(storedRates) : JSON.parse(JSON.stringify(DEFAULT_TEST_RATES));

  saveLabData();
  renderLabTestsTable();
  renderRatesTable();
  populateBillDropdown();
}

function saveLabData() {
  localStorage.setItem(DB_DOCTOR_TESTS_KEY, JSON.stringify(labTests));
  localStorage.setItem(DB_LAB_RATES_KEY, JSON.stringify(testRates));
}

function switchLabTab(tabKey) {
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.content-pane').forEach(p => p.classList.remove('active'));

  if (tabKey === 'tests') {
    document.getElementById('paneTests').classList.add('active');
    document.getElementById('btnTabTests').classList.add('active');
    renderLabTestsTable();
  } else if (tabKey === 'rates') {
    document.getElementById('paneRates').classList.add('active');
    document.getElementById('btnTabRateCard').classList.add('active');
    renderRatesTable();
  } else if (tabKey === 'bill') {
    document.getElementById('paneBill').classList.add('active');
    document.getElementById('btnTabBill').classList.add('active');
    populateBillDropdown();
  }
}

function handleLabLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'admin.html';
}

function renderLabTestsTable() {
  const tbody = document.getElementById('labTestsTableBody');
  const query = (document.getElementById('searchLabInput').value || '').trim().toLowerCase();

  const filtered = labTests.filter(t => 
    !query ||
    t.patientName.toLowerCase().includes(query) ||
    t.mmr.toLowerCase().includes(query) ||
    t.testType.toLowerCase().includes(query) ||
    t.doctor.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: #888;">No test prescriptions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(t => `
    <tr>
      <td><strong>${t.id}</strong></td>
      <td><strong>${t.mmr}</strong></td>
      <td>${t.patientName}</td>
      <td>${t.doctor}</td>
      <td><strong>${t.testType}</strong></td>
      <td><strong>₹${t.cost}</strong></td>
      <td>
        <span class="status-tag ${t.available ? 'active' : 'inactive'}" onclick="toggleAvailability('${t.id}')" title="Click to toggle availability">
          ${t.available ? 'Available' : 'Unavailable'} &#x21bb;
        </span>
      </td>
      <td>
        ${t.resultValue ? `<strong>${t.resultValue}</strong>` : `<button class="btn-action-edit" onclick="enterResult('${t.id}')">+ Add Result</button>`}
      </td>
      <td>
        <span class="status-tag ${t.status === 'Completed' ? 'active' : 'leave'}">
          ${t.status}
        </span>
      </td>
      <td>
        <button class="btn-action-edit" style="background:#0b3c5d;" onclick="openBillTabFor('${t.id}')">Bill</button>
      </td>
    </tr>
  `).join('');
}

function renderRatesTable() {
  const tbody = document.getElementById('labRatesTableBody');
  tbody.innerHTML = testRates.map(r => `
    <tr>
      <td><strong>${r.code}</strong></td>
      <td><strong>${r.name}</strong></td>
      <td>${r.profile}</td>
      <td><strong>₹${r.price}</strong></td>
      <td>
        <span class="status-tag ${r.available ? 'active' : 'inactive'}">
          ${r.available ? 'Available' : 'Unavailable'}
        </span>
      </td>
      <td>
        <button class="btn-action-edit" onclick="updateTestPrice('${r.code}')">Edit Price</button>
      </td>
    </tr>
  `).join('');
}

function toggleAvailability(id) {
  const test = labTests.find(t => t.id === id);
  if (!test) return;
  test.available = !test.available;
  saveLabData();
  renderLabTestsTable();
}

/* =========================================================================
   STRICT PHYSIOLOGICAL LOGICAL VALIDATION FOR TEST RESULTS
   ========================================================================= */
function validateTestResult(testType, rawVal) {
  const val = rawVal.trim();
  if (!val) return { valid: false, message: "Result value cannot be empty." };

  // 1. Diabetes: FBS or PPBS (Blood Glucose)
  if (testType.includes('Blood Sugar') || testType.includes('FBS') || testType.includes('PPBS')) {
    const numericMatch = val.match(/^(\d+(\.\d+)?)\s*(mg\/dL)?$/i);
    if (!numericMatch) {
      return { valid: false, message: "Invalid Glucose format. Enter numeric value in mg/dL (e.g., 105 or 140 mg/dL)." };
    }
    const num = parseFloat(numericMatch[1]);
    if (num < 20 || num > 1000) {
      return { valid: false, message: `Physiologically impossible Blood Sugar (${num} mg/dL). Must be between 20 and 1000 mg/dL.` };
    }
    return { valid: true, formatted: `${num} mg/dL` };
  }

  // 2. Diabetes: HbA1c Percentage
  if (testType.includes('HbA1c')) {
    const numericMatch = val.match(/^(\d+(\.\d+)?)\s*%?$/);
    if (!numericMatch) {
      return { valid: false, message: "Invalid HbA1c format. Enter percentage value (e.g., 5.7 or 7.2%)." };
    }
    const num = parseFloat(numericMatch[1]);
    if (num < 2.5 || num > 20.0) {
      return { valid: false, message: `Physiologically impossible HbA1c (${num}%). Must be between 2.5% and 20.0%.` };
    }
    return { valid: true, formatted: `${num}%` };
  }

  // 3. Blood Pressure: Systolic / Diastolic
  if (testType.includes('Blood Pressure') || testType.includes('BP')) {
    const bpMatch = val.match(/^(\d{2,3})\s*\/\s*(\d{2,3})(\s*mmHg)?$/i);
    if (!bpMatch) {
      return { valid: false, message: "Invalid Blood Pressure format. Use Systolic/Diastolic format (e.g., 120/80 or 130/85 mmHg)." };
    }
    const sys = parseInt(bpMatch[1], 10);
    const dia = parseInt(bpMatch[2], 10);

    if (sys < 60 || sys > 260) {
      return { valid: false, message: `Systolic pressure (${sys} mmHg) is outside human survivable range (60 - 260 mmHg).` };
    }
    if (dia < 40 || dia > 150) {
      return { valid: false, message: `Diastolic pressure (${dia} mmHg) is outside human survivable range (40 - 150 mmHg).` };
    }
    if (sys <= dia) {
      return { valid: false, message: "Systolic pressure must be strictly greater than Diastolic pressure." };
    }
    return { valid: true, formatted: `${sys}/${dia} mmHg` };
  }

  // General check: disallow random special characters or single-letter nonsense
  if (val.length < 2 || !/[A-Za-z0-9]/.test(val)) {
    return { valid: false, message: "Result must contain valid diagnostic notes or measurements." };
  }

  return { valid: true, formatted: val };
}

function enterResult(id) {
  const test = labTests.find(t => t.id === id);
  if (!test) return;

  // Real-life guard: Cannot run test if reagents are out of stock
  if (!test.available) {
    alert(`TEST UNAVAILABLE: Reagents/kits for "${test.testType}" are currently marked Out of Stock. Mark available first once replenished.`);
    return;
  }

  const input = prompt(`Enter clinical observed result for ${test.patientName} (${test.testType}):\nExamples: 105 mg/dL, 5.8%, or 120/80 mmHg`);
  if (input === null) return; // User cancelled

  const check = validateTestResult(test.testType, input);
  if (!check.valid) {
    alert(`Validation Error:\n${check.message}`);
    return;
  }

  test.resultValue = check.formatted;
  test.status = 'Completed';
  saveLabData();
  renderLabTestsTable();
  populateBillDropdown();
  alert(`Result recorded successfully: ${test.resultValue}`);
}

function updateTestPrice(code) {
  const item = testRates.find(r => r.code === code);
  if (!item) return;

  const newPriceStr = prompt(`Enter new price for ${item.name} (Current: ₹${item.price}):`, item.price);
  if (newPriceStr === null) return;

  const p = parseFloat(newPriceStr.trim());
  if (isNaN(p) || p < 10 || p > 50000) {
    alert("Invalid Price! Test price must be a valid positive amount between ₹10 and ₹50,000.");
    return;
  }

  item.price = p;
  // Update any pending unbilled tests matching this test name
  labTests.forEach(t => {
    if (t.testType === item.name && !t.paid) t.cost = p;
  });

  saveLabData();
  renderRatesTable();
  renderLabTestsTable();
  populateBillDropdown();
  alert(`Price updated for ${item.name} to ₹${p}`);
}

function promptAddNewTestRate() {
  const name = prompt("Enter Diagnostic Test Name (e.g. Serum Creatinine):");
  if (!name || name.trim().length < 3) {
    alert("Invalid Test Name: Must be at least 3 characters long.");
    return;
  }

  const profile = prompt("Enter Clinical Profile / Group (e.g. Renal, Diabetes, Cardiac):", "General");
  if (!profile || !profile.trim()) {
    alert("Clinical profile cannot be empty.");
    return;
  }

  const priceStr = prompt("Enter Standard Test Price (INR):", "350");
  const price = parseFloat(priceStr ? priceStr.trim() : '');
  if (isNaN(price) || price < 10 || price > 50000) {
    alert("Invalid Price: Must be between ₹10 and ₹50,000.");
    return;
  }

  const code = `LT-${String(testRates.length + 1).padStart(2, '0')}`;
  testRates.push({ code, name: name.trim(), profile: profile.trim(), price, available: true });
  saveLabData();
  renderRatesTable();
  alert(`Added ${name} (₹${price}) to rate list!`);
}

function populateBillDropdown() {
  const select = document.getElementById('billSelectReport');
  if (!select) return;

  // Real-life billing rule: Can only generate bills for completed/conducted tests
  const billable = labTests.filter(t => t.status === 'Completed' && !t.paid);

  if (billable.length === 0) {
    select.innerHTML = '<option value="" disabled selected>-- No Unpaid Completed Tests Available --</option>';
    return;
  }

  select.innerHTML = '<option value="" disabled selected>-- Select Patient Test to Bill --</option>' +
    billable.map(t => `<option value="${t.id}">${t.id} - ${t.patientName} (${t.testType}) - ₹${t.cost}</option>`).join('');
}

function openBillTabFor(id) {
  const test = labTests.find(t => t.id === id);
  if (!test) return;

  // Real-life validation check before billing
  if (test.status !== 'Completed') {
    alert("Cannot generate bill! Test has not been completed. Please enter test results first.");
    return;
  }

  if (test.paid) {
    alert(`Test ${test.id} for ${test.patientName} is already PAID.`);
    return;
  }

  switchLabTab('bill');
  document.getElementById('billSelectReport').value = id;
  previewLabInvoice(id);
}

function previewLabInvoice(id) {
  const test = labTests.find(t => t.id === id);
  if (!test) return;

  document.getElementById('billInvoiceNo').textContent = `INV-${test.id}`;
  document.getElementById('billDateDisplay').textContent = `Date: 2026-11-21`;
  document.getElementById('billPtName').textContent = test.patientName;
  document.getElementById('billPtMMR').textContent = test.mmr;
  document.getElementById('billDocName').textContent = test.doctor;

  document.getElementById('billItemName').textContent = test.testType;
  document.getElementById('billItemObserved').textContent = test.resultValue || 'N/A';
  document.getElementById('billItemPrice').textContent = `₹${test.cost}`;
  document.getElementById('billGrandTotal').textContent = `₹${test.cost}`;

  document.getElementById('printableBillArea').style.display = 'block';
}

function markBillPaid() {
  const select = document.getElementById('billSelectReport');
  const id = select.value;
  const test = labTests.find(t => t.id === id);

  if (!test) {
    alert("Please select a test from the dropdown first.");
    return;
  }

  if (test.paid) {
    alert("This bill is already recorded as Paid.");
    return;
  }

  test.paid = true;
  saveLabData();
  renderLabTestsTable();
  populateBillDropdown();
  document.getElementById('printableBillArea').style.display = 'none';
  alert(`Payment of ₹${test.cost} for ${test.testType} (Patient: ${test.patientName}) recorded successfully!`);
  switchLabTab('tests');
}

window.addEventListener('DOMContentLoaded', initLabPortal);