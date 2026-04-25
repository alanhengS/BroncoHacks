import { Card } from '../ui/Card';

function Bar({ label, count, percent, tone }) {
  return (
    <div className="bar-row">
      <div className="bar-row-label">
        <span>{label}</span>
        <span>{count} ({percent}%)</span>
      </div>
      <div className="bar-track">
        <div className={`bar-fill bar-${tone}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function SentimentSummary({ summary }) {
  return (
    <Card title="Sentiment breakdown">
      {summary.total === 0 ? (
        <p className="muted">No sentiment recorded yet.</p>
      ) : (
        <div className="bars">
          <Bar label="😊 Good" count={summary.good} percent={summary.percentageGood} tone="good" />
          <Bar label="❓ Question" count={summary.question} percent={summary.percentageQuestion} tone="question" />
          <Bar label="😞 Bad" count={summary.bad} percent={summary.percentageBad} tone="bad" />
        </div>
      )}
    </Card>
  );
}
