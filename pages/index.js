import Link from 'next/link';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';

const features = [
  { icon: '📊', title: 'Live dashboard', body: 'Real-time sentiment data with charts and statistics.' },
  { icon: '📱', title: 'Device management', body: 'Register ESP32 devices with unique API keys.' },
  { icon: '⚡', title: 'Instant updates', body: 'Socket.IO pushes events the moment students click.' },
];

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <h1>Real-time classroom engagement</h1>
        <p>Track student sentiment with ESP32 feedback devices. See who&apos;s following, who&apos;s lost, and who has questions — instantly.</p>
        <div className="hero-cta">
          <Link href="/register" className="btn">Create account</Link>
          <Link href="/login" className="btn btn-secondary">Login</Link>
        </div>
      </section>

      <div className="feature-grid">
        {features.map((f) => (
          <Card key={f.title}>
            <h3 className="feature-title">{f.icon} {f.title}</h3>
            <p className="muted">{f.body}</p>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
