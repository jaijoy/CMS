/* =========================================================================
   PHARMACIST LOGIC WITH STRICT INVENTORY DEPLETION & DRUG VALIDATIONS
   ========================================================================= */
const DB_PHARM_RX_KEY = 'quad_clinic_doctor_prescriptions_v4';
const DB_INVENTORY_KEY = 'quad_clinic_clean_inventory_v4';
const SESSION_KEY = 'quad_clinic_user_session';

const DEFAULT_STOCK = [
  { code: 'MED-01', name: 'Tab. Paracetamol 650mg', price: 3.5, stock: 450 },
  { code: 'MED-02', name: 'Cap. Amoxicillin 500mg', price: 12.0, stock: 120 },
  { code: 'MED-03', name: 'Tab. Atorvastatin 10mg', price: 14.5, stock: 250 },
  { code: 'MED-04', name: 'Tab. Ecosprin 75mg', price: 4.8, stock: 320 },
  { code: 'MED-05', name: 'Tab. Cetirizine 10mg', price: 5.0, stock: 20 },
  { code: 'MED-06', name: 'Tab. Metformin 500mg', price: 6.0, stock: 400 },
  { code: 'MED-07', name: 'Tab. Telmisartan 40mg', price: 11.5, stock: 150 },
  { code: 'MED-08', name: 'Hydrocortisone Ointment', price: 65.0, stock: 0 } // Out of stock
];

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
    const hasEnoughStock = med.stock >= r.qty;
    const canDispense = r.status === 'Pending' && hasEnoughStock;

    let statusText = 'Pending';
    let statusClass = 'leave';
    if (r.status === 'Dispensed') {
      statusText = 'Dispensed';
      statusClass = 'active';
    } else if (med.stock === 0) {
      statusText = 'Out of Stock';
      statusClass = 'inactive';
    } else if (!hasEnoughStock) {
      statusText = 'Low Stock';
      statusClass = 'inactive';
    }

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
          <span class="status-tag ${statusClass}">
            ${statusText}
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

/* =========================================================================
   STRICT DISPENSING & STOCK SUBTRACTION LOGIC
   ========================================================================= */
function dispenseMedicine(rxId) {
  const rx = prescriptions.find(r => r.id === rxId);
  if (!rx) return;

  if (rx.status === 'Dispensed') {
    alert("This prescription has already been dispensed.");
    return;
  }

  // 1. Prescription Quantity Sanity Guard
  const qtyToDispense = parseInt(rx.qty, 10);
  if (isNaN(qtyToDispense) || qtyToDispense <= 0 || qtyToDispense > 500) {
    alert(`Invalid prescription quantity (${rx.qty}). Quantities must be positive integers not exceeding 500 units.`);
    return;
  }

  // 2. Find medicine in live stock
  const med = inventory.find(m => m.name === rx.medicineName);
  if (!med) {
    alert(`MEDICATION ERROR: "${rx.medicineName}" is not registered in the dispensary inventory.`);
    return;
  }

  // 3. Out of stock validation
  if (med.stock <= 0) {
    alert(`OUT OF STOCK: "${med.name}" has 0 units remaining. Cannot dispense until restocked.`);
    return;
  }

  // 4. Insufficient quantity validation
  if (med.stock < qtyToDispense) {
    alert(`INSUFFICIENT INVENTORY: Requested ${qtyToDispense} units of "${med.name}", but only ${med.stock} units are currently in stock.`);
    return;
  }

  // 5. Confirm Transaction
  const unitPrice = parseFloat(med.price);
  const totalAmount = (unitPrice * qtyToDispense).toFixed(2);
  const confirmMessage = `Confirm Medication Dispense:\n\nPatient: ${rx.patientName} (${rx.mmr})\nMedicine: ${med.name}\nQuantity: ${qtyToDispense} units\nUnit Rate: ₹${unitPrice.toFixed(2)}\nTotal Amount: ₹${totalAmount}\n\nRemaining stock after dispense: ${med.stock - qtyToDispense}`;
  
  if (!confirm(confirmMessage)) {
    return;
  }

  // 6. Deduct from live stock
  med.stock -= qtyToDispense;
  rx.status = 'Dispensed';

  savePharmData();
  renderPrescriptionsTable();
  renderRatesTable();
  renderInventoryTable();

  alert(`Dispense successful! Stock updated. Invoiced: ₹${totalAmount}`);
}

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

  const newPriceStr = prompt(`Enter new unit price for ${item.name} (Current: ₹${item.price.toFixed(2)}):`, item.price);
  if (newPriceStr === null) return;

  const p = parseFloat(newPriceStr.trim());
  if (isNaN(p) || p < 0.50 || p > 10000.00) {
    alert("Invalid Price! Medicine unit rate must be between ₹0.50 and ₹10,000.00.");
    return;
  }

  item.price = p;
  savePharmData();
  renderRatesTable();
  renderPrescriptionsTable();
  renderInventoryTable();
  alert(`Price updated for ${item.name} to ₹${p.toFixed(2)}`);
}

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
  if (input === null) return;

  const qty = parseInt(input.trim(), 10);
  if (isNaN(qty) || qty <= 0 || qty > 10000) {
    alert("Invalid Restock Quantity: Must be an integer between 1 and 10,000 units.");
    return;
  }

  med.stock += qty;
  savePharmData();
  renderInventoryTable();
  renderRatesTable();
  renderPrescriptionsTable();
  alert(`Successfully restocked ${qty} units of ${med.name}. Total stock: ${med.stock}`);
}

function promptAddNewMedicine() {
  const name = prompt("Enter Medicine Name & Strength (e.g., Tab. Pantoprazole 40mg):");
  if (!name || name.trim().length < 3) {
    alert("Invalid Name: Medicine name must be at least 3 characters long.");
    return;
  }

  const priceStr = prompt("Enter Unit Rate / Price (INR):", "8.50");
  const price = parseFloat(priceStr ? priceStr.trim() : '');
  if (isNaN(price) || price < 0.50 || price > 10000.00) {
    alert("Invalid Unit Price: Must be between ₹0.50 and ₹10,000.00.");
    return;
  }

  const stockStr = prompt("Enter Initial Stock Quantity:", "100");
  const stock = parseInt(stockStr ? stockStr.trim() : '', 10);
  if (isNaN(stock) || stock < 0 || stock > 50000) {
    alert("Invalid Quantity: Must be between 0 and 50,000 units.");
    return;
  }

  const code = `MED-${String(inventory.length + 1).padStart(2, '0')}`;
  inventory.push({ code, name: name.trim(), price, stock });

  savePharmData();
  renderRatesTable();
  renderInventoryTable();
  renderPrescriptionsTable();
  alert(`Added ${name.trim()} at ₹${price.toFixed(2)} with ${stock} units to dispensary stock.`);
}

window.addEventListener('DOMContentLoaded', initPharmPortal);

