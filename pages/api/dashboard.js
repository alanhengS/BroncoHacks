import { requireSessionUser, sendError } from '../../lib/server/session';
import {
  getSentimentSummary,
  getStatistics,
  getDeviceCount,
  getRecentEvents,
  getAdminOverview,
} from '../../lib/server/store';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const user = await requireSessionUser(req);

    if (user.role === 'administrator') {
      const overview = await getAdminOverview();
      return res.status(200).json({ scope: 'admin', ...overview });
    }

    const [currentSentiment, statistics, connectedDevices, recentEvents] = await Promise.all([
      getSentimentSummary(user.id),
      getStatistics(user.id),
      getDeviceCount(user.id),
      getRecentEvents(user.id),
    ]);
    res.status(200).json({
      scope: 'teacher',
      currentSentiment,
      statistics,
      connectedDevices,
      recentEvents,
    });
  } catch (e) {
    sendError(res, e);
  }
}
