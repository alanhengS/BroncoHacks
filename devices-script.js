const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/index.html';
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});

// Register new device
document.getElementById('deviceForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const deviceName = document.getElementById('deviceName').value;
    const location = document.getElementById('location').value;

    try {
        const response = await fetch('/device/register', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ deviceName, location })
        });
        const result = await response.json();

        if (response.ok) {
            document.getElementById('deviceMessage').textContent = 'Device registered successfully!';
            document.getElementById('deviceForm').reset();
            loadDevices();
        } else {
            document.getElementById('deviceMessage').textContent = result.message;
        }
    } catch (error) {
        console.error('Error registering device:', error);
        document.getElementById('deviceMessage').textContent = 'Error registering device';
    }
});

// Load and display devices
async function loadDevices() {
    try {
        const response = await fetch('/devices', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const devices = await response.json();

        const container = document.getElementById('devicesContainer');
        container.innerHTML = '';

        if (devices.length === 0) {
            container.innerHTML = '<p>No devices registered yet.</p>';
            return;
        }

        devices.forEach(device => {
            const div = document.createElement('div');
            div.className = 'device-card';
            div.innerHTML = `
                <h3>${device.deviceName}</h3>
                <p><strong>Location:</strong> ${device.location}</p>
                <p><strong>Device ID:</strong> <code>${device.id}</code></p>
                <p><strong>API Key:</strong> <code>${device.apiKey}</code></p>
                <p><strong>Created:</strong> ${new Date(device.createdAt).toLocaleString()}</p>
                <button onclick="copyToClipboard('${device.apiKey}')">Copy API Key</button>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading devices:', error);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('API Key copied to clipboard!');
    });
}

// Initial load
loadDevices();