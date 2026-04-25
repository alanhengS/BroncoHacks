import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/devices', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setDevices(result.devices);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } else {
        setError('Failed to load devices');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ deviceName, location }),
      });

      const data = await response.json();

      if (response.ok) {
        setDevices([...devices, data.device]);
        setDeviceName('');
        setLocation('');
        setShowForm(false);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyApiKey = (apiKey) => {
    navigator.clipboard.writeText(apiKey);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <Layout title="Devices - Classroom Engagement Monitor">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading devices...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Devices - Classroom Engagement Monitor">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#2e7d32' }}>Device Management</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: '#2e7d32',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showForm ? 'Cancel' : 'Add Device'}
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Add New Device</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="deviceName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Device Name *
              </label>
              <input
                type="text"
                id="deviceName"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                required
                placeholder="e.g., Classroom A - ESP32-01"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="location" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Location (Optional)
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Room 101"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: submitting ? '#ccc' : '#2e7d32',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Creating...' : 'Create Device'}
            </button>
          </form>
        )}

        <div style={{ display: 'grid', gap: '1rem' }}>
          {devices.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <p style={{ color: '#666' }}>No devices registered yet.</p>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                Click "Add Device" to register your first ESP32 device.
              </p>
            </div>
          ) : (
            devices.map((device) => (
              <div key={device.id} style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>
                      {device.deviceName}
                    </h3>
                    {device.location && (
                      <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
                        📍 {device.location}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                      API Key
                    </div>
                    <div style={{
                      fontFamily: 'monospace',
                      backgroundColor: '#f5f5f5',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      wordBreak: 'break-all'
                    }}>
                      {device.apiKey}
                    </div>
                    <button
                      onClick={() => copyApiKey(device.apiKey)}
                      style={{
                        marginTop: '0.5rem',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Copy Key
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {devices.length > 0 && (
          <div style={{
            backgroundColor: '#e8f5e8',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '2rem'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#2e7d32' }}>📋 Setup Instructions</h4>
            <ol style={{ margin: '0', paddingLeft: '1.5rem' }}>
              <li>Copy the API Key for your device</li>
              <li>Flash the ESP32 code with your WiFi credentials and API key</li>
              <li>Connect buttons to GPIO pins (Good: GPIO 12, Bad: GPIO 13, Question: GPIO 14)</li>
              <li>Power on the device and start collecting feedback!</li>
            </ol>
            <p style={{ margin: '1rem 0 0 0', fontSize: '0.875rem', color: '#666' }}>
              Check the ESP32_CODE_EXAMPLE.md file for complete setup instructions.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}