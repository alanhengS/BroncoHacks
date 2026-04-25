import { requireDevice } from '../../lib/server/device-auth';
import { recordSentiment } from '../../lib/server/store';
import { getSocketServer } from '../../lib/server/socket';
import { sendError } from '../../lib/server/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const device = await requireDevice(req);
    const { status, studentId } = req.body || {};
    const event = await recordSentiment({ deviceId: device.id, status, studentId });

    const io = getSocketServer(res);
    if (io) io.emit('sentimentUpdate', { ownerId: device.ownerId, event });

    res.status(200).json({ event });
  } catch (e) {
    sendError(res, e);
  }
}
