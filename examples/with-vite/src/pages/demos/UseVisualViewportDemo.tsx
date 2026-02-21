import { useState } from 'react';
import { Button, Card, CodeBlock, InfoBox, StatusCard, StatusRow } from '@examples/shared';
import { useVisualViewport } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

const EXAMPLE_CODE = `import { useVisualViewport } from '@react-simplikit/mobile';

function CustomLayout() {
  const { viewport } = useVisualViewport();

  if (!viewport) {
    return <div>Not supported</div>;
  }

  const { width, height, offsetTop, scale } = viewport;
  const keyboardHeight = -offsetTop;
  const isZoomed = scale > 1.3;

  return (
    <div style={{ height }}>
      {!isZoomed && <FloatingButton />}
      <div style={{ paddingBottom: keyboardHeight }}>
        Content
      </div>
    </div>
  );
}`;

export function UseVisualViewportDemo() {
  const { viewport } = useVisualViewport();
  const [inputValue, setInputValue] = useState('');

  if (!viewport) {
    return (
      <DemoLayout title="useVisualViewport" description="Visual Viewport API not supported">
        <Card>
          <InfoBox variant="warning">
            <p style={{ margin: 0 }}>
              <strong>Your browser doesn&apos;t support the Visual Viewport API.</strong>
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px', marginBottom: 0 }}>
              <li>iOS Safari 13+</li>
              <li>Android Chrome 61+</li>
              <li>Desktop Chrome/Edge (limited)</li>
            </ul>
          </InfoBox>
        </Card>
      </DemoLayout>
    );
  }

  const { width, height, offsetTop, scale } = viewport;
  const keyboardHeight = -offsetTop;
  const isZoomed = scale > 1.3;
  const isKeyboardOpen = keyboardHeight > 0;

  return (
    <DemoLayout
      title="useVisualViewport"
      description="Track Visual Viewport changes: keyboard, zoom, and viewport dimensions"
    >
      <div style={{ paddingBottom: '384px' }}>
        {/* Status */}
        <StatusCard title="Visual Viewport State" description="Real-time viewport information">
          <StatusRow label="Width" value={`${Math.round(width)}px`} monospace />
          <StatusRow label="Height" value={`${Math.round(height)}px`} monospace />
          <StatusRow
            label="Offset Top"
            value={`${Math.round(offsetTop)}px`}
            variant={offsetTop !== 0 ? 'warning' : 'default'}
            monospace
          />
          <StatusRow
            label="Scale"
            value={`${scale.toFixed(2)}x`}
            variant={scale !== 1 ? 'warning' : 'default'}
            monospace
          />
          <StatusRow
            label="Keyboard Height (iOS)"
            value={`${Math.round(keyboardHeight)}px`}
            variant={keyboardHeight > 0 ? 'success' : 'default'}
            monospace
          />
        </StatusCard>

        {/* Keyboard Test */}
        <Card title="1. Keyboard Height Detection (iOS)">
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Tap the input to show keyboard</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              placeholder="Tap here to show keyboard"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                border: `2px solid ${isKeyboardOpen ? '#3b82f6' : '#d1d5db'}`,
                borderRadius: '8px',
                backgroundColor: isKeyboardOpen ? '#fef3c7' : 'white',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            {isKeyboardOpen && (
              <InfoBox variant="tip">
                <strong>Keyboard is open!</strong> Height: {Math.round(keyboardHeight)}px
              </InfoBox>
            )}

            <InfoBox variant="neutral">
              <strong>Platform Behavior:</strong>
              <br />
              <strong>iOS:</strong> offsetTop becomes negative when keyboard appears
              <br />
              <strong>Android:</strong> offsetTop typically remains 0
            </InfoBox>
          </div>
        </Card>

        {/* Zoom Test */}
        <Card title="2. Pinch-Zoom Detection">
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Pinch-zoom in/out on this page</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '32px', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>Current Zoom: {scale.toFixed(2)}x</p>
              <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '8px' }}>
                {scale === 1 && 'Normal (1.0x)'}
                {scale > 1 && scale <= 1.3 && 'Zoomed In (1.3x)'}
                {scale > 1.3 && 'Heavily Zoomed (> 1.3x)'}
              </p>
            </div>

            {isZoomed && (
              <InfoBox variant="warning">
                <strong>Heavy zoom detected!</strong> Floating UI hidden.
              </InfoBox>
            )}
          </div>
        </Card>

        {/* Code */}
        <Card title="Implementation Code">
          <CodeBlock code={EXAMPLE_CODE} />
        </Card>
      </div>

      {/* Floating Button - hidden when zoomed */}
      {!isZoomed && (
        <Button
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            padding: 0,
          }}
        >
          FAB
        </Button>
      )}
    </DemoLayout>
  );
}
