import type { ReactNode } from 'react';
import { Card } from './Card.tsx';

export function StatusCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card title={title}>
      {description !== undefined && (
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{description}</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{children}</div>
    </Card>
  );
}
