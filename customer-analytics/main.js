import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

let globalData = null;
let charts = {};

const clusterColors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'
];

const multivariateMeta = [
    { name: "Young Trendsetters", tag: "F - High Priority", analysis: "Younger female demographic with high spending scores. They are responsive to digital trends and frequent visitors." },
    { name: "Mature Matriarchs", tag: "F - Loyalists", analysis: "Established female shoppers with reliable moderate spending. They value customer service and brand legacy." },
    { name: "Steady Patriarchs", tag: "M - Loyalists", analysis: "Mature male segment with consistent, stable shopping habits. High focus on efficiency and goal-oriented shopping." },
    { name: "Strategic Conservers", tag: "Mixed - Passive", analysis: "Middle-aged group with low spending relative to income. Likely mission-driven shoppers who only visit for specific needs." },
    { name: "Active Gentlemen", tag: "M - High Priority", analysis: "Younger male demographic with high spending. Typically early adopters of tech and fashion." }
];

async function init() {
    const response = await fetch('/data.json');
    const data = await response.json();
    globalData = data;

    renderDistributions(data.customers);
    renderOptimizationPlot(data.optimization.bivariate, 'bivariate');

    // Initial render of segments
    updateSegments('bivariate');

    // Event listener for toggle
    const selector = document.getElementById('clusterMode');
    selector.addEventListener('change', (e) => {
        updateSegments(e.target.value);
        renderOptimizationPlot(globalData.optimization[e.target.value], e.target.value);
    });
}

function renderDistributions(customers) {
    new Chart(document.getElementById('ageDistributionChart'), {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Customers',
                data: customers.map(d => ({ x: d.Age, y: d['Spending Score'], r: 6 })),
                backgroundColor: 'rgba(59, 130, 246, 0.4)',
                borderColor: '#3b82f6',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Age', color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                y: { title: { display: true, text: 'Spending Score', color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    new Chart(document.getElementById('incomeSpendingChart'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Profiles',
                data: customers.map(d => ({ x: d['Annual Income (k$)'], y: d['Spending Score'] })),
                backgroundColor: 'rgba(139, 92, 246, 0.4)',
                borderColor: '#8b5cf6',
                borderWidth: 1,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Annual Income (k$)', color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                y: { title: { display: true, text: 'Spending Score', color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function renderOptimizationPlot(scores, mode) {
    if (charts.elbow) charts.elbow.destroy();

    charts.elbow = new Chart(document.getElementById('elbowChart'), {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            datasets: [{
                label: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Inertia`,
                data: scores,
                borderColor: mode === 'bivariate' ? '#3b82f6' : '#8b5cf6',
                backgroundColor: mode === 'bivariate' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Number of Clusters (K)', color: '#94a3b8' }, ticks: { color: '#94a3b8' } },
                y: { title: { display: true, text: 'Inertia (SSE)', color: '#94a3b8' }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

function updateSegments(mode) {
    const clusterKey = mode === 'bivariate' ? 'Bivariate Cluster' : 'Multivariate Cluster';
    const customers = globalData.customers;

    // Redraw Scatter Plot
    if (charts.segment) charts.segment.destroy();

    const datasets = Array.from({ length: 5 }, (_, i) => ({
        label: `Segment ${i}`,
        data: customers.filter(d => d[clusterKey] === i).map(d => ({
            x: d['Annual Income (k$)'],
            y: d['Spending Score']
        })),
        backgroundColor: clusterColors[i],
        pointRadius: 7,
        pointHoverRadius: 10
    }));

    charts.segment = new Chart(document.getElementById('clusterChart'), {
        type: 'scatter',
        data: { datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Annual Income (k$)', color: '#94a3b8' }, ticks: { color: '#94a3b8' } },
                y: { title: { display: true, text: 'Spending Score', color: '#94a3b8' }, ticks: { color: '#94a3b8' } }
            },
            plugins: {
                legend: { position: 'top', labels: { color: '#f8fafc' } }
            }
        }
    });

    // Update Cluster Cards
    renderClusterCards(customers, clusterKey, mode);
}

function renderClusterCards(customers, clusterKey, mode) {
    const container = document.getElementById('clusterCards');
    container.innerHTML = '';

    const clusterStats = Array.from({ length: 5 }, (_, i) => {
        const clusterData = customers.filter(d => d[clusterKey] === i);
        return {
            id: i,
            avgAge: Math.round(clusterData.reduce((acc, d) => acc + d.Age, 0) / clusterData.length),
            avgIncome: Math.round(clusterData.reduce((acc, d) => acc + d['Annual Income (k$)'], 0) / clusterData.length),
            avgSpending: Math.round(clusterData.reduce((acc, d) => acc + d['Spending Score'], 0) / clusterData.length),
            size: clusterData.length
        };
    });

    // Labeling Logic for Bivariate
    const bivariateLabels = [
        { name: "Sensible Shoppers", tag: "Balanced", analysis: "Average income and average spending. They represent the most stable and predictable segment of the mall's economy." },
        { name: "Careful Planners", tag: "Low Spending", analysis: "High earners who are very surgical with their spending. They likely visit the mall for high-ticket items or specific luxury services." },
        { name: "Impulsive Shoppers", tag: "High Priority", analysis: "Low income but high spending. Often younger, trend-driven shoppers who are highly susceptible to marketing campaigns and 'drops'." },
        { name: "Elite High-Rollers", tag: "Top Tier", analysis: "The ideal customer: high income and high spending. They value convenience, exclusive service, and brand recognition." },
        { name: "Budget Conscious", tag: "Minimalists", analysis: "Lowest income and lowest spending scores. They are resistant to standard marketing and typically visit only for absolute essentials." }
    ];

    clusterStats.forEach((stats, i) => {
        let meta;
        if (mode === 'multivariate') {
            meta = multivariateMeta[i];
        } else {
            // Geographic/Heuristic labeling based on the 5-cluster bivariate model
            // Labels are manually mapped based on typical distribution if the algorithm is stable
            // For a production system, we'd sort clusterStats by Income/Spending to map dynamically.
            // But since random_state is fixed at 111, we can semi-automate or manually adjust.
            meta = getBivariateMeta(stats, bivariateLabels);
        }

        const card = document.createElement('div');
        card.className = 'cluster-card glass';
        card.style.borderColor = `${clusterColors[i]}44`;

        card.innerHTML = `
            <div class="cluster-header">
                <div class="cluster-id" style="background: ${clusterColors[i]}">${i}</div>
                <div class="cluster-tag">${meta.tag || 'Standard'}</div>
            </div>
            <h2>${meta.name || `Segment ${i}`}</h2>
            <div class="cluster-stats">
                <div class="stat-item"><span class="label">Avg Age</span><span class="val">${stats.avgAge}</span></div>
                <div class="stat-item"><span class="label">Avg Income</span><span class="val">$${stats.avgIncome}k</span></div>
                <div class="stat-item"><span class="label">Avg Score</span><span class="val">${stats.avgSpending}</span></div>
            </div>
            <div class="cluster-analysis">
                <h4>Cluster Intelligence</h4>
                <p>${meta.analysis}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function getBivariateMeta(stats, labels) {
    // Simple heuristic mapping
    if (stats.avgIncome > 70 && stats.avgSpending > 70) return labels[3]; // Elite
    if (stats.avgIncome > 70 && stats.avgSpending < 40) return labels[1]; // Careful
    if (stats.avgIncome < 40 && stats.avgSpending > 70) return labels[2]; // Impulsive
    if (stats.avgIncome < 40 && stats.avgSpending < 40) return labels[4]; // Budget
    return labels[0]; // Average
}

init();
