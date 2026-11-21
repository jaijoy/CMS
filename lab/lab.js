
/* =====================================
   LOCAL STORAGE FUNCTIONS
===================================== */

const TEST_KEY = "labTests";
const ORDER_KEY = "labOrders";


function getTests() {

    return JSON.parse(localStorage.getItem(TEST_KEY)) || [];

}


function saveTests(tests) {

    localStorage.setItem(TEST_KEY, JSON.stringify(tests));

}


function getOrders() {

    return JSON.parse(localStorage.getItem(ORDER_KEY)) || [];

}


function saveOrders(orders) {

    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));

}


/* =====================================
   MANAGE TESTS PAGE
===================================== */

const testForm = document.getElementById("testForm");

if (testForm) {

    const testName = document.getElementById("testName");

    const normalRange = document.getElementById("normalRange");

    const testPrice = document.getElementById("testPrice");

    const editTestId = document.getElementById("editTestId");

    const testsTable = document.getElementById("testsTable");

    const noTests = document.getElementById("noTests");

    const submitButton = document.getElementById("submitButton");

    const cancelEdit = document.getElementById("cancelEdit");

    const formHeading = document.getElementById("formHeading");

    const searchTest = document.getElementById("searchTest");


    // Display Tests

    function displayTests(searchValue = "") {

        const tests = getTests();

        testsTable.innerHTML = "";

        const filteredTests = tests.filter(function(test) {

            return test.name.toLowerCase().includes(
                searchValue.toLowerCase()
            );

        });


        noTests.style.display =
            filteredTests.length === 0 ? "block" : "none";


        filteredTests.forEach(function(test) {

            const row = document.createElement("tr");


            // Test ID

            const idCell = document.createElement("td");

            idCell.textContent = test.id;


            // Test Name

            const nameCell = document.createElement("td");

            nameCell.textContent = test.name;


            // Normal Range

            const rangeCell = document.createElement("td");

            rangeCell.textContent = test.normalRange;


            // Price

            const priceCell = document.createElement("td");

            priceCell.textContent = "₹" + test.price;


            // Actions

            const actionCell = document.createElement("td");


            const editButton = document.createElement("button");

            editButton.textContent = "Edit";

            editButton.className = "btn-action-edit";

            editButton.addEventListener("click", function() {

                editTest(test.id);

            });


            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";

            deleteButton.className = "btn-action-del";

            deleteButton.addEventListener("click", function() {

                deleteTest(test.id);

            });


            actionCell.appendChild(editButton);

            actionCell.appendChild(deleteButton);


            row.appendChild(idCell);

            row.appendChild(nameCell);

            row.appendChild(rangeCell);

            row.appendChild(priceCell);

            row.appendChild(actionCell);


            testsTable.appendChild(row);

        });

    }


    // Add or Update Test

    testForm.addEventListener("submit", function(event) {

        event.preventDefault();


        let tests = getTests();


        const name = testName.value.trim();

        const range = normalRange.value.trim();

        const price = Number(testPrice.value);

        const currentId = editTestId.value;


        if (!name || !range || testPrice.value === "" ||
            !Number.isFinite(price) || price < 0) {

            alert("Please enter valid test details.");

            return;

        }


        // Duplicate Check

        const duplicate = tests.some(function(test) {

            return test.name.toLowerCase() === name.toLowerCase()
                && test.id !== currentId;

        });


        if (duplicate) {

            alert("This test already exists!");

            return;

        }


        if (currentId) {

            // Update Existing Test

            const index = tests.findIndex(function(test) {

                return test.id === currentId;

            });


            if (index !== -1) {

                tests[index].name = name;

                tests[index].normalRange = range;

                tests[index].price = price;

            }

            alert("Test updated successfully!");

        } else {

            // Create New Test

            const newTest = {

                id: "LAB-" + Date.now(),

                name: name,

                normalRange: range,

                price: price

            };


            tests.push(newTest);

            alert("Test added successfully!");

        }


        saveTests(tests);


        resetTestForm();

        displayTests(searchTest.value);

    });


    // Edit Test

    function editTest(id) {

        const tests = getTests();

        const test = tests.find(function(item) {

            return item.id === id;

        });


        if (!test) return;


        testName.value = test.name;

        normalRange.value = test.normalRange;

        testPrice.value = test.price;

        editTestId.value = test.id;


        submitButton.textContent = "Update Test";

        formHeading.textContent = "Edit Laboratory Test";

        cancelEdit.hidden = false;


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    // Delete Test

    function deleteTest(id) {

        const confirmDelete = confirm(
            "Are you sure you want to delete this test?"
        );


        if (!confirmDelete) return;


        let tests = getTests();


        tests = tests.filter(function(test) {

            return test.id !== id;

        });


        saveTests(tests);


        displayTests(searchTest.value);

        alert("Test deleted successfully!");

    }


    // Reset Form

    function resetTestForm() {

        testForm.reset();

        editTestId.value = "";

        submitButton.textContent = "Add Test";

        formHeading.textContent = "Add New Test";

        cancelEdit.hidden = true;

    }


    // Cancel Edit

    cancelEdit.addEventListener("click", function() {

        resetTestForm();

    });


    // Search Tests

    searchTest.addEventListener("input", function() {

        displayTests(searchTest.value);

    });


    displayTests();

}


/* =====================================
   LAB DASHBOARD
===================================== */

let currentFilter = "All";

let currentSearch = "";


function loadDashboard() {

    const orders = getOrders();

    const ordersTable = document.getElementById("ordersTable");

    if (!ordersTable) return;


    ordersTable.innerHTML = "";


    let total = 0;

    let pending = 0;

    let collected = 0;

    let completed = 0;


    orders.forEach(function(order) {

        if (!Array.isArray(order.tests)) return;


        order.tests.forEach(function(test) {

            total++;


            const status = test.status || "Pending";


            if (status === "Pending") {

                pending++;

            } else if (status === "Collected") {

                collected++;

            } else if (status === "Completed") {

                completed++;

            }

        });

    });


    document.getElementById("totalTests").textContent = total;

    document.getElementById("pendingSamples").textContent = pending;

    document.getElementById("collectedSamples").textContent = collected;

    document.getElementById("completedTests").textContent = completed;


    // Display Filtered Orders

    displayOrders();

}


/* =====================================
   DISPLAY LAB ORDERS
===================================== */

function displayOrders() {

    const orders = getOrders();

    const ordersTable = document.getElementById("ordersTable");

    if (!ordersTable) return;


    ordersTable.innerHTML = "";


    let displayedCount = 0;


    orders.forEach(function(order, orderIndex) {

        if (!Array.isArray(order.tests)) return;


        order.tests.forEach(function(test, testIndex) {


            const status = test.status || "Pending";


            // Status Filter

            if (currentFilter !== "All" &&
                status !== currentFilter) {

                return;

            }


            // Search Filter

            const searchText = [

                order.patientName,

                order.mmr,

                order.mmrNumber,

                order.doctorName,

                test.testName

            ].join(" ").toLowerCase();


            if (!searchText.includes(currentSearch.toLowerCase())) {

                return;

            }


            displayedCount++;


            const row = document.createElement("tr");


            // Order ID

            const orderCell = document.createElement("td");

            orderCell.textContent =
                order.orderId || order.appointmentId || "N/A";


            // Patient Name

            const patientCell = document.createElement("td");

            patientCell.textContent = order.patientName || "N/A";


            // MMR

            const mmrCell = document.createElement("td");

            mmrCell.textContent =
                order.mmr || order.mmrNumber || "N/A";


            // Doctor

            const doctorCell = document.createElement("td");

            doctorCell.textContent = order.doctorName || "N/A";


            // Test Name

            const testCell = document.createElement("td");

            testCell.textContent = test.testName || "N/A";


            // Price

            const priceCell = document.createElement("td");

            priceCell.textContent =
                "₹" + (test.price ?? "N/A");


            // Status

            const statusCell = document.createElement("td");

            const statusBadge = document.createElement("span");


            statusBadge.className = "status-tag " +
                (status === "Pending" ? "status-pending" :
                status === "Collected" ? "status-collected" :
                "status-completed");


            statusBadge.textContent = status;

            statusCell.appendChild(statusBadge);


            // Action

            const actionCell = document.createElement("td");


            if (status === "Pending") {

                const collectButton = document.createElement("button");

                collectButton.textContent = "Collect Sample";

                collectButton.className = "btn-action-collect";


                collectButton.addEventListener("click", function() {

                    collectSample(orderIndex, testIndex);

                });


                actionCell.appendChild(collectButton);

            } else if (status === "Collected") {

                const resultButton = document.createElement("button");

                resultButton.textContent = "Add Result";

                resultButton.className = "btn-action-result";


                resultButton.addEventListener("click", function() {

                    openResultModal(orderIndex, testIndex);

                });


                actionCell.appendChild(resultButton);

            } else {

                const viewButton = document.createElement("button");

                viewButton.textContent = "View Result";

                viewButton.className = "btn-action-edit";


                viewButton.addEventListener("click", function() {

                    viewResult(orderIndex, testIndex);

                });


                actionCell.appendChild(viewButton);

            }


            row.appendChild(orderCell);

            row.appendChild(patientCell);

            row.appendChild(mmrCell);

            row.appendChild(doctorCell);

            row.appendChild(testCell);

            row.appendChild(priceCell);

            row.appendChild(statusCell);

            row.appendChild(actionCell);


            ordersTable.appendChild(row);


        });

    });


    document.getElementById("noOrders").style.display =
        displayedCount === 0 ? "block" : "none";

}


/* =====================================
   COLLECT SAMPLE
===================================== */

function collectSample(orderIndex, testIndex) {

    const orders = getOrders();

    const test = orders[orderIndex].tests[testIndex];


    const confirmation = confirm(
        "Confirm sample collection for " + test.testName + "?"
    );


    if (!confirmation) return;


    test.status = "Collected";

    test.sampleCollected = true;

    test.sampleCollectedAt = new Date().toLocaleString();


    saveOrders(orders);


    alert("Sample collected successfully!");


    loadDashboard();

}


/* =====================================
   RESULT ENTRY MODAL
===================================== */

let selectedOrderIndex = null;

let selectedTestIndex = null;


function openResultModal(orderIndex, testIndex) {

    const orders = getOrders();

    const test = orders[orderIndex].tests[testIndex];


    selectedOrderIndex = orderIndex;

    selectedTestIndex = testIndex;


    document.getElementById("resultTestName").textContent =
        "Test: " + test.testName;


    document.getElementById("resultForm").reset();


    document.getElementById("resultModal").classList.add("show");

}


function closeResultModal() {

    document.getElementById("resultModal").classList.remove("show");

    selectedOrderIndex = null;

    selectedTestIndex = null;

}


const resultForm = document.getElementById("resultForm");


if (resultForm) {

    resultForm.addEventListener("submit", function(event) {

        event.preventDefault();


        if (selectedOrderIndex === null ||
            selectedTestIndex === null) {

            return;

        }


        const orders = getOrders();


        const test =
            orders[selectedOrderIndex].tests[selectedTestIndex];


        const result = document.getElementById("resultValue").value.trim();

        const remarks = document.getElementById("resultRemarks").value.trim();


        if (!result) {

            alert("Please enter the test result.");

            return;

        }


        test.result = result;

        test.remarks = remarks;

        test.status = "Completed";

        test.completedAt = new Date().toLocaleString();


        saveOrders(orders);


        closeResultModal();


        alert("Test result saved successfully!");


        loadDashboard();

    });


    document.getElementById("closeResultModal").addEventListener(
        "click",
        closeResultModal
    );

}


/* =====================================
   VIEW RESULT
===================================== */

function viewResult(orderIndex, testIndex) {

    const orders = getOrders();

    const test = orders[orderIndex].tests[testIndex];


    alert(

        "TEST: " + test.testName +

        "\nRESULT: " + (test.result || "N/A") +

        "\nNORMAL RANGE: " + (test.normalRange || "N/A") +

        "\nREMARKS: " + (test.remarks || "None") +

        "\nCOMPLETED AT: " + (test.completedAt || "N/A")

    );

}


/* =====================================
   FILTER BUTTONS
===================================== */

const filterButtons = document.querySelectorAll(".filter-group .pill");


filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(item) {

            item.classList.remove("active");

        });


        button.classList.add("active");


        currentFilter = button.dataset.filter;


        displayOrders();

    });

});


/* =====================================
   SEARCH ORDERS
===================================== */

const searchOrder = document.getElementById("searchOrder");


if (searchOrder) {

    searchOrder.addEventListener("input", function() {

        currentSearch = searchOrder.value;

        displayOrders();

    });

}


/* =====================================
   INITIALIZE DASHBOARD
===================================== */

if (document.body.dataset.page === "dashboard") {

    loadDashboard();

}
