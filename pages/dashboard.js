import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import io from 'socket.io-client';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchData();
    setupSocket();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    const socket = io();

    socket.on('sentimentUpdate', () => {
      fetchData(); // Refresh data on real-time updates
    });

    return () => {
      socket.disconnect();
    };
  };

  if (loading) {
    return (
      <Layout title="Dashboard - Classroom Engagement Monitor">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard - Classroom Engagement Monitor">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
          <button
            onClick={fetchData}
            style={{
              backgroundColor: '#2e7d32',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  const { currentSentiment, statistics } = data;

  return (
    <Layout title="Dashboard - Classroom Engagement Monitor">
      <div>
        <h2 style={{ color: '#2e7d32', marginBottom: '2rem' }}>Classroom Engagement Dashboard</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#4caf50', marginBottom: '1rem' }}>😊 Good</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>
              {currentSentiment.good}
            </div>
            <div style={{ color: '#666', marginTop: '0.5rem' }}>
              {currentSentiment.percentageGood}%
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#f44336', marginBottom: '1rem' }}>😞 Bad</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f44336' }}>
              {currentSentiment.bad}
            </div>
            <div style={{ color: '#666', marginTop: '0.5rem' }}>
              {currentSentiment.percentageBad}%
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ff9800', marginBottom: '1rem' }}>❓ Question</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800' }}>
              {currentSentiment.question}
            </div>
            <div style={{ color: '#666', marginTop: '0.5rem' }}>
              {currentSentiment.percentageQuestion}%
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#2e7d32', marginBottom: '1rem' }}>📊 Total</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2e7d32' }}>
              {currentSentiment.total}
            </div>
            <div style={{ color: '#666', marginTop: '0.5rem' }}>
              Responses
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Statistics</h3>
          {statistics.message ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>{statistics.message}</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong>Total Responses:</strong> {statistics.totalResponses}
              </div>
              <div>
                <strong>Average Good:</strong> {statistics.averageGood}%
              </div>
              <div>
                <strong>Average Bad:</strong> {statistics.averageBad}%
              </div>
              <div>
                <strong>Average Questions:</strong> {statistics.averageQuestion}%
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={fetchData}
            style={{
              backgroundColor: '#2e7d32',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Refresh Data
          </button>
          <a
            href="/devices"
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              padding: '0.75rem 1.5rem',
              textDecoration: 'none',
              borderRadius: '4px',
              display: 'inline-block'
            }}
          >
            Manage Devices
          </a>
        </div>
      </div>
    </Layout>
  );
}