import { Card } from '../ui/Card';

const STATUS = {
  good: { label: '😊 Following', tone: 'good' },
  bad: { label: '😞 Lost', tone: 'bad' },
  question: { label: '❓ Question', tone: 'question' },
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  return `${hr}h ago`;
}

export function RecentEvents({ events }) {
  if (!events?.length) {
    return (
      <Card title="Recent events">
        <p className="muted">No events yet.</p>
      </Card>
    );
  }
  return (
    <Card title="Recent events">
      <ul className="event-list">
        {events.map((e) => {
          const meta = STATUS[e.status] || { label: e.status, tone: '' };
          return (
            <li key={e.id} className={`event event-${meta.tone}`}>
              <div>
                <div className="event-label">{meta.label}</div>
                <div className="event-device">
                  {e.deviceName}
                  {e.ownerUsername && <span className="muted"> · {e.ownerUsername}</span>}
                </div>
              </div>
              <div className="event-time">{timeAgo(e.timestamp)}</div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
