import { Card } from '../ui/Card';
import { Metric } from '../ui/Metric';

export function PulsePanel({ connectedDevices, summary }) {
  return (
    <Card title="Live classroom pulse">
      <div className="metric-grid">
        <Metric label="Connected devices" value={connectedDevices} />
        <Metric label="Active questions" value={summary.question} tone="question" />
        <Metric label="Following along" value={summary.good} tone="good" />
        <Metric label="Lost / confused" value={summary.bad} tone="bad" />
      </div>
    </Card>
  );
}
