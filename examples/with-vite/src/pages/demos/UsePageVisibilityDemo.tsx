import { useEffect, useRef, useState } from 'react';
import { Card, CodeBlock, InfoBox, StatusCard, StatusRow } from '@examples/shared';
import { usePageVisibility } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

const EXAMPLE_CODE = `import { usePageVisibility } from '@react-simplikit/mobile';

function VideoPlayer() {
  const { isVisible } = usePageVisibility();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Pause video when tab is hidden
    if (!isVisible) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  return <video ref={videoRef} src="video.mp4" controls />;
}`;

type VisibilityEvent = {
  timestamp: Date;
  isVisible: boolean;
  visibilityState: string;
};

export function UsePageVisibilityDemo() {
  const { isVisible, visibilityState } = usePageVisibility();
  const [events, setEvents] = useState<VisibilityEvent[]>([]);
  const [counter, setCounter] = useState(0);
  const counterRef = useRef<number | null>(null);

  // Log visibility change events
  useEffect(() => {
    setEvents(prev => [
      {
        timestamp: new Date(),
        isVisible,
        visibilityState,
      },
      ...prev.slice(0, 9), // Keep last 10 events
    ]);
  }, [isVisible, visibilityState]);

  // Counter that pauses when page is hidden
  useEffect(() => {
    if (isVisible) {
      counterRef.current = window.setInterval(() => {
        setCounter(prev => prev + 1);
      }, 1000);
    } else {
      if (counterRef.current !== null) {
        clearInterval(counterRef.current);
        counterRef.current = null;
      }
    }

    return () => {
      if (counterRef.current !== null) {
        clearInterval(counterRef.current);
      }
    };
  }, [isVisible]);

  return (
    <DemoLayout
      title="usePageVisibility"
      description="Detect when the page is visible or hidden (tab switch, minimize)"
    >
      <div style={{ paddingBottom: '128px' }}>
        {/* Status */}
        <StatusCard title="Visibility State" description="Real-time page visibility information">
          <StatusRow
            label="isVisible"
            value={isVisible ? 'true' : 'false'}
            variant={isVisible ? 'success' : 'error'}
            monospace
          />
          <StatusRow
            label="visibilityState"
            value={visibilityState}
            variant={visibilityState === 'visible' ? 'success' : 'warning'}
            monospace
          />
        </StatusCard>

        {/* Interactive Demo - Counter */}
        <Card title="1. Auto-Pause Counter">
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            This counter pauses when you switch tabs or minimize the browser
          </p>

          <div
            style={{
              padding: '32px',
              backgroundColor: isVisible ? '#ecfdf5' : '#fef2f2',
              borderRadius: '12px',
              textAlign: 'center',
              transition: 'background-color 300ms',
            }}
          >
            <p
              style={{
                fontSize: '48px',
                fontWeight: 700,
                margin: 0,
                color: isVisible ? '#059669' : '#dc2626',
              }}
            >
              {counter}
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
              {isVisible ? 'Counter is running...' : 'Counter is paused'}
            </p>
          </div>

          <div style={{ marginTop: '16px' }}>
            <InfoBox variant="tip">
              <strong>Try it:</strong> Switch to another tab, wait a few seconds, then come back. The counter pauses
              while the page is hidden.
            </InfoBox>
          </div>
        </Card>

        {/* Event Log */}
        <Card title="2. Visibility Change Log">
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            History of visibility state changes
          </p>

          {events.length === 0 ? (
            <div
              style={{
                padding: '24px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#6b7280',
              }}
            >
              Switch tabs to see events
            </div>
          ) : (
            <div
              style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            >
              {events.map((event, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px 16px',
                    borderBottom: index < events.length - 1 ? '1px solid #e5e7eb' : 'none',
                    backgroundColor: index === 0 ? '#f0f9ff' : 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: event.isVisible ? '#22c55e' : '#ef4444',
                      }}
                    />
                    <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>{event.visibilityState}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>{event.timestamp.toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Use Cases */}
        <Card title="Common Use Cases">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <InfoBox variant="neutral">
              <strong>Video/Audio:</strong> Pause media playback when the user switches tabs
            </InfoBox>
            <InfoBox variant="neutral">
              <strong>Analytics:</strong> Track time spent on page accurately
            </InfoBox>
            <InfoBox variant="neutral">
              <strong>Animations:</strong> Pause expensive animations to save battery
            </InfoBox>
            <InfoBox variant="neutral">
              <strong>Polling:</strong> Stop background data fetching when tab is hidden
            </InfoBox>
          </div>
        </Card>

        {/* Code */}
        <Card title="Implementation Code">
          <CodeBlock code={EXAMPLE_CODE} />
        </Card>
      </div>
    </DemoLayout>
  );
}
