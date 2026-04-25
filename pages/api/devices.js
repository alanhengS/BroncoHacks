import { authenticateToken, createDevice, getUserDevices } from '../../lib/data';

export default async function handler(req, res) {
  try {
    const user = authenticateToken(req);

    if (req.method === 'GET') {
      const devices = getUserDevices(user.id);
      return res.status(200).json({ devices });
    }

    if (req.method === 'POST') {
      const { deviceName, location } = req.body;

      if (!deviceName) {
        return res.status(400).json({ message: 'Device name required' });
      }

      const device = createDevice(deviceName, location, user.id);
      return res.status(201).json({
        message: 'Device created successfully',
        device: {
          id: device.id,
          deviceName: device.deviceName,
          location: device.location,
          apiKey: device.apiKey
        }
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Devices API error:', error);
    res.status(401).json({ message: error.message });
  }
}