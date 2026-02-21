import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function DemoLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', padding: 20, fontFamily: 'system-ui, sans-serif' }}
    >
      <nav>
        <Link to="/">← All Demos</Link>
      </nav>

      <header style={{ marginTop: 20 }}>
        <h1>{title}</h1>
        <p style={{ color: '#666' }}>{description}</p>
      </header>

      <main style={{ marginTop: 24 }}>{children}</main>
    </div>
  );
}
