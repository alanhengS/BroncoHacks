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
  const [scope, setScope] = useState('teacher');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rotatingId, setRotatingId] = useState(null);

  const fetchDevices = useCallback(async () => {
    try {
      const { devices, scope } = await api.get('/api/devices');
      setDevices(devices);
      setScope(scope || 'teacher');
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

  const handleRotate = async (deviceId) => {
    setRotatingId(deviceId);
    setError('');
    try {
      const { device } = await api.post('/api/devices/rotate', { deviceId });
      setDevices((prev) => prev.map((d) => (d.id === device.id ? device : d)));
    } catch (e) {
      setError(e.message || 'Failed to rotate key');
    } finally {
      setRotatingId(null);
    }
  };

  if (!ready || loading) {
    return (
      <Layout title="Devices">
        <div className="loader">Loading devices...</div>
      </Layout>
    );
  }

  const isAdmin = scope === 'admin';

  return (
    <Layout title="Devices - Engagement Monitor">
      <div className="page-heading row-between">
        <div>
          <h2>{isAdmin ? 'All devices' : 'Device management'}</h2>
          {isAdmin && (
            <p className="muted">Showing every device across every teacher.</p>
          )}
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add device'}
        </Button>
      </div>

      <Alert kind="danger">{error}</Alert>

      {showForm && (
        <div style={{ marginBottom: '1.5rem' }}>
          <AddDeviceForm onCreate={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <DeviceList
        devices={devices}
        showOwner={isAdmin}
        onRotate={isAdmin ? undefined : handleRotate}
        rotatingId={rotatingId}
      />

      {devices.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <Card title="ESP32 setup">
            <ol className="setup-list">
              <li><strong>Copy the session ID when it is shown</strong> - it is only visible at creation or right after rotating.</li>
              <li>Flash the ESP32 with your WiFi credentials and the session ID.</li>
              <li>Wire buttons to GPIO pins (Good: 12, Bad: 13, Question: 14).</li>
              <li>POST to <code>/api/sentiment</code> with header <code>x-session-id</code> and body <code>{'{ "status": "good" }'}</code>.</li>
            </ol>
            <p className="muted" style={{ marginTop: '1rem' }}>
              Lost a session ID? Click <em>Generate new session ID</em> on the device. The old one stops working immediately.
            </p>
          </Card>
        </div>
      )}
    </Layout>
  );
}
