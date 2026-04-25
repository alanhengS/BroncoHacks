import { useCallback, useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DeviceList } from '../components/devices/DeviceList';
import { AddDeviceForm } from '../components/devices/AddDeviceForm';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { api } from '../lib/apiClient';

export default function DevicesPage() {
  const { ready } = useRequireAuth();
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchDevices = useCallback(async () => {
    try {
      const { devices } = await api.get('/api/devices');
      setDevices(devices);
      setError('');
    } catch (e) {
      setError(e.message || 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    fetchDevices();
  }, [ready, fetchDevices]);

  const handleCreate = async ({ deviceName, location }) => {
    const { device } = await api.post('/api/devices', { deviceName, location });
    setDevices((prev) => [...prev, device]);
    setShowForm(false);
  };

  if (!ready || loading) {
    return (
      <Layout title="Devices">
        <div className="loader">Loading devices…</div>
      </Layout>
    );
  }

  return (
    <Layout title="Devices - Engagement Monitor">
      <div className="page-heading row-between">
        <h2>Device management</h2>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ Add device'}
        </Button>
      </div>

      <Alert kind="danger">{error}</Alert>

      {showForm && (
        <div style={{ marginBottom: '1.5rem' }}>
          <AddDeviceForm onCreate={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <DeviceList devices={devices} />

      {devices.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <Card title="📋 ESP32 setup">
            <ol className="setup-list">
              <li>Copy the API key for your device.</li>
              <li>Flash the ESP32 with your WiFi credentials and the API key.</li>
              <li>Wire buttons to GPIO pins (Good: 12, Bad: 13, Question: 14).</li>
              <li>POST to <code>/api/sentiment</code> with header <code>x-api-key</code> and body <code>{'{ "status": "good" }'}</code>.</li>
            </ol>
            <p className="muted" style={{ marginTop: '1rem' }}>
              See <code>ESP32_CODE_EXAMPLE.md</code> for a complete sketch.
            </p>
          </Card>
        </div>
      )}
    </Layout>
  );
}
