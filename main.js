let customers = [];
let transactions = [];
let sortOrder = 'asc'; 
let barchart; 
let doughnut; 

function loadCustomerData() {
    fetch('customer.json')
        .then(response => response.json())
        .then(data => {
            customers = data.customers;
            transactions = data.transactions;
            displayCustomerData();
            prepareChartData();
        })
        .catch(error => console.error('Error loading data:', error));
}

function prepareChartData() {
    // Calculate total salary for each customer
    const customerSalaries = customers.map(customer => {
        const totalSalary = transactions
            .filter(transaction => transaction.customer_id === customer.id)
            .reduce((sum, transaction) => sum + transaction.amount, 0);
        return { name: customer.name, totalSalary: totalSalary };
    });

    const labels = customerSalaries.map(cs => cs.name);
    const data = customerSalaries.map(cs => cs.totalSalary);

    // Generate colors for each segment
    const backgroundColors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ];
    const borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];

    // Create or update the bar chart
    const ctxBar = document.getElementById('barchart').getContext('2d');
    if (barchart) {
        barchart.data.labels = labels;
        barchart.data.datasets[0].data = data;
        barchart.data.datasets[0].backgroundColor = backgroundColors.slice(0, labels.length);
        barchart.data.datasets[0].borderColor = borderColors.slice(0, labels.length);
        barchart.update();
    } else {
        barchart = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Salary Amount',
                    data: data,
                    borderWidth: 1,
                    backgroundColor: backgroundColors.slice(0, labels.length),
                    borderColor: borderColors.slice(0, labels.length)
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.raw;
                                label += ` (${context.label})`; // Add customer name to tooltip
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Create or update the doughnut chart
    const ctxDoughnut = document.getElementById('doughnut').getContext('2d');
    if (doughnut) {
        doughnut.data.labels = labels;
        doughnut.data.datasets[0].data = data;
        doughnut.data.datasets[0].backgroundColor = backgroundColors.slice(0, labels.length);
        doughnut.data.datasets[0].borderColor = borderColors.slice(0, labels.length);
        doughnut.update();
    } else {
        doughnut = new Chart(ctxDoughnut, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Salary Amount',
                    data: data,
                    borderWidth: 1,
                    backgroundColor: backgroundColors.slice(0, labels.length),
                    borderColor: borderColors.slice(0, labels.length)
                }]
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.raw;
                                label += ` (${context.label})`; // Add customer name to tooltip
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
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

function sortCustomersByName() {
    customers.sort((a, b) => a.name.localeCompare(b.name));
    displayCustomerData();
    prepareChartData();
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
    prepareChartData();
}

document.getElementById('sort-button').addEventListener('click', function () {
    sortCustomersByName();
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
