import { Card, CodeBlock, InfoBox, StatusCard, StatusRow } from '@examples/shared';
import { useScrollDirection } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

const EXAMPLE_CODE = `import { useScrollDirection } from '@react-simplikit/mobile';

function Header() {
  const { direction, position } = useScrollDirection();

  // Hide header on scroll down (after 100px threshold)
  const isHidden = direction === 'down' && position > 100;

  return (
    <nav
      style={{
        transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 300ms',
      }}
    >
      <h1>My Header</h1>
    </nav>
  );
}`;

export function UseScrollDirectionDemo() {
  const { direction, position } = useScrollDirection({ throttleMs: 50 });

  // Key pattern: hide when scrolling down and past threshold
  const isHidden = direction === 'down' && position > 100;

  return (
    <div>
      {/* Fixed Navigation Bar - THIS IS THE KEY DEMO */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#2563eb',
          color: '#fff',
          padding: '16px',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
          zIndex: 50,
          transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          style={{
            maxWidth: '672px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Demo Navigation</h1>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>
            {direction === 'down' && 'Down'}
            {direction === 'up' && 'Up'}
            {direction === null && '-'}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ paddingTop: '80px' }}>
        <DemoLayout title="useScrollDirection" description="Auto-hide navigation bar on scroll down, show on scroll up">
          <div style={{ paddingBottom: '128px' }}>
            {/* Status */}
            <StatusCard title="Scroll State" description="Real-time scroll direction and position">
              <StatusRow label="Direction" value={direction || 'none'} monospace />
              <StatusRow label="Position" value={`${Math.round(position)}px`} monospace />
              <StatusRow label="Nav Hidden" value={isHidden ? 'Yes' : 'No'} variant={isHidden ? 'error' : 'success'} />
            </StatusCard>

            {/* Instructions */}
            <Card title="How it works">
              <InfoBox variant="info">
                <h4 style={{ fontWeight: 600, marginBottom: '8px', margin: 0 }}>Instructions:</h4>
                <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Scroll down - the navigation bar will hide</li>
                  <li>Scroll up - the navigation bar will reappear</li>
                  <li>Effect only activates after scrolling past 100px</li>
                </ol>
              </InfoBox>

              <div
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  borderLeft: '4px solid #2563eb',
                  backgroundColor: '#f9fafb',
                }}
              >
                <p style={{ fontSize: '14px', margin: 0 }}>
                  <strong>Use Case:</strong> Common in mobile apps to maximize screen real estate. Navigation hides when
                  reading (scroll down) and appears when navigating (scroll up).
                </p>
              </div>
            </Card>

            {/* Demo Sections */}
            {[1, 2, 3, 4, 5].map(num => (
              <Card key={num} title={`Section ${num}`} style={{ minHeight: '300px' }}>
                <p style={{ marginBottom: '16px' }}>Keep scrolling to test the auto-hide navigation.</p>
                <StatusRow label="Direction" value={direction || 'none'} monospace />
                <StatusRow label="Position" value={`${Math.round(position)}px`} monospace />
              </Card>
            ))}

            {/* Code */}
            <Card title="Implementation Code">
              <CodeBlock code={EXAMPLE_CODE} />
            </Card>
          </div>
        </DemoLayout>
      </div>
    </div>
  );
}
