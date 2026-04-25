const socket = io();

let sentimentChart = null;
let historyChart = null;
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/index.html';
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});

// Fetch and display current sentiment data
async function updateDashboard() {
    try {
        const response = await fetch('/dashboard/current', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        document.getElementById('goodCount').textContent = data.good;
        document.getElementById('badCount').textContent = data.bad;
        document.getElementById('questionCount').textContent = data.question;
        document.getElementById('totalCount').textContent = data.total;

        document.getElementById('goodPercentage').textContent = data.percentageGood + '%';
        document.getElementById('badPercentage').textContent = data.percentageBad + '%';
        document.getElementById('questionPercentage').textContent = data.percentageQuestion + '%';

        updateSentimentChart(data);
    } catch (error) {
        console.error('Error fetching current data:', error);
    }
}

// Fetch historical statistics
async function updateStatistics() {
    try {
        const response = await fetch('/dashboard/statistics', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.message) return; // No data available

        updateHistoryChart(data);
    } catch (error) {
        console.error('Error fetching statistics:', error);
    }
}

// Update sentiment chart
function updateSentimentChart(data) {
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    
    if (sentimentChart) {
        sentimentChart.destroy();
    }

    sentimentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['✓ Understand', '✗ Lost', '? Question'],
            datasets: [{
                data: [data.good, data.bad, data.question],
                backgroundColor: ['#4CAF50', '#f44336', '#ff9800'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update history chart
function updateHistoryChart(data) {
    const ctx = document.getElementById('historyChart').getContext('2d');
    
    if (historyChart) {
        historyChart.destroy();
    }

    historyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['✓ Understand', '✗ Lost', '? Question'],
            datasets: [{
                label: 'Count',
                data: [data.goodCount, data.badCount, data.questionCount],
                backgroundColor: ['#4CAF50', '#f44336', '#ff9800']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Fetch activity log
async function updateActivityLog() {
    try {
        const response = await fetch('/dashboard/history', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        const activityLog = document.getElementById('activityLog');
        activityLog.innerHTML = '';

        const recent = data.slice(-20).reverse(); // Get last 20, reverse for newest first

        recent.forEach(item => {
            const time = new Date(item.timestamp).toLocaleTimeString();
            const statusEmoji = item.status === 'good' ? '✓' : item.status === 'bad' ? '✗' : '?';
            const statusText = item.status === 'good' ? 'Understand' : item.status === 'bad' ? 'Lost' : 'Question';
            
            const div = document.createElement('div');
            div.className = 'activity-item';
            div.innerHTML = `<span class="time">${time}</span> <span class="status">${statusEmoji} ${statusText}</span>`;
            activityLog.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching activity log:', error);
    }
}

// Real-time updates via Socket.IO
socket.on('sentiment-update', (data) => {
    updateDashboard();
    updateActivityLog();
});

// Initial load
updateDashboard();
updateStatistics();
updateActivityLog();

// Refresh every 5 seconds
setInterval(() => {
    updateDashboard();
    updateStatistics();
    updateActivityLog();
}, 5000);