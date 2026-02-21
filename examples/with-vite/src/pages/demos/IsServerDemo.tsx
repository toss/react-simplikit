import { useEffect, useState } from 'react';
import { Card, CodeBlock, InfoBox, StatusCard, StatusRow } from '@examples/shared';
import { isServer } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

const EXAMPLE_CODE = `import { isServer } from '@react-simplikit/mobile';

// Check environment
if (isServer()) {
  // Server-side only code
  console.log('Running on server');
} else {
  // Client-side only code
  console.log('Running on client');
}

// Use in components
function MyComponent() {
  const serverValue = isServer();

  return <div>Is Server: {serverValue ? 'Yes' : 'No'}</div>;
}`;

export function IsServerDemo() {
  const [mounted, setMounted] = useState(false);
  const currentValue = isServer();

  useEffect(function () {
    setMounted(true);
  }, []);

  return (
    <DemoLayout title="isServer" description="Check if code is running on the server">
      {/* Status */}
      <StatusCard title="Environment State" description="Current execution environment">
        <StatusRow
          label="is Server()"
          value={currentValue ? 'true' : 'false'}
          variant={currentValue ? 'warning' : 'success'}
          monospace
        />
        <StatusRow
          label="Component mounted"
          value={mounted ? 'true' : 'false'}
          variant={mounted ? 'success' : 'muted'}
          monospace
        />
      </StatusCard>

      {/* Explanation */}
      <Card title="How it works">
        <InfoBox variant="info">
          <p style={{ margin: 0 }}>
            During <strong>CSR (Vite)</strong>, <code>isServer()</code> always returns <code>false</code>.
            <br />
            There is no SSR step, so it&apos;s always running on the client.
          </p>
        </InfoBox>

        <div style={{ marginTop: '16px' }}>
          <InfoBox variant="tip">
            <p style={{ margin: 0 }}>
              <strong>Tip:</strong> In <strong>SSR (Next.js)</strong>, <code>isServer()</code> returns <code>true</code>{' '}
              during server rendering and <code>false</code> after hydration.
            </p>
          </InfoBox>
        </div>
      </Card>

      {/* Code */}
      <Card title="Implementation Code">
        <CodeBlock code={EXAMPLE_CODE} />
      </Card>
    </DemoLayout>
  );
}
