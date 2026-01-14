import { useEffect, useState } from 'react';
import { isServer } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

export function IsServerDemo() {
  const [mounted, setMounted] = useState(false);
  const currentValue = isServer();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DemoLayout title="isServer" description="Check if code is running on the server">
      <div
        style={{
          padding: 16,
          background: '#f5f5f5',
          borderRadius: 8,
        }}
      >
        <p>
          <strong>isServer():</strong> <code>{currentValue ? 'true' : 'false'}</code>
        </p>
        <p>
          <strong>Component mounted:</strong> <code>{mounted ? 'true' : 'false'}</code>
        </p>
      </div>

      <div style={{ marginTop: 16, color: '#666', fontSize: 14 }}>
        <p>In CSR (Vite), isServer() always returns false.</p>
        <p>There is no SSR step, so it&apos;s always running on the client.</p>
      </div>
    </DemoLayout>
  );
}
