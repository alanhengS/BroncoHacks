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
        <Link href="/" className="nav-brand">
          <span className="brand-mark" aria-hidden="true">EM</span>
          <span>Engagement Monitor</span>
        </Link>
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
            <button onClick={handleSignOut} className="btn btn-secondary">Log out</button>
          </>
        ) : (
          <>
            <Link href="/login">Log in</Link>
            <Link href="/register" className="btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
