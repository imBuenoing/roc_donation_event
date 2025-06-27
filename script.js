document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    // Hardcoded quantities for each donation tier
    const itemData = {
        'Item A': { quantities: [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26] },
        'Item B': { quantities: [180, 240, 300, 360, 420, 480, 520, 300, 360, 420, 480] },
        'Item C': { quantities: [600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600] },
        'Item D': { quantities: [600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600] }
    };

    // --- DOM ELEMENTS ---
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSummaryEl = document.getElementById('result-summary');
    const resultTableBodyEl = document.querySelector('#result-table tbody');
    
    // --- EVENT LISTENER ---
    calculateBtn.addEventListener('click', calculateAndDisplayPattern);

    // --- CORE LOGIC ---
    function calculateAndDisplayPattern() {
        // 1. Get user inputs
        const costs = {
            'Item A': parseFloat(document.getElementById('costA').value) || 0,
            'Item B': parseFloat(document.getElementById('costB').value) || 0,
            'Item C': parseFloat(document.getElementById('costC').value) || 0,
            'Item D': parseFloat(document.getElementById('costD').value) || 0
        };
        const includeD = document.getElementById('includeD').checked;

        // 2. Prepare the list of items to consider
        let availableItems = Object.keys(itemData);
        if (!includeD) {
            availableItems = availableItems.filter(item => item !== 'Item D');
        }

        // 3. Initialize variables for the calculation loop
        let totalCost = 0;
        const donationCounts = { 'Item A': 0, 'Item B': 0, 'Item C': 0, 'Item D': 0 };
        const results = [];
        const TOTAL_TRIES = 10;

        // 4. Main calculation loop (Greedy Algorithm)
        for (let i = 1; i <= TOTAL_TRIES; i++) {
            let cheapestOption = { name: null, cost: Infinity };

            // Find the cheapest donation for the current try
            availableItems.forEach(itemName => {
                const count = donationCounts[itemName];
                const quantity = itemData[itemName].quantities[count];
                const cost = quantity * costs[itemName];

                if (cost < cheapestOption.cost) {
                    cheapestOption = { name: itemName, cost: cost };
                }
            });

            // If a valid option was found, record it
            if (cheapestOption.name) {
                totalCost += cheapestOption.cost;
                donationCounts[cheapestOption.name]++;
                results.push({
                    tryNumber: i,
                    item: cheapestOption.name,
                    cost: cheapestOption.cost
                });
            }
        }
        
        // 5. Display the results
        displayResults(results, totalCost);
    }

    function displayResults(results, totalCost) {
        // Clear previous results
        resultTableBodyEl.innerHTML = '';

        if (results.length === 0) {
            resultSummaryEl.textContent = 'Could not calculate a pattern. Check costs.';
            return;
        }

        // Update summary
        const formattedTotalCost = totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        resultSummaryEl.innerHTML = `Total Minimum Cost: <span style="color: #28a745;">${formattedTotalCost.replace('$', '')}</span>`;

        // Populate table
        results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.tryNumber}</td>
                <td>${result.item}</td>
                <td>${result.cost.toLocaleString('en-US')}</td>
            `;
            resultTableBodyEl.appendChild(row);
        });
    }
});
