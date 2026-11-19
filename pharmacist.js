/* =========================================================
   PHARMACIST LOGIC - MEDICINE NAME, PRICE & REAL-TIME STOCK
   ========================================================= */
const DB_PHARM_RX_KEY = 'quad_clinic_doctor_prescriptions_v3';
const DB_INVENTORY_KEY = 'quad_clinic_clean_inventory_v3';
const SESSION_KEY = 'quad_clinic_user_session';

// Standard Medicine Master with Code, Name, Price, and Stock
const DEFAULT_STOCK = [
  { code: 'MED-01', name: 'Tab. Paracetamol 650mg', price: 3.5, stock: 450 },
  { code: 'MED-02', name: 'Cap. Amoxicillin 500mg', price: 12.0, stock: 120 },
  { code: 'MED-03', name: 'Tab. Atorvastatin 10mg', price: 14.5, stock: 250 },
  { code: 'MED-04', name: 'Tab. Ecosprin 75mg', price: 4.8, stock: 320 },
  { code: 'MED-05', name: 'Tab. Cetirizine 10mg', price: 5.0, stock: 20 },
  { code: 'MED-06', name: 'Tab. Metformin 500mg', price: 6.0, stock: 400 },
  { code: 'MED-07', name: 'Tab. Telmisartan 40mg', price: 11.5, stock: 150 },
  { code: 'MED-08', name: 'Hydrocortisone Ointment', price: 65.0, stock: 0 } // Out of stock example
];

// Prescriptions Sent from Doctor Consultations
const DEFAULT_DOCTOR_PRESCRIPTIONS = [
  {
    id: 'RX-501',
    mmr: 'MMR1003',
    patientName: 'jaii',
    doctor: 'Dr. Arun',
    medicineName: 'Tab. Atorvastatin 10mg',
    qty: 15,
    status: 'Dispensed'
  },
  {
    id: 'RX-502',
    mmr: 'MMR1171',
    patientName: 'lol',
    doctor: 'Dr. Sanjay Patel',
    medicineName: 'Tab. Cetirizine 10mg',
    qty: 10,
    status: 'Pending'
  },
  {
    id: 'RX-503',
    mmr: 'MMR4186',
    patientName: 'new',
    doctor: 'Dr. Arvind Nair',
    medicineName: 'Cap. Amoxicillin 500mg',
    qty: 20,
    status: 'Pending'
  }
];

let prescriptions = [];
let inventory = [];
let activePharmacist = null;

function initPharmPortal() {
  const sessionData = sessionStorage.getItem(SESSION_KEY);
  if (!sessionData) {
    window.location.href = 'admin.html';
    return;
  }
  activePharmacist = JSON.parse(sessionData);
  if (activePharmacist.role !== 'Pharmacist' && activePharmacist.role !== 'Admin') {
    window.location.href = 'admin.html';
    return;
  }

  document.getElementById('pharmUserDisplay').textContent = `Pharmacist: ${activePharmacist.name || 'Sneha Thomas'}`;
  document.getElementById('pharmName').textContent = activePharmacist.name || 'Sneha Thomas';

  const storedRx = localStorage.getItem(DB_PHARM_RX_KEY);
  prescriptions = storedRx ? JSON.parse(storedRx) : JSON.parse(JSON.stringify(DEFAULT_DOCTOR_PRESCRIPTIONS));

  const storedStock = localStorage.getItem(DB_INVENTORY_KEY);
  inventory = storedStock ? JSON.parse(storedStock) : JSON.parse(JSON.stringify(DEFAULT_STOCK));

  savePharmData();
  renderPrescriptionsTable();
  renderRatesTable();
  renderInventoryTable();
}

function savePharmData() {
  localStorage.setItem(DB_PHARM_RX_KEY, JSON.stringify(prescriptions));
  localStorage.setItem(DB_INVENTORY_KEY, JSON.stringify(inventory));
}

function switchPharmTab(tabKey) {
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.content-pane').forEach(p => p.classList.remove('active'));

  if (tabKey === 'rx') {
    document.getElementById('paneRx').classList.add('active');
    document.getElementById('btnTabRx').classList.add('active');
    renderPrescriptionsTable();
  } else if (tabKey === 'rates') {
    document.getElementById('paneRates').classList.add('active');
    document.getElementById('btnTabRates').classList.add('active');
    renderRatesTable();
  } else if (tabKey === 'inventory') {
    document.getElementById('paneInventory').classList.add('active');
    document.getElementById('btnTabInventory').classList.add('active');
    renderInventoryTable();
  }
}

function handlePharmLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'admin.html';
}

function renderPrescriptionsTable() {
  const tbody = document.getElementById('prescriptionsTableBody');
  const query = (document.getElementById('searchRxInput').value || '').trim().toLowerCase();

  const filtered = prescriptions.filter(r => 
    !query ||
    r.patientName.toLowerCase().includes(query) ||
    r.mmr.toLowerCase().includes(query) ||
    r.doctor.toLowerCase().includes(query) ||
    r.medicineName.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: #888;">No doctor prescriptions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(r => {
    const med = inventory.find(m => m.name === r.medicineName) || { price: 0, stock: 0 };
    const totalCost = (med.price * r.qty).toFixed(2);
    const canDispense = r.status === 'Pending' && med.stock >= r.qty;

    return `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td><strong>${r.mmr}</strong></td>
        <td>${r.patientName}</td>
        <td>${r.doctor}</td>
        <td><strong>${r.medicineName}</strong></td>
        <td><strong>₹${med.price.toFixed(2)}</strong></td>
        <td>${r.qty} units</td>
        <td><strong>₹${totalCost}</strong></td>
        <td>${med.stock}</td>
        <td>
          <span class="status-tag ${r.status === 'Dispensed' ? 'active' : (med.stock < r.qty ? 'inactive' : 'leave')}">
            ${r.status === 'Dispensed' ? 'Dispensed' : (med.stock < r.qty ? 'Out of Stock' : 'Pending')}
          </span>
        </td>
        <td>
          ${r.status === 'Dispensed' 
            ? '<span style="color:#15803d; font-weight:bold;">Delivered</span>'
            : `<button class="btn-action-edit" style="background:#15803d;" ${!canDispense ? 'disabled' : ''} onclick="dispenseMedicine('${r.id}')">
                Dispense &amp; Deduct
              </button>`
          }
        </td>
      </tr>
    `;
  }).join('');
}

