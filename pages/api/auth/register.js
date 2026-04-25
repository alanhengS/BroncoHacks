import { createUser } from '../../../lib/server/store';
import { startSession, sendError } from '../../../lib/server/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { email, username, password, role } = req.body || {};
    const user = await createUser({ email, username, password, role });
    await startSession(res, user);
    res.status(201).json({ user });
  } catch (e) {
    sendError(res, e);
  }
}
