import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Layout({ children, title = 'Classroom Engagement Monitor' }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav style={{
        backgroundColor: '#2e7d32',
        padding: '1rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', marginRight: '2rem' }}>
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none', marginRight: '2rem' }}>
                Dashboard
              </Link>
              <Link href="/devices" style={{ color: 'white', textDecoration: 'none' }}>
                Devices
              </Link>
            </>
          )}
        </div>

        <div>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '1rem' }}>Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <Link href="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
                Login
              </Link>
              <Link href="/register" style={{ color: 'white', textDecoration: 'none' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      <main style={{ padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}