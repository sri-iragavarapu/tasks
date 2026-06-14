let allExpenses = [];

// Fetch JSON data
fetch("expenses.json")
.then((response) => response.json())
.then((data) => {
    allExpenses = data;

    displayExpenses(allExpenses);
    updateSummary();
})
.catch((error) => {
    console.log("Error loading JSON:", error);
});


// DISPLAY TABLE
function displayExpenses(expenseList) {
    const tableBody = document.getElementById("expenseTableBody");
    tableBody.innerHTML = "";

    expenseList.forEach((expense) => {
        const row = `
        <tr>
            <td>${expense.title}</td>
            <td>${expense.category}</td>
            <td>${expense.amount}</td>
            <td>
                <button class="deletebtn"
                onclick="deleteExpense(${expense.id})">
                Delete
                </button>
            </td>
        </tr>
        `;

        tableBody.innerHTML += row;
    });
}


// UPDATE SUMMARY
function updateSummary() {

    const totalExpense = allExpenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );

    const highestExpense = allExpenses.reduce(
        (max, expense) =>
            expense.amount > max ? expense.amount : max,
        0
    );

    document.getElementById("totalExpense").innerText =
        `₹ ${totalExpense}`;

    document.getElementById("totalTransactions").innerText =
        allExpenses.length;

    document.getElementById("highestExpense").innerText =
        `₹ ${highestExpense}`;
}


// ADD EXPENSE
document.getElementById("addBtn")
.addEventListener("click", addExpense);

function addExpense() {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const amount = Number(
        document.getElementById("amount").value
    );

    if (!title || amount <= 0) {
        alert("Please fill all fields");
        return;
    }

    const newExpense = {
        id: Date.now(),
        title,
        category,
        amount
    };

    allExpenses.push(newExpense);

    displayExpenses(allExpenses);
    updateSummary();

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
}


// FILTER
document.getElementById("filterCategory")
.addEventListener("change", filterExpenses);

function filterExpenses() {
    const selectedCategory =
        document.getElementById("filterCategory").value;

    if (selectedCategory === "All") {
        displayExpenses(allExpenses);
    } else {
        const filtered = allExpenses.filter(
            (expense) =>
                expense.category === selectedCategory
        );

        displayExpenses(filtered);
    }
}


// DELETE
function deleteExpense(id) {
    allExpenses = allExpenses.filter(
        (expense) => expense.id !== id
    );

    displayExpenses(allExpenses);
    updateSummary();
}