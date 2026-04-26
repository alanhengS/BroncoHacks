import { requireSessionUser, sendError } from '../../lib/server/session';
import { createDevice, listDevices, listAllDevicesWithOwner } from '../../lib/server/store';

function stripKey({ apiKey, ...rest }) {
  return rest;
}

export default async function handler(req, res) {
  try {
    const user = await requireSessionUser(req);

    if (req.method === 'GET') {
      if (user.role === 'administrator') {
        const devices = await listAllDevicesWithOwner();
        return res.status(200).json({ scope: 'admin', devices: devices.map(stripKey) });
      }
      const devices = await listDevices(user.id);
      return res.status(200).json({ scope: 'teacher', devices: devices.map(stripKey) });
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
