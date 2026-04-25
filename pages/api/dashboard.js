import { authenticateToken, getCurrentSentiment, getStatistics } from '../../lib/data';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = authenticateToken(req);

    const currentSentiment = getCurrentSentiment(user.id);
    const statistics = getStatistics(user.id);

    res.status(200).json({
      currentSentiment,
      statistics
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(401).json({ message: error.message });
  }
}