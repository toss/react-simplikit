import { useSafeAreaInset } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

export function UseSafeAreaInsetDemo() {
  const safeArea = useSafeAreaInset();

  return (
    <DemoLayout
      title="useSafeAreaInset"
      description="React hook that tracks safe area insets and automatically updates on orientation change"
    >
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
          background: '#e6f7e6',
          borderRadius: 8,
          border: '1px solid #a3d9a3',
        }}
      >
        <strong style={{ color: '#2d862d' }}>🔄 Reactive Updates</strong>
        <p style={{ marginTop: 8, color: '#444', fontSize: 14 }}>
          Unlike <code style={{ background: '#fff', padding: '2px 4px' }}>getSafeAreaInset()</code>, this hook
          automatically updates when:
        </p>
        <ul style={{ marginTop: 8, color: '#444', fontSize: 14, paddingLeft: 20 }}>
          <li>Screen orientation changes (portrait ↔ landscape)</li>
          <li>Window is resized</li>
        </ul>
        <p style={{ marginTop: 8, color: '#444', fontSize: 14 }}>
          <strong>Try rotating your device</strong> to see the values update in real-time!
        </p>
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
          {`import { useSafeAreaInset } from '@react-simplikit/mobile';

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
}`}
        </pre>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3>Comparison with getSafeAreaInset</h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Feature</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #ddd' }}>getSafeAreaInset()</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #ddd' }}>useSafeAreaInset()</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>Type</td>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>Utility function</td>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>React hook</td>
            </tr>
            <tr>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>Auto-updates</td>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>❌ No</td>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>✅ Yes</td>
            </tr>
            <tr>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>Orientation change</td>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>Manual re-call needed</td>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>Automatic</td>
            </tr>
            <tr>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>Use case</td>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>One-time read</td>
              <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>Reactive UI</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: '#fff3e0',
          borderRadius: 8,
          border: '1px solid #ffcc80',
        }}
      >
        <strong style={{ color: '#e65100' }}>📱 Live Preview</strong>
        <p style={{ marginTop: 8, color: '#444', fontSize: 14 }}>
          The box below demonstrates safe area padding applied in real-time:
        </p>
        <div
          style={{
            marginTop: 12,
            padding: `${safeArea.top}px ${safeArea.right}px ${safeArea.bottom}px ${safeArea.left}px`,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 8,
            color: 'white',
            textAlign: 'center',
            minHeight: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span>
            Paddings: {safeArea.top}px / {safeArea.right}px / {safeArea.bottom}px / {safeArea.left}px
          </span>
        </div>
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
