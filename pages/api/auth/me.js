import { getSessionUser } from '../../../lib/server/session';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const user = await getSessionUser(req);
    res.status(200).json({ user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
