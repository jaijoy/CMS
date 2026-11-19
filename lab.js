/* =========================================================
   LABORATORY TECHNICIAN LOGIC (TEST NAME & PRICE INCLUDED)
   ========================================================= */
const DB_DOCTOR_TESTS_KEY = 'quad_clinic_doctor_prescribed_tests_v2';
const DB_LAB_RATES_KEY = 'quad_clinic_lab_rates_list_v2';
const SESSION_KEY = 'quad_clinic_user_session';

// Standard Test Catalog with Test Name and Test Price
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

// Prescribed Tests from Doctors with Test Name and Test Price
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
    available: false, // Out of stock/unavailable
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
          ${r.available ? 'Available' : 'Out of Stock'}
        </span>
      </td>
      <td>
        <button class="btn-action-edit" onclick="updateTestPrice('${r.code}')">Edit Price</button>
      </td>
    </tr>
  `).join('');
}

function updateTestPrice(code) {
  const item = testRates.find(r => r.code === code);
  if (!item) return;

  const newPrice = prompt(`Enter new price for ${item.name} (Current: ₹${item.price}):`, item.price);
  const p = parseFloat(newPrice);
  if (!isNaN(p) && p > 0) {
    item.price = p;
    saveLabData();
    renderRatesTable();
  }
}

function promptAddNewTestRate() {
  const name = prompt("Enter Diagnostic Test Name (e.g. Serum Calcium):");
  if (!name || !name.trim()) return;

  const profile = prompt("Enter Profile/Group (e.g. Bone & Mineral, Diabetes):", "General");
  const priceStr = prompt("Enter Test Price (INR):", "300");
  const price = parseFloat(priceStr);
  if (isNaN(price) || price <= 0) {
    alert("Invalid price.");
    return;
  }

  const code = `LT-0${testRates.length + 1}`;
  testRates.push({ code, name: name.trim(), profile: profile.trim(), price, available: true });
  saveLabData();
  renderRatesTable();
  alert(`Added ${name} with price ₹${price}!`);
}

function toggleAvailability(id) {
  const test = labTests.find(t => t.id === id);
  if (!test) return;
  test.available = !test.available;
  saveLabData();
  renderLabTestsTable();
}

function enterResult(id) {
  const test = labTests.find(t => t.id === id);
  if (!test) return;

  if (!test.available) {
    alert("This test is currently UNAVAILABLE. Reagents need to be marked Available first.");
    return;
  }

  const val = prompt(`Enter test result for ${test.patientName} (${test.testType}):`, "e.g. 110 mg/dL");
  if (val && val.trim()) {
    test.resultValue = val.trim();
    test.status = 'Completed';
    saveLabData();
    renderLabTestsTable();
  }
}

function populateBillDropdown() {
  const select = document.getElementById('billSelectReport');
  select.innerHTML = '<option value="" disabled selected>-- Select Patient Test --</option>' +
    labTests.map(t => `<option value="${t.id}">${t.id} - ${t.patientName} (${t.testType}) - ₹${t.cost}</option>`).join('');
}

function openBillTabFor(id) {
  switchLabTab('bill');
  document.getElementById('billSelectReport').value = id;
  previewLabInvoice(id);
}

function previewLabInvoice(id) {
  const test = labTests.find(t => t.id === id);
  if (!test) return;

  document.getElementById('billInvoiceNo').textContent = `INV-${test.id}`;
  document.getElementById('billDateDisplay').textContent = `Date: 2026-11-19`;
  document.getElementById('billPtName').textContent = test.patientName;
  document.getElementById('billPtMMR').textContent = test.mmr;
  document.getElementById('billDocName').textContent = test.doctor;

  document.getElementById('billItemName').textContent = test.testType;
  document.getElementById('billItemObserved').textContent = test.resultValue || 'Pending Result';
  document.getElementById('billItemPrice').textContent = `₹${test.cost}`;
  document.getElementById('billGrandTotal').textContent = `₹${test.cost}`;

  document.getElementById('printableBillArea').style.display = 'block';
}

function markBillPaid() {
  const id = document.getElementById('billSelectReport').value;
  const test = labTests.find(t => t.id === id);
  if (test) {
    test.paid = true;
    saveLabData();
    alert(`Payment of ₹${test.cost} for ${test.testType} recorded as Paid!`);
    switchLabTab('tests');
  }
}

window.addEventListener('DOMContentLoaded', initLabPortal);