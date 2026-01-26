import { useEffect, useState } from 'react';
import { Card, CodeBlock, InfoBox, StatusCard, StatusRow } from '@examples/shared';
import { getSafeAreaInset } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

type SafeAreaValues = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

const USAGE_CODE = `import { getSafeAreaInset } from '@react-simplikit/mobile';

// Get all insets at once
const { top, bottom, left, right } = getSafeAreaInset();

// Apply to styles
header.style.paddingTop = \`\${top}px\`;
footer.style.paddingBottom = \`\${bottom}px\`;`;

const VIEWPORT_META = `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`;

export function GetSafeAreaInsetDemo() {
  const [safeArea, setSafeArea] = useState<SafeAreaValues>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    setSafeArea(getSafeAreaInset());
  }, []);

  const hasInsets = safeArea.top > 0 || safeArea.bottom > 0 || safeArea.left > 0 || safeArea.right > 0;

  return (
    <DemoLayout title="getSafeAreaInset" description="Get device safe area insets (notch, home indicator, etc.)">
      {/* Current Values */}
      <StatusCard title="Safe Area Insets" description="Current device safe area values">
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

      {/* Descriptions */}
      <Card title="What Each Value Means">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <StatusRow label="Top" value="Notch, Dynamic Island, Status bar" />
          <StatusRow label="Bottom" value="Home indicator (Face ID devices)" />
          <StatusRow label="Left" value="Rounded corners (landscape)" />
          <StatusRow label="Right" value="Rounded corners (landscape)" />
        </div>
      </Card>

      {/* Device Status */}
      <div style={{ marginBottom: '12px' }}>
        <InfoBox variant={hasInsets ? 'tip' : 'info'}>
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
                All values are 0px. Test on a real iOS device or iOS Simulator with notch/home indicator to see actual
                values.
              </p>
            </>
          )}
        </InfoBox>
      </div>

      {/* Viewport Setup */}
      <Card title="Required Setup">
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
          Make sure to set{' '}
          <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>viewport-fit=cover</code> in
          your HTML meta tag:
        </p>
        <CodeBlock code={VIEWPORT_META} />
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
