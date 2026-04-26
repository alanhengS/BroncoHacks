import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function DeviceList({ devices, showOwner = false, onRotate, rotatingId }) {
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
      {devices.map((device) => {
        const hasKey = Boolean(device.apiKey);
        return (
          <Card key={device.id}>
            <div className="device-row">
              <div>
                <h3 className="device-name">{device.deviceName}</h3>
                {device.location && <div className="muted">📍 {device.location}</div>}
                {showOwner && device.ownerUsername && (
                  <div className="muted">
                    👤 {device.ownerUsername}
                    {device.ownerEmail ? ` · ${device.ownerEmail}` : ''}
                  </div>
                )}
              </div>
              <div className="device-key">
                <small className="muted">API key</small>
                {hasKey ? (
                  <>
                    <div className="api-key">{device.apiKey}</div>
                    <small className="muted" style={{ fontSize: '0.75rem' }}>
                      Copy now — this is the only time it will be shown.
                    </small>
                    <Button
                      variant="secondary"
                      onClick={() => navigator.clipboard.writeText(device.apiKey)}
                    >
                      Copy
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="api-key api-key-hidden">••••••••••••••••</div>
                    {!showOwner && onRotate && (
                      <Button
                        variant="secondary"
                        onClick={() => onRotate(device.id)}
                        disabled={rotatingId === device.id}
                      >
                        {rotatingId === device.id ? 'Generating…' : 'Generate new key'}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
