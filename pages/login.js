import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../components/layout/Layout';
import { AuthForm } from '../components/auth/AuthForm';
import { FormField } from '../components/ui/FormField';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await signIn({ email, password });
      router.push('/dashboard');
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Login - Engagement Monitor">
      <button 
        onClick={() => router.back()} 
        className="back-btn-nice"
      >
        ← Back
      </button>
      <AuthForm
        title="Welcome back"
        subtitle="Log in to your engagement dashboard."
        error={error}
        submitting={submitting}
        submitLabel={submitting ? 'Logging in' : 'Login'}
        onSubmit={handleSubmit}
        footer={<p>No account? <Link href="/register">Register here</Link></p>}
      >
        <FormField label="Email" htmlFor="email">
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </FormField>
      </AuthForm>
    </Layout>
  );
}
