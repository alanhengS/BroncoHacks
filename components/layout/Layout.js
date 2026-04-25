import Head from 'next/head';
import { Navigation } from './Navigation';

export function Layout({ children, title = 'Classroom Engagement Monitor' }) {
  return (
    <div className="app-shell">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className="app-main">{children}</main>
    </div>
  );
}
