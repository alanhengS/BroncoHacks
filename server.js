const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const JWT_SECRET = 'your-secret-key';
const users = [];
const devices = [];
const sentimentData = [];
const historicalData = [];

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Device API Key authentication
const authenticateDevice = (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    if (!apiKey) return res.status(401).json({ message: 'API Key required' });

    const device = devices.find(d => d.apiKey === apiKey);
    if (!device) return res.status(403).json({ message: 'Invalid API Key' });
    
    req.device = device;
    next();
};

// ============= USER AUTHENTICATION =============
app.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

        const existingUser = users.find(u => u.username === username);
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            id: uuidv4(),
            username,
            password: hashedPassword,
            role: role || 'educator'
        };
        users.push(user);
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ username, id: user.id, role: user.role }, JWT_SECRET);
        res.json({ token, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello ${req.user.username}, this is protected!` });
});

// ============= DEVICE MANAGEMENT =============
app.post('/device/register', authenticateToken, (req, res) => {
    try {
        const { deviceName, location } = req.body;
        if (!deviceName) return res.status(400).json({ message: 'Device name required' });

        const apiKey = uuidv4();
        const device = {
            id: uuidv4(),
            apiKey,
            deviceName,
            location: location || 'Unknown',
            userId: req.user.id,
            createdAt: new Date()
        };
        devices.push(device);
        res.status(201).json({ message: 'Device registered', device });
    } catch (error) {
        console.error('Device register error:', error);
        res.status(500).json({ message: 'Server error during device registration' });
    }
});

app.get('/devices', authenticateToken, (req, res) => {
    try {
        const userDevices = devices.filter(d => d.userId === req.user.id);
        res.json(userDevices);
    } catch (error) {
        console.error('Get devices error:', error);
        res.status(500).json({ message: 'Server error fetching devices' });
    }
});

// ============= ESP32 DATA SUBMISSION =============
app.post('/data/submit', authenticateDevice, (req, res) => {
    try {
        const { status, studentId } = req.body;
        if (!status) return res.status(400).json({ message: 'Status required' });

        const timestamp = new Date();
        const dataPoint = {
            id: uuidv4(),
            deviceId: req.device.id,
            status,
            studentId: studentId || 'anonymous',
            timestamp
        };

        sentimentData.push(dataPoint);
        historicalData.push(dataPoint);

        io.emit('sentiment-update', dataPoint);

        res.json({ message: 'Data received', dataPoint });
    } catch (error) {
        console.error('Data submission error:', error);
        res.status(500).json({ message: 'Server error submitting data' });
    }
});

// ============= DASHBOARD DATA ENDPOINTS =============
app.get('/dashboard/current', authenticateToken, (req, res) => {
    try {
        const userDevices = devices.filter(d => d.userId === req.user.id);
        const deviceIds = userDevices.map(d => d.id);

        const currentSentiment = sentimentData.filter(d => deviceIds.includes(d.deviceId));
        
        const goodCount = currentSentiment.filter(d => d.status === 'good').length;
        const badCount = currentSentiment.filter(d => d.status === 'bad').length;
        const questionCount = currentSentiment.filter(d => d.status === 'question').length;

        res.json({
            good: goodCount,
            bad: badCount,
            question: questionCount,
            total: currentSentiment.length,
            percentageGood: currentSentiment.length > 0 ? (goodCount / currentSentiment.length * 100).toFixed(2) : 0,
            percentageBad: currentSentiment.length > 0 ? (badCount / currentSentiment.length * 100).toFixed(2) : 0,
            percentageQuestion: currentSentiment.length > 0 ? (questionCount / currentSentiment.length * 100).toFixed(2) : 0
        });
    } catch (error) {
        console.error('Dashboard current error:', error);
        res.status(500).json({ message: 'Server error fetching current data' });
    }
});

app.get('/dashboard/history', authenticateToken, (req, res) => {
    try {
        const userDevices = devices.filter(d => d.userId === req.user.id);
        const deviceIds = userDevices.map(d => d.id);

        const history = historicalData.filter(d => deviceIds.includes(d.deviceId));
        res.json(history);
    } catch (error) {
        console.error('Dashboard history error:', error);
        res.status(500).json({ message: 'Server error fetching history' });
    }
});

app.get('/dashboard/statistics', authenticateToken, (req, res) => {
    try {
        const userDevices = devices.filter(d => d.userId === req.user.id);
        const deviceIds = userDevices.map(d => d.id);

        const history = historicalData.filter(d => deviceIds.includes(d.deviceId));

        if (history.length === 0) {
            return res.json({ message: 'No data available' });
        }

        const goodCount = history.filter(d => d.status === 'good').length;
        const badCount = history.filter(d => d.status === 'bad').length;
        const questionCount = history.filter(d => d.status === 'question').length;

        res.json({
            totalResponses: history.length,
            goodCount,
            badCount,
            questionCount,
            averageGood: (goodCount / history.length * 100).toFixed(2),
            averageBad: (badCount / history.length * 100).toFixed(2),
            averageQuestion: (questionCount / history.length * 100).toFixed(2)
        });
    } catch (error) {
        console.error('Dashboard statistics error:', error);
        res.status(500).json({ message: 'Server error fetching statistics' });
    }
});

// ============= SOCKET.IO REAL-TIME UPDATES =============
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// ============= ERROR HANDLING =============
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});