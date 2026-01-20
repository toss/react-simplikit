import { useEffect, useState } from 'react';
import { getSafeAreaInset } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

type SafeAreaValues = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export function GetSafeAreaInsetDemo() {
  const [safeArea, setSafeArea] = useState<SafeAreaValues>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    setSafeArea({
      top: getSafeAreaInset('top'),
      bottom: getSafeAreaInset('bottom'),
      left: getSafeAreaInset('left'),
      right: getSafeAreaInset('right'),
    });
  }, []);

  return (
    <DemoLayout title="getSafeAreaInset" description="Get device safe area insets (notch, home indicator, etc.)">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}
      >
        <InsetCard label="Top" value={safeArea.top} description="Notch, Dynamic Island, or status bar" />
        <InsetCard label="Bottom" value={safeArea.bottom} description="Home indicator on Face ID devices" />
        <InsetCard label="Left" value={safeArea.left} description="Rounded corners (landscape)" />
        <InsetCard label="Right" value={safeArea.right} description="Rounded corners (landscape)" />
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: '#e8f4fd',
          borderRadius: 8,
          border: '1px solid #b3d9f2',
        }}
      >
        <strong style={{ color: '#0066cc' }}>💡 Tip</strong>
        <p style={{ marginTop: 8, color: '#444', fontSize: 14 }}>
          On desktop browsers, all values will be 0px. Test on a real iOS device or iOS Simulator with notch/home
          indicator to see actual values.
        </p>
        <p style={{ marginTop: 8, color: '#444', fontSize: 14 }}>
          Make sure to set <code style={{ background: '#fff', padding: '2px 4px' }}>viewport-fit=cover</code> in your
          HTML meta tag:
        </p>
        <pre
          style={{
            marginTop: 8,
            padding: 12,
            background: '#fff',
            borderRadius: 4,
            fontSize: 12,
            overflow: 'auto',
          }}
        >
          {`<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`}
        </pre>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3>Usage Example</h3>
        <pre
          style={{
            padding: 16,
            background: '#1e1e1e',
            color: '#d4d4d4',
            borderRadius: 8,
            fontSize: 13,
            overflow: 'auto',
          }}
        >
          {`import { getSafeAreaInset } from '@react-simplikit/mobile';

// Get individual insets
const topInset = getSafeAreaInset('top');
const bottomInset = getSafeAreaInset('bottom');

// Apply to styles
header.style.paddingTop = \`\${topInset}px\`;
footer.style.paddingBottom = \`\${bottomInset}px\`;`}
        </pre>
      </div>
    </DemoLayout>
  );
}

function InsetCard({ label, value, description }: { label: string; value: number; description: string }) {
  return (
    <div
      style={{
        padding: 16,
        background: '#f5f5f5',
        borderRadius: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{label}</strong>
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: value > 0 ? '#0066cc' : '#888',
          }}
        >
          {value}px
        </span>
      </div>
      <p style={{ marginTop: 4, fontSize: 12, color: '#666' }}>{description}</p>
    </div>
  );
}
