import { authenticateUser } from '../../../lib/server/store';
import { startSession, sendError } from '../../../lib/server/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { email, password } = req.body || {};
    const user = await authenticateUser({ email, password });
    await startSession(res, user);
    res.status(200).json({ user });
  } catch (e) {
    sendError(res, e);
  }
}
