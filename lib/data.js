import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In-memory data stores (use database in production)
export const users = [];
export const devices = [];
export const sentimentData = [];
export const historicalData = [];

// Authentication middleware
export function authenticateToken(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('Access denied');
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    return verified;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Device API Key authentication
export function authenticateDevice(req) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    throw new Error('API Key required');
  }

  const device = devices.find(d => d.apiKey === apiKey);
  if (!device) {
    throw new Error('Invalid API Key');
  }

  return device;
}

// User authentication functions
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET);
}

// Data management functions
export function createUser(username, password, role = 'educator') {
  const user = {
    id: uuidv4(),
    username,
    password,
    role,
    createdAt: new Date()
  };
  users.push(user);
  return user;
}

export function findUser(username) {
  return users.find(u => u.username === username);
}

export function createDevice(deviceName, location, userId) {
  const device = {
    id: uuidv4(),
    apiKey: uuidv4(),
    deviceName,
    location: location || 'Unknown',
    userId,
    createdAt: new Date()
  };
  devices.push(device);
  return device;
}

export function getUserDevices(userId) {
  return devices.filter(d => d.userId === userId);
}

export function submitSentimentData(deviceId, status, studentId = 'anonymous') {
  const dataPoint = {
    id: uuidv4(),
    deviceId,
    status,
    studentId,
    timestamp: new Date()
  };

  sentimentData.push(dataPoint);
  historicalData.push(dataPoint);

  return dataPoint;
}

export function getCurrentSentiment(userId) {
  const userDevices = getUserDevices(userId);
  const deviceIds = userDevices.map(d => d.id);

  const currentSentiment = sentimentData.filter(d => deviceIds.includes(d.deviceId));

  const goodCount = currentSentiment.filter(d => d.status === 'good').length;
  const badCount = currentSentiment.filter(d => d.status === 'bad').length;
  const questionCount = currentSentiment.filter(d => d.status === 'question').length;

  return {
    good: goodCount,
    bad: badCount,
    question: questionCount,
    total: currentSentiment.length,
    percentageGood: currentSentiment.length > 0 ? (goodCount / currentSentiment.length * 100).toFixed(2) : 0,
    percentageBad: currentSentiment.length > 0 ? (badCount / currentSentiment.length * 100).toFixed(2) : 0,
    percentageQuestion: currentSentiment.length > 0 ? (questionCount / currentSentiment.length * 100).toFixed(2) : 0
  };
}

export function getHistoricalData(userId) {
  const userDevices = getUserDevices(userId);
  const deviceIds = userDevices.map(d => d.id);

  return historicalData.filter(d => deviceIds.includes(d.deviceId));
}

export function getStatistics(userId) {
  const history = getHistoricalData(userId);

  if (history.length === 0) {
    return { message: 'No data available' };
  }

  const goodCount = history.filter(d => d.status === 'good').length;
  const badCount = history.filter(d => d.status === 'bad').length;
  const questionCount = history.filter(d => d.status === 'question').length;

  return {
    totalResponses: history.length,
    goodCount,
    badCount,
    questionCount,
    averageGood: (goodCount / history.length * 100).toFixed(2),
    averageBad: (badCount / history.length * 100).toFixed(2),
    averageQuestion: (questionCount / history.length * 100).toFixed(2)
  };
}