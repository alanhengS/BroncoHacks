import { randomUUID, scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { adminFirestore } from './firebase-admin';

export const SENTIMENT_STATUSES = ['good', 'bad', 'question'];
const VALID_ROLES = new Set(['teacher', 'administrator', 'student']);

const COLLECTIONS = {
  users: 'users',
  devices: 'devices',
  events: 'sentiment_events',
};

function db() {
  return adminFirestore();
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, 64);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

function publicUser(user) {
  return { id: user.id, email: user.email, username: user.username, role: user.role };
}

export async function createUser({ email, username, password, role = 'teacher' }) {
  if (!email || !username || !password) {
    throw Object.assign(new Error('Email, username, and password are required'), { status: 400 });
  }
  if (!VALID_ROLES.has(role)) {
    throw Object.assign(new Error(`Invalid role: ${role}`), { status: 400 });
  }
  const existing = await db().collection(COLLECTIONS.users).where('email', '==', email).limit(1).get();
  if (!existing.empty) {
    throw Object.assign(new Error('An account with that email already exists'), { status: 409 });
  }
  const id = randomUUID();
  const data = {
    email,
    username,
    role,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  await db().collection(COLLECTIONS.users).doc(id).set(data);
  return publicUser({ id, ...data });
}

export async function authenticateUser({ email, password }) {
  const snap = await db().collection(COLLECTIONS.users).where('email', '==', email).limit(1).get();
  if (snap.empty) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }
  const doc = snap.docs[0];
  const data = doc.data();
  if (!verifyPassword(password, data.passwordHash)) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }
  return publicUser({ id: doc.id, ...data });
}

export async function findUserById(id) {
  const doc = await db().collection(COLLECTIONS.users).doc(id).get();
  if (!doc.exists) return null;
  return publicUser({ id: doc.id, ...doc.data() });
}

export async function createDevice({ ownerId, deviceName, location }) {
  if (!deviceName) {
    throw Object.assign(new Error('Device name is required'), { status: 400 });
  }
  const id = randomUUID();
  const device = {
    apiKey: randomUUID(),
    ownerId,
    deviceName,
    location: location || 'Unknown',
    createdAt: new Date().toISOString(),
  };
  await db().collection(COLLECTIONS.devices).doc(id).set(device);
  return { id, ...device };
}

export async function listDevices(ownerId) {
  const snap = await db().collection(COLLECTIONS.devices).where('ownerId', '==', ownerId).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function findDeviceByApiKey(apiKey) {
  const snap = await db().collection(COLLECTIONS.devices).where('apiKey', '==', apiKey).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function recordSentiment({ deviceId, status, studentId = 'anonymous' }) {
  if (!SENTIMENT_STATUSES.includes(status)) {
    throw Object.assign(new Error(`Status must be one of: ${SENTIMENT_STATUSES.join(', ')}`), {
      status: 400,
    });
  }
  const id = randomUUID();
  const event = {
    deviceId,
    status,
    studentId,
    timestamp: new Date().toISOString(),
  };
  await db().collection(COLLECTIONS.events).doc(id).set(event);
  return { id, ...event };
}

async function ownerEvents(ownerId) {
  const devices = await listDevices(ownerId);
  if (devices.length === 0) return { devices, events: [] };
  const ids = devices.map((d) => d.id);
  const events = [];
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const snap = await db().collection(COLLECTIONS.events).where('deviceId', 'in', batch).get();
    snap.forEach((doc) => events.push({ id: doc.id, ...doc.data() }));
  }
  return { devices, events };
}

function tally(list) {
  const counts = { good: 0, bad: 0, question: 0 };
  for (const e of list) counts[e.status] = (counts[e.status] || 0) + 1;
  const total = list.length;
  const pct = (n) => (total > 0 ? Number(((n / total) * 100).toFixed(1)) : 0);
  return {
    good: counts.good,
    bad: counts.bad,
    question: counts.question,
    total,
    percentageGood: pct(counts.good),
    percentageBad: pct(counts.bad),
    percentageQuestion: pct(counts.question),
  };
}

export async function getSentimentSummary(ownerId) {
  const { events } = await ownerEvents(ownerId);
  return tally(events);
}

export async function getStatistics(ownerId) {
  const { events } = await ownerEvents(ownerId);
  if (events.length === 0) return { empty: true };
  const t = tally(events);
  return {
    empty: false,
    totalResponses: t.total,
    averageGood: t.percentageGood,
    averageBad: t.percentageBad,
    averageQuestion: t.percentageQuestion,
  };
}

export async function getRecentEvents(ownerId, limit = 8) {
  const { devices, events } = await ownerEvents(ownerId);
  const byId = new Map(devices.map((d) => [d.id, d]));
  return events
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit)
    .map((e) => ({
      id: e.id,
      status: e.status,
      timestamp: e.timestamp,
      deviceName: byId.get(e.deviceId)?.deviceName || 'Unknown device',
    }));
}

export async function getDeviceCount(ownerId) {
  const devices = await listDevices(ownerId);
  return devices.length;
}
