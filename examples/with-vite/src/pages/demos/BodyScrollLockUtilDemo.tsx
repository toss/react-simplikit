import { useEffect, useState } from 'react';
import { Button, Card, CodeBlock, InfoBox, StatusCard, StatusRow } from '@examples/shared';
import { disableBodyScrollLock, enableBodyScrollLock } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

const HOOK_CODE = `function Modal() {
  useBodyScrollLock();
  return <div>Modal</div>;
}`;

const UTIL_CODE = `const handleClick = () => {
  enableBodyScrollLock();
};`;

export function BodyScrollLockUtilDemo() {
  const [locked, setLocked] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(function () {
    function handleScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return function () {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function handleToggle() {
    if (locked) {
      disableBodyScrollLock();
      setLocked(false);
    } else {
      enableBodyScrollLock();
      setLocked(true);
    }
  }

  function handleForceLock() {
    enableBodyScrollLock();
    setLocked(true);
  }

  function handleForceUnlock() {
    disableBodyScrollLock();
    setLocked(false);
  }

  return (
    <DemoLayout title="bodyScrollLock Utils" description="Programmatically control body scroll lock">
      <div style={{ paddingBottom: '128px' }}>
        {/* Status */}
        <StatusCard title="Lock Status" description="Current scroll lock state">
          <StatusRow
            label="State"
            value={locked ? '🔒 LOCKED' : '🔓 UNLOCKED'}
            variant={locked ? 'error' : 'success'}
          />
          <StatusRow label="Scroll Y" value={`${Math.round(scrollY)}px`} monospace />
        </StatusCard>

        {/* Controls */}
        <Card title="Controls">
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Test the scroll lock utilities</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Button onClick={handleToggle} fullWidth>
              {locked ? 'Unlock Scroll' : 'Lock Scroll'}
            </Button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <Button onClick={handleForceLock} variant="secondary">
                Force Lock
              </Button>
              <Button onClick={handleForceUnlock} variant="secondary">
                Force Unlock
              </Button>
            </div>

            <InfoBox variant="info">
              <h4 style={{ fontWeight: 600, marginBottom: '8px', margin: 0 }}>How to test:</h4>
              <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Click &quot;Lock Scroll&quot; and try to scroll - it won&apos;t work</li>
                <li>Click &quot;Unlock Scroll&quot; to restore scrolling</li>
                <li>Try Force Lock/Unlock for direct control</li>
              </ol>
            </InfoBox>
          </div>
        </Card>

        {/* Comparison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title="useBodyScrollLock Hook">
            <StatusCard title="Use when:" description="">
              <StatusRow label="Lifecycle" value="Lock tied to component" />
              <StatusRow label="Use case" value="Modals, drawers" />
              <StatusRow label="Cleanup" value="Automatic on unmount" />
            </StatusCard>
            <CodeBlock code={HOOK_CODE} />
          </Card>

          <Card title="Utils (Current Demo)">
            <StatusCard title="Use when:" description="">
              <StatusRow label="Control" value="Need programmatic control" />
              <StatusRow label="Logic" value="Complex lock/unlock" />
              <StatusRow label="Scope" value="Outside React components" />
            </StatusCard>
            <CodeBlock code={UTIL_CODE} />
          </Card>
        </div>

        {/* Scrollable Content */}
        <Card title="Scrollable Content">
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            Test area - try scrolling when locked
          </p>
          <div
            style={{
              maxHeight: '256px',
              overflowY: 'auto',
              backgroundColor: '#f9fafb',
              padding: '16px',
              borderRadius: '8px',
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} style={{ fontSize: '14px', marginBottom: '8px' }}>
                Line {i + 1}: Lorem ipsum dolor sit amet.
              </p>
            ))}
          </div>
        </Card>
      </div>
    </DemoLayout>
  );
}
