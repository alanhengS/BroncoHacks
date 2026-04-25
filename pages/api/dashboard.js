import { requireSessionUser, sendError } from '../../lib/server/session';
import {
  getSentimentSummary,
  getStatistics,
  getDeviceCount,
  getRecentEvents,
} from '../../lib/server/store';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const user = await requireSessionUser(req);
    const [currentSentiment, statistics, connectedDevices, recentEvents] = await Promise.all([
      getSentimentSummary(user.id),
      getStatistics(user.id),
      getDeviceCount(user.id),
      getRecentEvents(user.id),
    ]);
    res.status(200).json({ currentSentiment, statistics, connectedDevices, recentEvents });
  } catch (e) {
    sendError(res, e);
  }
}
