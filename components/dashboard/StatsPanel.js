import { Card } from '../ui/Card';

export function StatsPanel({ statistics }) {
  if (statistics.empty) {
    return (
      <Card title="Statistics">
        <p className="muted">No data yet - sentiment will populate as devices report in.</p>
      </Card>
    );
  }
  return (
    <Card title="Statistics">
      <dl className="kv-grid">
        <div><dt>Total responses</dt><dd>{statistics.totalResponses}</dd></div>
        <div><dt>Average good</dt><dd>{statistics.averageGood}%</dd></div>
        <div><dt>Average bad</dt><dd>{statistics.averageBad}%</dd></div>
        <div><dt>Average questions</dt><dd>{statistics.averageQuestion}%</dd></div>
      </dl>
    </Card>
  );
}
