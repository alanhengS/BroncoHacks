import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

function tryParseServiceAccountJson(text) {
  try {
    const json = JSON.parse(text);
    if (json && json.project_id && json.client_email && json.private_key) {
      return {
        projectId: json.project_id,
        clientEmail: json.client_email,
        privateKey: json.private_key,
      };
    }
  } catch {
    /* not JSON */
  }
  return null;
}

function loadServiceAccount() {
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }

  const root = process.cwd();
  const candidates = [];
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    candidates.push(path.resolve(root, process.env.GOOGLE_APPLICATION_CREDENTIALS));
  }
  for (const name of fs.readdirSync(root)) {
    if (name.endsWith('.json') && name.includes('firebase-adminsdk')) {
      candidates.push(path.join(root, name));
    }
  }
  candidates.push(path.join(root, '.env.local'));

  for (const file of candidates) {
    try {
      const text = fs.readFileSync(file, 'utf-8');
      const parsed = tryParseServiceAccountJson(text);
      if (parsed) return parsed;
    } catch {
      /* keep looking */
    }
  }

  throw new Error(
    'Firebase admin is not configured. Drop the service-account JSON in the project root, ' +
      'or set FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY.'
  );
}

function init() {
  if (admin.apps.length) return admin.app();
  const cred = loadServiceAccount();
  return admin.initializeApp({ credential: admin.credential.cert(cred) });
}

export function adminApp() {
  return globalThis.__cemFirebaseApp__ || (globalThis.__cemFirebaseApp__ = init());
}

export function adminFirestore() {
  return adminApp().firestore();
}

export function adminAuth() {
  return adminApp().auth();
}
