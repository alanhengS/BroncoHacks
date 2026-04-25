import { findDeviceByApiKey } from './store';

export async function requireDevice(req) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    throw Object.assign(new Error('Missing x-api-key header'), { status: 401 });
  }
  const device = await findDeviceByApiKey(apiKey);
  if (!device) {
    throw Object.assign(new Error('Unknown API key'), { status: 401 });
  }
  return device;
}
