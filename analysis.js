// We declare this outside the function so we can delete the old chart
// whenever we click the button again.
let myChart = null;

function calculateWealth() {
    // 1. Get Inputs
    let balance = Number(document.getElementById("initial").value);
    let monthlyDeposit = Number(document.getElementById("deposit").value);
    let rate = Number(document.getElementById("rate").value) / 100;
    let years = Number(document.getElementById("years").value);
    let inflation = Number(document.getElementById("inflation").value) / 100;

    // 2. Prepare Lists (Arrays) for the Chart
    let labels = [];       // e.g., ["Year 1", "Year 2"...]
    let bankData = [];     // The Nominal Balance history
    let realData = [];     // The Inflation-Adjusted history

    let annualDeposit = monthlyDeposit * 12;

    // 3. The Loop (Calculates and SAVES data every year)
    for (let t = 1; t <= years; t++) {
        // Compound Interest
        balance = balance * (1 + rate);
        balance = balance + annualDeposit;

        // Calculate Real Value for this specific year
        let realValue = balance / Math.pow(1 + inflation, t);

        // Save data to our lists
        labels.push("Year " + t);
        bankData.push(balance.toFixed(2));
        realData.push(realValue.toFixed(2));
    }

    // 4. Output Text Result (Final Year)
    let finalBank = bankData[bankData.length - 1];
    let finalReal = realData[realData.length - 1];
    
    document.getElementById("result").innerText = 
        "Bank: $" + Number(finalBank).toLocaleString() + "\n" +
        "Real Value: $" + Number(finalReal).toLocaleString();

    // 5. Draw the Chart
    renderChart(labels, bankData, realData);
}

// --- The Chart Drawing Function ---
function renderChart(labels, bankData, realData) {
    const ctx = document.getElementById('myChart').getContext('2d');

    // If a chart already exists, destroy it so we don't draw on top of it
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // The years
            datasets: [
                {
                    label: 'Bank Balance',
                    data: bankData,
                    borderColor: '#00e676', // Green
                    backgroundColor: 'rgba(0, 230, 118, 0.2)',
                    fill: true,
                    tension: 0.4 // Makes the line curvy
                },
                {
                    label: 'Real Value (Purchasing Power)',
                    data: realData,
                    borderColor: '#ff9100', // Orange
                    backgroundColor: 'rgba(255, 145, 0, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' } // Dark mode text
                }
            },
            scales: {
                x: { ticks: { color: 'white' } },
                y: { ticks: { color: 'white' } }
            }
        }
    });
}