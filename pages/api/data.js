import { authenticateDevice, submitSentimentData } from '../../lib/data';
import { getSocketServer } from '../../lib/socket';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const device = authenticateDevice(req);
    const { status, studentId } = req.body;

    if (!status || !['good', 'bad', 'question'].includes(status)) {
      return res.status(400).json({ message: 'Valid status required (good, bad, question)' });
    }

    const dataPoint = submitSentimentData(device.id, status, studentId);

    // Emit real-time update via Socket.IO
    const io = getSocketServer(res);
    if (io) {
      io.emit('sentimentUpdate', {
        deviceId: device.id,
        status,
        timestamp: dataPoint.timestamp
      });
    }

    res.status(200).json({
      message: 'Data submitted successfully',
      dataPoint: {
        id: dataPoint.id,
        status: dataPoint.status,
        timestamp: dataPoint.timestamp
      }
    });
  } catch (error) {
    console.error('Data submission error:', error);
    res.status(401).json({ message: error.message });
  }
}