
const STORAGE_KEY = "pharmacyMedicines";

// Get medicines from Local Storage
function getMedicines() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Save medicines to Local Storage
function saveMedicines(medicines) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
}

// Get today's date
function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Check medicine status
function getMedicineStatus(medicine) {

    if (medicine.expiryDate < getToday()) {
        return "Expired";
    }

    if (medicine.quantity === 0) {
        return "Out of Stock";
    }

    return "Available";
}

// Format date
function formatDate(date) {

    if (!date) {
        return "-";
    }

    const parts = date.split("-");

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// Prevent user-entered text from being treated as HTML
function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, function(character) {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}

// Status badge
function getStatusBadge(status) {

    let className = "status-available";

    if (status === "Out of Stock") {
        className = "status-out";
    } else if (status === "Expired") {
        className = "status-expired";
    }

    return `
        <span class="status-tag ${className}">
            ${status}
        </span>
    `;
}


// ====================================
// DASHBOARD
// ====================================

function loadDashboard() {

    const medicines = getMedicines();

    // Total medicines
    document.getElementById("totalMedicines").textContent =
        medicines.length;

    // Total quantity of non-expired medicines
    const totalQuantity = medicines.reduce(function(total, medicine) {

        if (getMedicineStatus(medicine) === "Expired") {
            return total;
        }

        return total + Number(medicine.quantity);

    }, 0);

    document.getElementById("totalQuantity").textContent =
        totalQuantity;

    // Out of stock count
    const outOfStockMedicines = medicines.filter(function(medicine) {
        return getMedicineStatus(medicine) === "Out of Stock";
    });

    document.getElementById("outOfStock").textContent =
        outOfStockMedicines.length;

    // Expired medicine count
    const expiredMedicines = medicines.filter(function(medicine) {
        return getMedicineStatus(medicine) === "Expired";
    });

    document.getElementById("expiredMedicines").textContent =
        expiredMedicines.length;


    // Out of Stock Table
    const outOfStockTable = document.getElementById("outOfStockTable");

    if (outOfStockMedicines.length === 0) {

        outOfStockTable.innerHTML = `
            <tr>
                <td colspan="4">No out of stock medicines.</td>
            </tr>
        `;

    } else {

        outOfStockTable.innerHTML = outOfStockMedicines.map(function(medicine) {

            return `
                <tr>
                    <td>${escapeHTML(medicine.name)}</td>
                    <td>${escapeHTML(medicine.strength)}</td>
                    <td>${medicine.quantity}</td>
                    <td>${getStatusBadge(getMedicineStatus(medicine))}</td>
                </tr>
            `;

        }).join("");
    }


    // Recently Added Medicines
    const recentMedicinesTable =
        document.getElementById("recentMedicinesTable");

    const recentMedicines = [...medicines]
        .sort(function(a, b) {
            return b.addedAt - a.addedAt;
        })
        .slice(0, 5);

    if (recentMedicines.length === 0) {

        recentMedicinesTable.innerHTML = `
            <tr>
                <td colspan="5">No medicines added yet.</td>
            </tr>
        `;

    } else {

        recentMedicinesTable.innerHTML = recentMedicines.map(function(medicine) {

            return `
                <tr>
                    <td>${escapeHTML(medicine.name)}</td>
                    <td>${escapeHTML(medicine.category)}</td>
                    <td>${escapeHTML(medicine.strength)}</td>
                    <td>${medicine.quantity}</td>
                    <td>${formatDate(medicine.expiryDate)}</td>
                </tr>
            `;

        }).join("");
    }
}


// ====================================
// MEDICINE MANAGEMENT
// ====================================

function loadMedicinePage() {

    const medicineForm = document.getElementById("medicineForm");

    const medicineTable = document.getElementById("medicineTable");

    const searchMedicine = document.getElementById("searchMedicine");

    const statusFilter = document.getElementById("statusFilter");

    const cancelBtn = document.getElementById("cancelBtn");

    const submitBtn = document.getElementById("submitBtn");

    let editingId = null;


    // Display Medicines
    function displayMedicines() {

        const medicines = getMedicines();

        const searchText = searchMedicine.value.toLowerCase().trim();

        const selectedStatus = statusFilter.value;

        const filteredMedicines = medicines.filter(function(medicine) {

            const matchesSearch =
                medicine.name.toLowerCase().includes(searchText) ||
                medicine.batchNumber.toLowerCase().includes(searchText);

            const matchesStatus =
                selectedStatus === "All" ||
                getMedicineStatus(medicine) === selectedStatus;

            return matchesSearch && matchesStatus;
        });

        document.getElementById("medicineCount").textContent =
            `${filteredMedicines.length} medicines`;

        if (filteredMedicines.length === 0) {

            medicineTable.innerHTML = `
                <tr>
                    <td colspan="9">No medicines found.</td>
                </tr>
            `;

            return;
        }

        medicineTable.innerHTML = filteredMedicines.map(function(medicine) {

            const status = getMedicineStatus(medicine);

            return `
                <tr>
                    <td>${escapeHTML(medicine.name)}</td>
                    <td>${escapeHTML(medicine.category)}</td>
                    <td>${escapeHTML(medicine.strength)}</td>
                    <td>${escapeHTML(medicine.batchNumber)}</td>
                    <td>${formatDate(medicine.expiryDate)}</td>
                    <td>₹${Number(medicine.price).toFixed(2)}</td>
                    <td>${medicine.quantity}</td>
                    <td>${getStatusBadge(status)}</td>

                    <td>
                        <button class="btn-action-edit"
                            data-action="edit"
                            data-id="${escapeHTML(medicine.id)}">
                            Edit
                        </button>

                        <button class="btn-action-del"
                            data-action="delete"
                            data-id="${escapeHTML(medicine.id)}">
                            Delete
                        </button>
                    </td>
                </tr>
            `;

        }).join("");
    }


    // Add or Update Medicine
    medicineForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const medicines = getMedicines();

        const existingMedicine = medicines.find(function(item) {
            return item.id === editingId;
        });

        const medicine = {

            id: editingId || (
                window.crypto && crypto.randomUUID
                    ? crypto.randomUUID()
                    : String(Date.now())
            ),

            name: document.getElementById("medicineName").value.trim(),

            category: document.getElementById("category").value,

            strength: document.getElementById("strength").value.trim(),

            batchNumber: document.getElementById("batchNumber").value.trim(),

            expiryDate: document.getElementById("expiryDate").value,

            price: Number(document.getElementById("price").value),

            // The ONLY quantity field
            quantity: Number(document.getElementById("quantity").value),

            addedAt: existingMedicine
                ? existingMedicine.addedAt
                : Date.now()
        };


        // Validate values
        if (
            !medicine.name ||
            !medicine.strength ||
            !medicine.batchNumber ||
            !medicine.expiryDate ||
            !Number.isFinite(medicine.price) ||
            medicine.price <= 0 ||
            !Number.isInteger(medicine.quantity) ||
            medicine.quantity < 0
        ) {

            alert("Please enter valid medicine details.");

            return;
        }


        // Prevent duplicate medicine with same name, strength and batch
        const duplicate = medicines.find(function(item) {

            return (
                item.id !== editingId &&
                item.name.toLowerCase() === medicine.name.toLowerCase() &&
                item.strength.toLowerCase() === medicine.strength.toLowerCase() &&
                item.batchNumber.toLowerCase() === medicine.batchNumber.toLowerCase()
            );

        });

        if (duplicate) {

            alert("This medicine with the same strength and batch number already exists.");

            return;
        }


        // Update Medicine
        if (editingId) {

            const index = medicines.findIndex(function(item) {
                return item.id === editingId;
            });

            if (index !== -1) {
                medicines[index] = medicine;
            }

            alert("Medicine updated successfully!");

        }

        // Add Medicine
        else {

            medicines.push(medicine);

            alert("Medicine added successfully!");
        }


        saveMedicines(medicines);

        medicineForm.reset();

        editingId = null;

        document.getElementById("formTitle").textContent =
            "Add New Medicine";

        submitBtn.textContent = "Add Medicine";

        cancelBtn.hidden = true;

        displayMedicines();
    });


    // Edit and Delete Buttons
    medicineTable.addEventListener("click", function(event) {

        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const id = button.dataset.id;

        const action = button.dataset.action;

        const medicines = getMedicines();

        const medicine = medicines.find(function(item) {
            return item.id === id;
        });

        if (!medicine) {
            return;
        }


        // Edit Medicine
        if (action === "edit") {

            editingId = id;

            document.getElementById("medicineName").value =
                medicine.name;

            document.getElementById("category").value =
                medicine.category;

            document.getElementById("strength").value =
                medicine.strength;

            document.getElementById("batchNumber").value =
                medicine.batchNumber;

            document.getElementById("expiryDate").value =
                medicine.expiryDate;

            document.getElementById("price").value =
                medicine.price;

            document.getElementById("quantity").value =
                medicine.quantity;

            document.getElementById("formTitle").textContent =
                "Edit Medicine";

            submitBtn.textContent = "Update Medicine";

            cancelBtn.hidden = false;

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }


        // Delete Medicine
        if (action === "delete") {

            const confirmDelete = confirm(
                "Are you sure you want to delete this medicine?"
            );

            if (confirmDelete) {

                const updatedMedicines = medicines.filter(function(item) {
                    return item.id !== id;
                });

                saveMedicines(updatedMedicines);

                if (editingId === id) {
                    medicineForm.reset();

                    editingId = null;

                    document.getElementById("formTitle").textContent =
                        "Add New Medicine";

                    submitBtn.textContent = "Add Medicine";

                    cancelBtn.hidden = true;
                }

                alert("Medicine deleted successfully!");

                displayMedicines();
            }
        }

    });


    // Cancel Editing
    cancelBtn.addEventListener("click", function() {

        medicineForm.reset();

        editingId = null;

        document.getElementById("formTitle").textContent =
            "Add New Medicine";

        submitBtn.textContent = "Add Medicine";

        cancelBtn.hidden = true;
    });


    // Search Medicine
    searchMedicine.addEventListener("input", displayMedicines);


    // Filter Medicine
    statusFilter.addEventListener("change", displayMedicines);


    // Initial Display
    displayMedicines();
}


// ====================================
// CHECK WHICH PAGE IS OPEN
// ====================================

document.addEventListener("DOMContentLoaded", function() {

    const currentPage = document.body.dataset.page;

    if (currentPage === "dashboard") {
        loadDashboard();
    }

    if (currentPage === "medicines") {
        loadMedicinePage();
    }

});
