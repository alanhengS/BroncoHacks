import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function DeviceList({ devices }) {
  if (!devices.length) {
    return (
      <Card>
        <div className="empty-state">
          <p>No devices registered yet.</p>
          <p className="muted">Click "Add device" to register your first ESP32.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="stack">
      {devices.map((device) => (
        <Card key={device.id}>
          <div className="device-row">
            <div>
              <h3 className="device-name">{device.deviceName}</h3>
              {device.location && <div className="muted">📍 {device.location}</div>}
            </div>
            <div className="device-key">
              <small className="muted">API key</small>
              <div className="api-key">{device.apiKey}</div>
              <Button variant="secondary" onClick={() => navigator.clipboard.writeText(device.apiKey)}>
                Copy
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
