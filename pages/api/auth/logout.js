import { endSession } from '../../../lib/server/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  await endSession(req, res);
  res.status(200).json({ ok: true });
}
