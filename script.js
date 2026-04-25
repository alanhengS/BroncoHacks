// Check if user is already logged in
const token = localStorage.getItem('token');

if (token) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('home').innerHTML = `
        <h2>Welcome back!</h2>
        <p>You are logged in to the BroncoHacks Engagement System.</p>
        <p><a href="dashboard.html" style="color: #4CAF50; text-decoration: none; font-weight: bold;">→ Go to Dashboard</a></p>
        <p><a href="devices.html" style="color: #4CAF50; text-decoration: none; font-weight: bold;">→ Manage Devices</a></p>
        <button onclick="logout()">Logout</button>
    `;
} else {
    document.getElementById('auth-section').style.display = 'block';
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}

// Basic JavaScript for interactivity

const socket = io();

// Handle connection
socket.on('connect', () => {
    console.log('Connected to server');
});

// Handle server responses
socket.on('response', (data) => {
    console.log('Server response:', data);
});

// Handle periodic updates (e.g., from device)
socket.on('update', (data) => {
    console.log('Update from server:', data);
});

// Authentication
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'educator' })
    });
    const result = await response.json();
    document.getElementById('authMessage').textContent = result.message;
    if (response.ok) {
        document.getElementById('registerForm').reset();
    }
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (result.token) {
        localStorage.setItem('token', result.token);
        document.getElementById('authMessage').textContent = 'Logged in successfully! Redirecting...';
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1000);
    } else {
        document.getElementById('authMessage').textContent = result.message;
    }
});