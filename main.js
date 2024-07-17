let customers = [];
let transactions = [];
let sortOrder = 'asc'; // default sort order is ascending

function loadCustomerData() {
    fetch('customer.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            customers = data.customers;
            transactions = data.transactions;
            displayCustomerData();
        })
        .catch(function (error) {
            console.error('Error loading data:', error);
        });
}

function sortCustomersByName() {
    customers.sort((a, b) => a.name.localeCompare(b.name));
}

function sortTransactionsByAmount() {
    transactions.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.amount - b.amount;
        } else {
            return b.amount - a.amount;
        }
    });
    displayCustomerData();
}

function displayCustomerData() {
    const customerTableBody = document.getElementById('customer-table-body');
    customerTableBody.innerHTML = '';

    customers.forEach(function (customer) {
        const customerTransactions = transactions.filter(function (transaction) {
            return transaction.customer_id === customer.id;
        });

        const row = document.createElement('tr');

        const idCell = document.createElement('th');
        idCell.scope = 'row';
        idCell.textContent = customer.id;

        const nameCell = document.createElement('td');
        nameCell.textContent = customer.name;

        const transactionsCell = document.createElement('td');

        const transactionsTable = document.createElement('table');
        transactionsTable.className = 'table table-striped';

        const transactionsTableBody = document.createElement('tbody');

        customerTransactions.forEach(function (transaction) {
            const transactionRow = document.createElement('tr');

            const amountCell = document.createElement('td');
            amountCell.textContent = transaction.amount;

            const dateCell = document.createElement('td');
            dateCell.textContent = transaction.date;

            transactionRow.appendChild(amountCell);
            transactionRow.appendChild(dateCell);

            transactionsTableBody.appendChild(transactionRow);
        });

        transactionsTable.appendChild(transactionsTableBody);
        transactionsCell.appendChild(transactionsTable);

        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(transactionsCell);

        customerTableBody.appendChild(row);
    });
}

document.getElementById('sort-button').addEventListener('click', function () {
    sortCustomersByName();
    displayCustomerData();
});

document.getElementById('amount-button').addEventListener('click', function () {
    if (sortOrder === 'asc') {
        sortOrder = 'desc';
    } else {
        sortOrder = 'asc';
    }
    sortTransactionsByAmount();
});

loadCustomerData();