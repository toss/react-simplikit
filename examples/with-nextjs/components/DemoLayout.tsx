import type { ReactNode } from 'react';
import Link from 'next/link';

type DemoLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function DemoLayout({ title, description, children }: DemoLayoutProps) {
  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <nav>
        <Link href="/">← All Demos</Link>
      </nav>

      <header style={{ marginTop: 20 }}>
        <h1>{title}</h1>
        <p style={{ color: '#666' }}>{description}</p>
      </header>

      <main style={{ marginTop: 24 }}>{children}</main>
    </div>
  );
}
