import { findDeviceByApiKey } from './store';

export async function requireDevice(req) {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    throw Object.assign(new Error('Missing x-session-id header'), { status: 401 });
  }
  const device = await findDeviceByApiKey(sessionId);
  if (!device) {
    throw Object.assign(new Error('Unknown session id'), { status: 401 });
  }
  return device;
}
