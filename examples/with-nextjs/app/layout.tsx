import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'with-nextjs | react-simplikit',
  description: 'Next.js example for react-simplikit',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: 20 }}>{children}</body>
    </html>
  );
}
