import { Card } from '../ui/Card';

export function TeachersPanel({ teachers }) {
  if (!teachers?.length) {
    return (
      <Card title="Teachers">
        <p className="muted">No teachers registered yet.</p>
      </Card>
    );
  }

  return (
    <Card title={`Teachers (${teachers.length})`}>
      <div className="teacher-table">
        <div className="teacher-row teacher-row-head">
          <div>Teacher</div>
          <div>Devices</div>
          <div>Total</div>
          <div className="cell-good">Good</div>
          <div className="cell-bad">Bad</div>
          <div className="cell-question">Q</div>
        </div>
        {teachers.map((t) => (
          <div key={t.id} className="teacher-row">
            <div>
              <div className="teacher-name">
                {t.username}
                {t.role === 'administrator' && <span className="role-badge"> admin</span>}
              </div>
              <div className="muted teacher-email">{t.email}</div>
            </div>
            <div>{t.deviceCount}</div>
            <div>{t.currentSentiment.total}</div>
            <div className="cell-good">
              {t.currentSentiment.good} <span className="muted">({t.currentSentiment.percentageGood}%)</span>
            </div>
            <div className="cell-bad">
              {t.currentSentiment.bad} <span className="muted">({t.currentSentiment.percentageBad}%)</span>
            </div>
            <div className="cell-question">
              {t.currentSentiment.question} <span className="muted">({t.currentSentiment.percentageQuestion}%)</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
