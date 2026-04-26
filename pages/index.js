import Link from 'next/link';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    number: '01',
    tone: 'green',
    title: 'Live dashboard',
    body: 'Scan classroom sentiment, active questions, and participation trends without waiting for a recap.',
  },
  {
    number: '02',
    tone: 'brown',
    title: 'Device management',
    body: 'Register ESP32 stations, rotate session IDs, and keep every classroom device organized.',
  },
  {
    number: '03',
    tone: 'black',
    title: 'Instant updates',
    body: 'Socket events surface student feedback the moment a button is pressed.',
  },
];

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();

  return (
    <Layout>
      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">ESP32 feedback for live instruction</p>
          <h1>Understand the room while you teach.</h1>
          <p className="hero-lede">
            Track student sentiment from simple classroom devices and see who is
            following, who feels stuck, and who has questions in real time.
          </p>
          {!loading && (
            <div className="hero-cta">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="btn">Go to dashboard</Link>
                  <Link href="/devices" className="btn btn-secondary">Manage devices</Link>
                </>
              ) : (
                <>
                  <Link href="/register" className="btn">Create account</Link>
                  <Link href="/login" className="btn btn-secondary">Log in</Link>
                </>
              )}
            </div>
          )}
          {!loading && isAuthenticated && (
            <p className="muted hero-note">
              Signed in as <strong>{user.username}</strong>
            </p>
          )}
        </div>

        <aside className="hero-panel" aria-label="Live engagement preview">
          <div className="hero-panel-header">
            <div>
              <span className="panel-kicker">Live pulse</span>
              <strong>Room 204</strong>
            </div>
            <span className="status-pill">Now</span>
          </div>
          <div className="pulse-preview">
            <div className="pulse-score">
              <span>84%</span>
              <small>following along</small>
            </div>
            <div className="pulse-wave" aria-hidden="true">
              <span style={{ height: '42%' }} />
              <span style={{ height: '66%' }} />
              <span style={{ height: '48%' }} />
              <span style={{ height: '82%' }} />
              <span style={{ height: '58%' }} />
              <span style={{ height: '74%' }} />
            </div>
          </div>
          <div className="preview-bars">
            <div className="preview-row">
              <span>Following</span>
              <div><span style={{ width: '84%' }} /></div>
              <strong>84</strong>
            </div>
            <div className="preview-row">
              <span>Questions</span>
              <div><span style={{ width: '32%' }} /></div>
              <strong>12</strong>
            </div>
            <div className="preview-row">
              <span>Need help</span>
              <div><span style={{ width: '18%' }} /></div>
              <strong>7</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="feature-grid" aria-label="Product features">
        {features.map((f) => (
          <Card key={f.title} className={`feature-card feature-card-${f.tone}`}>
            <div className="feature-number">{f.number}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="muted">{f.body}</p>
          </Card>
        ))}
      </section>
    </Layout>
  );
}
