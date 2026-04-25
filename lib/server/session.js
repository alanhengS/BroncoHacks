import { randomBytes } from 'crypto';
import { adminFirestore } from './firebase-admin';
import { findUserById } from './store';

const SESSION_COOKIE = 'cem_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const COLLECTION = 'sessions';

function db() {
  return adminFirestore();
}

function parseCookies(header = '') {
  return header
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean)
    .reduce((acc, pair) => {
      const idx = pair.indexOf('=');
      if (idx === -1) return acc;
      acc[pair.slice(0, idx)] = decodeURIComponent(pair.slice(idx + 1));
      return acc;
    }, {});
}

function buildCookie(name, value, { maxAge = 0, expired = false } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (expired) parts.push('Max-Age=0');
  else if (maxAge) parts.push(`Max-Age=${Math.floor(maxAge / 1000)}`);
  return parts.join('; ');
}

export async function startSession(res, user) {
  const token = randomBytes(32).toString('hex');
  await db().collection(COLLECTION).doc(token).set({
    userId: user.id,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  res.setHeader('Set-Cookie', buildCookie(SESSION_COOKIE, token, { maxAge: SESSION_TTL_MS }));
}

export async function endSession(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_COOKIE];
  if (token) {
    await db().collection(COLLECTION).doc(token).delete().catch(() => {});
  }
  res.setHeader('Set-Cookie', buildCookie(SESSION_COOKIE, '', { expired: true }));
}

export async function getSessionUser(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  const doc = await db().collection(COLLECTION).doc(token).get();
  if (!doc.exists) return null;
  const session = doc.data();
  if (session.expiresAt < Date.now()) {
    await doc.ref.delete().catch(() => {});
    return null;
  }
  return findUserById(session.userId);
}

export async function requireSessionUser(req) {
  const user = await getSessionUser(req);
  if (!user) {
    throw Object.assign(new Error('Authentication required'), { status: 401 });
  }
  return user;
}

export function sendError(res, error) {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
}
