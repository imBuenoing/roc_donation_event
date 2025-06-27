document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const itemData = {
        'Item A': { quantities: [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26] },
        'Item B': { quantities: [180, 240, 300, 360, 420, 480, 520, 300, 360, 420, 480] },
        'Item C': { quantities: [600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600] },
        'Item D': { quantities: [600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600] }
    };

    // --- DOM ELEMENTS ---
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSummaryEl = document.getElementById('result-summary');
    const donationCountsEl = document.getElementById('donation-counts-summary');
    const resultTableBodyEl = document.querySelector('#result-table tbody');
    const totalQuantitySummaryEl = document.getElementById('total-quantity-summary'); // Get the new container
    const totalQuantityTextEl = document.getElementById('total-quantity-text'); // Get the new text element

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

        // 3. Initialize variables
        let totalCost = 0;
        const donationCounts = { 'Item A': 0, 'Item B': 0, 'Item C': 0, 'Item D': 0 };
        const totalQuantities = { 'Item A': 0, 'Item B': 0, 'Item C': 0, 'Item D': 0 }; // NEW: Track total quantities
        const results = [];
        const TOTAL_TRIES = 10;

        // 4. Main calculation loop
        for (let i = 1; i <= TOTAL_TRIES; i++) {
            let cheapestOption = { name: null, cost: Infinity, quantity: 0 };

            availableItems.forEach(itemName => {
                const count = donationCounts[itemName];
                const quantity = itemData[itemName].quantities[count];
                const cost = quantity * costs[itemName];

                if (cost < cheapestOption.cost) {
                    cheapestOption = { name: itemName, cost: cost, quantity: quantity };
                }
            });

            if (cheapestOption.name) {
                totalCost += cheapestOption.cost;
                donationCounts[cheapestOption.name]++;
                totalQuantities[cheapestOption.name] += cheapestOption.quantity; // NEW: Add to total quantity
                results.push({
                    tryNumber: i,
                    item: cheapestOption.name,
                    quantity: cheapestOption.quantity,
                    cost: cheapestOption.cost
                });
            }
        }
        
        // 5. Display the results
        displayResults(results, totalCost, donationCounts, totalQuantities); // Pass new data to display function
    }

    function displayResults(results, totalCost, donationCounts, totalQuantities) {
        // Clear previous results
        resultTableBodyEl.innerHTML = '';
        donationCountsEl.innerHTML = '';
        totalQuantityTextEl.innerHTML = '';
        totalQuantitySummaryEl.style.display = 'none'; // Hide summary by default

        if (results.length === 0) {
            resultSummaryEl.textContent = 'Could not calculate a pattern. Check costs.';
            return;
        }

        // Show the summary section now that we have results
        totalQuantitySummaryEl.style.display = 'block';

        // Update total cost summary
        const formattedTotalCost = totalCost.toLocaleString('en-US');
        resultSummaryEl.innerHTML = `Total Minimum Cost: <span style="color: #28a745;">${formattedTotalCost}</span>`;

        // Update donation counts summary (number of times)
        const summaryParts = [];
        for (const [item, count] of Object.entries(donationCounts)) {
            if (count > 0) {
                const plural = count === 1 ? 'time' : 'times';
                summaryParts.push(`<strong>${item}</strong>: ${count} ${plural}`);
            }
        }
        donationCountsEl.innerHTML = summaryParts.join('   |   ');

        // Populate table
        results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.tryNumber}</td>
                <td>${result.item}</td>
                <td>${result.quantity.toLocaleString('en-US')}</td>
                <td>${result.cost.toLocaleString('en-US')}</td>
            `;
            resultTableBodyEl.appendChild(row);
        });

        // NEW: Populate the total quantities summary at the bottom
        const quantitySummaryParts = [];
        for (const [item, total] of Object.entries(totalQuantities)) {
            if (total > 0) {
                quantitySummaryParts.push(`<strong>${item}</strong>: ${total.toLocaleString('en-US')}`);
            }
        }
        totalQuantityTextEl.innerHTML = quantitySummaryParts.join('   |   ');
    }
});
