import { Card, CodeBlock, InfoBox, StatusCard, StatusRow } from '@examples/shared';
import { useSafeAreaInset } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

const USAGE_CODE = `import { useSafeAreaInset } from '@react-simplikit/mobile';

function MyComponent() {
  // Automatically updates on orientation change!
  const safeArea = useSafeAreaInset();

  return (
    <div style={{
      paddingTop: safeArea.top,
      paddingBottom: safeArea.bottom,
      paddingLeft: safeArea.left,
      paddingRight: safeArea.right,
    }}>
      Content that respects safe areas
    </div>
  );
}`;

export function UseSafeAreaInsetDemo() {
  const safeArea = useSafeAreaInset();

  const hasInsets = safeArea.top > 0 || safeArea.bottom > 0 || safeArea.left > 0 || safeArea.right > 0;

  return (
    <DemoLayout
      title="useSafeAreaInset"
      description="React hook that tracks safe area insets and auto-updates on orientation change"
    >
      {/* Current Values */}
      <StatusCard title="Safe Area Insets" description="Current values (auto-updates on rotation)">
        <StatusRow label="Top" value={`${safeArea.top}px`} variant={safeArea.top > 0 ? 'success' : 'muted'} monospace />
        <StatusRow
          label="Bottom"
          value={`${safeArea.bottom}px`}
          variant={safeArea.bottom > 0 ? 'success' : 'muted'}
          monospace
        />
        <StatusRow
          label="Left"
          value={`${safeArea.left}px`}
          variant={safeArea.left > 0 ? 'success' : 'muted'}
          monospace
        />
        <StatusRow
          label="Right"
          value={`${safeArea.right}px`}
          variant={safeArea.right > 0 ? 'success' : 'muted'}
          monospace
        />
      </StatusCard>

      {/* Reactive Info */}
      <div style={{ marginBottom: '12px' }}>
        <InfoBox variant="tip">
          <strong>🔄 Reactive Updates</strong>
          <p style={{ margin: '8px 0 0 0' }}>
            Unlike{' '}
            <code style={{ background: '#fff', padding: '2px 4px', borderRadius: '4px' }}>getSafeAreaInset()</code>,
            this hook automatically updates when screen orientation changes.
          </p>
          <p style={{ margin: '8px 0 0 0' }}>
            <strong>Try rotating your device</strong> to see the values update in real-time!
          </p>
        </InfoBox>
      </div>

      {/* Device Status */}
      <div style={{ marginBottom: '12px' }}>
        <InfoBox variant={hasInsets ? 'info' : 'neutral'}>
          {hasInsets ? (
            <>
              <strong>✅ Safe area detected!</strong>
              <p style={{ margin: '8px 0 0 0' }}>
                This device has safe area insets. The values above reflect your device.
              </p>
            </>
          ) : (
            <>
              <strong>💡 No safe area on this device</strong>
              <p style={{ margin: '8px 0 0 0' }}>
                All values are 0px. Test on a real iOS device with notch/home indicator.
              </p>
            </>
          )}
        </InfoBox>
      </div>

      {/* Comparison */}
      <Card title="Hook vs Utility Comparison">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <StatusRow label="getSafeAreaInset()" value="One-time read" />
          <StatusRow label="useSafeAreaInset()" value="Reactive (auto-updates)" variant="success" />
        </div>
      </Card>

      {/* Usage Example */}
      <Card title="Usage Example">
        <CodeBlock code={USAGE_CODE} />
      </Card>

      {/* Live Preview */}
      <Card title="Live Preview">
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>Box with safe area padding applied:</p>
        <div
          style={{
            padding: `${safeArea.top}px ${safeArea.right}px ${safeArea.bottom}px ${safeArea.left}px`,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            color: 'white',
            textAlign: 'center',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '14px' }}>
            Padding: {safeArea.top} / {safeArea.right} / {safeArea.bottom} / {safeArea.left}
          </span>
        </div>
      </Card>
    </DemoLayout>
  );
}
