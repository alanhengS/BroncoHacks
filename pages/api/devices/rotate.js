import { requireSessionUser, sendError } from '../../../lib/server/session';
import { rotateDeviceApiKey } from '../../../lib/server/store';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const user = await requireSessionUser(req);
    if (user.role === 'administrator') {
      return res.status(403).json({ message: 'Administrators cannot rotate other teachers’ session IDs.' });
    }
    const { deviceId } = req.body || {};
    if (!deviceId) return res.status(400).json({ message: 'deviceId is required' });
    const { apiKey, ...rest } = await rotateDeviceApiKey({ deviceId, ownerId: user.id });
    res.status(200).json({ device: { ...rest, sessionId: apiKey } });
  } catch (e) {
    sendError(res, e);
  }
}
