import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../components/layout/Layout';
import { AuthForm } from '../components/auth/AuthForm';
import { FormField } from '../components/ui/FormField';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('teacher');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await signUp({ email, username, password, role });
      router.push('/dashboard');
    } catch (e) {
      setError(e.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Register - Engagement Monitor">
      <AuthForm
        title="Create your account"
        subtitle="Start monitoring classroom engagement in seconds."
        error={error}
        submitting={submitting}
        submitLabel={submitting ? 'Registering' : 'Create account'}
        onSubmit={handleSubmit}
        footer={<p>Already have an account? <Link href="/login">Login here</Link></p>}
      >
        <FormField label="Email" htmlFor="email">
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </FormField>
        <FormField label="Username" htmlFor="username">
          <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </FormField>
        <FormField label="Role" htmlFor="role">
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="teacher">Teacher</option>
            <option value="administrator">Administrator</option>
            <option value="student">Student</option>
          </select>
        </FormField>
        <FormField label="Password" htmlFor="password">
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
        </FormField>
        <FormField label="Confirm password" htmlFor="confirmPassword">
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
        </FormField>
      </AuthForm>
    </Layout>
  );
}
