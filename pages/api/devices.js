import { requireSessionUser, sendError } from '../../lib/server/session';
import { createDevice, listDevices } from '../../lib/server/store';

export default async function handler(req, res) {
  try {
    const user = await requireSessionUser(req);

    if (req.method === 'GET') {
      const devices = await listDevices(user.id);
      return res.status(200).json({ devices });
    }

    if (req.method === 'POST') {
      const { deviceName, location } = req.body || {};
      const device = await createDevice({ ownerId: user.id, deviceName, location });
      return res.status(201).json({ device });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (e) {
    sendError(res, e);
  }
}
