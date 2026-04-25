import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const TEACHER_ROLES = new Set(['teacher', 'administrator']);

export function Navigation() {
  const router = useRouter();
  const { user, isAuthenticated, role, signOut } = useAuth();
  const showTeacherLinks = isAuthenticated && TEACHER_ROLES.has(role);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="app-nav">
      <div className="nav-links">
        <Link href="/" className="nav-brand">📡 Engagement Monitor</Link>
        {showTeacherLinks && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/devices">Devices</Link>
          </>
        )}
      </div>
      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <div className="nav-user">
              <div>{user.username}</div>
              <small>{role}</small>
            </div>
            <button onClick={handleSignOut} className="btn btn-secondary">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register" className="btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
