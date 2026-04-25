import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import io from 'socket.io-client';
import { Layout } from '../components/layout/Layout';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { PulsePanel } from '../components/dashboard/PulsePanel';
import { SentimentSummary } from '../components/dashboard/SentimentSummary';
import { StatsPanel } from '../components/dashboard/StatsPanel';
import { RecentEvents } from '../components/dashboard/RecentEvents';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { api } from '../lib/apiClient';

export default function DashboardPage() {
  const { ready, user } = useRequireAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await api.get('/api/dashboard');
      setData(result);
      setError('');
    } catch (e) {
      setError(e.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    fetchData();

    let socket;
    (async () => {
      try {
        await fetch('/api/socket');
        socket = io({ path: '/api/socket' });
        socket.on('sentimentUpdate', () => fetchData());
      } catch {
        /* socket optional */
      }
    })();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [ready, fetchData]);

  if (!ready || loading) {
    return (
      <Layout title="Dashboard">
        <div className="loader">Loading dashboard…</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard">
        <Alert kind="danger">{error}</Alert>
        <Button onClick={fetchData}>Retry</Button>
      </Layout>
    );
  }

  const { currentSentiment, statistics, connectedDevices, recentEvents } = data;
  const showAlert = currentSentiment.percentageBad > 45 && currentSentiment.total > 0;

  return (
    <Layout title="Dashboard - Engagement Monitor">
      <div className="page-heading">
        <h2>Engagement dashboard</h2>
        <p className="muted">Welcome back, <strong>{user.username}</strong> — role: {user.role}</p>
      </div>

      {showAlert && (
        <Alert kind="warning">
          <strong>Heads up:</strong> high confusion or negative sentiment detected. Consider pausing
          to re-engage the class.
        </Alert>
      )}

      <div className="stack">
        <PulsePanel connectedDevices={connectedDevices} summary={currentSentiment} />
        <div className="two-col">
          <SentimentSummary summary={currentSentiment} />
          <StatsPanel statistics={statistics} />
        </div>
        <RecentEvents events={recentEvents} />
      </div>

      <div className="row-actions" style={{ marginTop: '1.5rem' }}>
        <Button onClick={fetchData}>Refresh</Button>
        <Link href="/devices" className="btn btn-secondary">Manage devices</Link>
      </div>
    </Layout>
  );
}