// REAL-TIME STOCK DEDUCTION
function dispenseMedicine(rxId) {
  const rx = prescriptions.find(r => r.id === rxId);
  if (!rx) return;

  const med = inventory.find(m => m.name === rx.medicineName);
  if (!med) {
    alert("Medicine not found in inventory!");
    return;
  }

  if (med.stock < rx.qty) {
    alert(`Insufficient Stock! Only ${med.stock} units available, but ${rx.qty} prescribed.`);
    return;
  }

  // Deduct directly from live stock
  med.stock -= rx.qty;
  rx.status = 'Dispensed';

  savePharmData();
  renderPrescriptionsTable();
  renderRatesTable();
  renderInventoryTable();

  const totalBill = (med.price * rx.qty).toFixed(2);
  alert(`Dispensed ${rx.qty} units of ${med.name} to ${rx.patientName}.\nUnit Price: ₹${med.price.toFixed(2)}\nTotal Amount: ₹${totalBill}\nRemaining Stock: ${med.stock}`);
}

// Render Master Rates Table
function renderRatesTable() {
  const tbody = document.getElementById('ratesTableBody');
  tbody.innerHTML = inventory.map(item => `
    <tr>
      <td><strong>${item.code}</strong></td>
      <td><strong>${item.name}</strong></td>
      <td><strong>₹${item.price.toFixed(2)}</strong></td>
      <td>${item.stock} units</td>
      <td>
        <span class="status-tag ${item.stock > 0 ? 'active' : 'inactive'}">
          ${item.stock > 0 ? 'Available' : 'Out of Stock'}
        </span>
      </td>
      <td>
        <button class="btn-action-edit" onclick="updateMedicinePrice('${item.code}')">Edit Price</button>
      </td>
    </tr>
  `).join('');
}

function updateMedicinePrice(code) {
  const item = inventory.find(m => m.code === code);
  if (!item) return;

  const newPrice = prompt(`Enter new price for ${item.name} (Current: ₹${item.price}):`, item.price);
  const p = parseFloat(newPrice);
  if (!isNaN(p) && p > 0) {
    item.price = p;
    savePharmData();
    renderRatesTable();
    renderPrescriptionsTable();
    renderInventoryTable();
  }
}

// Render Live Stock Table
function renderInventoryTable() {
  const tbody = document.getElementById('inventoryTableBody');
  tbody.innerHTML = inventory.map(item => {
    let statusClass = 'active';
    let statusText = 'In Stock';

    if (item.stock === 0) {
      statusClass = 'inactive';
      statusText = 'Out of Stock';
    } else if (item.stock <= 20) {
      statusClass = 'leave';
      statusText = 'Low Stock';
    }

    return `
      <tr>
        <td><strong>${item.code}</strong></td>
        <td><strong>${item.name}</strong></td>
        <td>₹${item.price.toFixed(2)}</td>
        <td><strong>${item.stock}</strong> units</td>
        <td><span class="status-tag ${statusClass}">${statusText}</span></td>
        <td>
          <button class="btn-action-edit" onclick="addStockQuantity('${item.code}')">+ Add Stock</button>
        </td>
      </tr>
    `;
  }).join('');
}

function addStockQuantity(code) {
  const med = inventory.find(m => m.code === code);
  if (!med) return;

  const input = prompt(`Enter quantity to add to ${med.name} (Current Stock: ${med.stock}):`, "50");
  const qty = parseInt(input, 10);
  if (!isNaN(qty) && qty > 0) {
    med.stock += qty;
    savePharmData();
    renderInventoryTable();
    renderRatesTable();
    renderPrescriptionsTable();
  }
}

function promptAddNewMedicine() {
  const name = prompt("Enter Medicine Name (e.g. Tab. Dolo 650mg):");
  if (!name || !name.trim()) return;

  const priceStr = prompt("Enter Unit Rate / Price (INR):", "5.00");
  const price = parseFloat(priceStr);
  if (isNaN(price) || price <= 0) {
    alert("Invalid price.");
    return;
  }

  const stockStr = prompt("Enter Initial Quantity (Stock):", "100");
  const stock = parseInt(stockStr, 10);
  if (isNaN(stock) || stock < 0) {
    alert("Invalid stock quantity.");
    return;
  }

  const code = `MED-0${inventory.length + 1}`;
  inventory.push({ code, name: name.trim(), price, stock });

  savePharmData();
  renderRatesTable();
  renderInventoryTable();
  renderPrescriptionsTable();
  alert(`Added ${name} at ₹${price.toFixed(2)} with ${stock} units in stock!`);
}

window.addEventListener('DOMContentLoaded', initPharmPortal);