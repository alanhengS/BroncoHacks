import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#2e7d32', marginBottom: '2rem' }}>
          Classroom Engagement Monitor
        </h1>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h2>Real-time Student Sentiment Tracking</h2>
          <p>
            Monitor classroom engagement with ESP32-powered feedback devices.
            Get instant insights into student understanding and participation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#2e7d32' }}>📊 Real-time Dashboard</h3>
            <p>View live sentiment data with interactive charts and statistics.</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#2e7d32' }}>📱 Device Management</h3>
            <p>Register and manage ESP32 devices with unique API keys.</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#2e7d32' }}>🔧 ESP32 Integration</h3>
            <p>Easy-to-deploy hardware solution for instant feedback.</p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#e8f5e8',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3>Get Started</h3>
          <p>
            Register an account, set up your ESP32 devices, and start monitoring
            classroom engagement in real-time.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <a href="/register" style={{
              backgroundColor: '#2e7d32',
              color: 'white',
              padding: '0.75rem 1.5rem',
              textDecoration: 'none',
              borderRadius: '4px',
              display: 'inline-block',
              marginRight: '1rem'
            }}>
              Create Account
            </a>
            <a href="/login" style={{
              backgroundColor: '#4caf50',
              color: 'white',
              padding: '0.75rem 1.5rem',
              textDecoration: 'none',
              borderRadius: '4px',
              display: 'inline-block'
            }}>
              Login
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}