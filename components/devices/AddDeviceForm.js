import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { Alert } from '../ui/Alert';

export function AddDeviceForm({ onCreate, onCancel }) {
  const [deviceName, setDeviceName] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await onCreate({ deviceName, location });
      setDeviceName('');
      setLocation('');
    } catch (e) {
      setError(e.message || 'Failed to create device');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Add new device">
      <Alert kind="danger">{error}</Alert>
      <form onSubmit={handleSubmit} className="form-grid">
        <FormField label="Device name" htmlFor="deviceName">
          <input
            id="deviceName"
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="e.g., Classroom A - ESP32-01"
            required
          />
        </FormField>
        <FormField label="Location" htmlFor="location" hint="Optional">
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Room 101"
          />
        </FormField>
        <div className="row-actions">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create device'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
