import { useEffect, useState } from 'react';
import { Button, Card, CodeBlock, Dialog, InfoBox, StatusCard, StatusRow } from '@examples/shared';
import { useBodyScrollLock } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

/** Lock wrapper - this is the key pattern */
function BodyScrollLock() {
  useBodyScrollLock();
  return null;
}

const EXAMPLE_CODE = `import { useState } from 'react';
import { useBodyScrollLock } from '@react-simplikit/mobile';

// ✅ Correct: Single lock wrapper
function BodyScrollLock() {
  useBodyScrollLock();
  return null;
}

function App() {
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const hasModal = showModal1 || showModal2;

  return (
    <>
      {/* Single lock at parent level */}
      {hasModal && <BodyScrollLock />}

      {showModal1 && (
        <Modal onClose={() => setShowModal1(false)}>
          <button onClick={() => setShowModal2(true)}>
            Open Modal 2
          </button>
        </Modal>
      )}
    </>
  );
}`;

export function UseBodyScrollLockDemo() {
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(function () {
    function handleScroll() {
      setScrollPosition(window.scrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return function () {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Key pattern: single lock when any modal is open
  const hasModal = showModal1 || showModal2;

  return (
    <DemoLayout
      title="useBodyScrollLock"
      description="Prevent body scroll when modals are open. Demonstrates nested modals with correct lock pattern."
    >
      {/* Single lock at parent level - THIS IS THE KEY PATTERN */}
      {hasModal && <BodyScrollLock />}

      <div style={{ paddingBottom: '128px' }}>
        {/* Status */}
        <StatusCard title="Lock State" description="Real-time body scroll lock status">
          <StatusRow label="Modal 1" value={showModal1 ? 'Open' : 'Closed'} variant={showModal1 ? 'success' : 'muted'} />
          <StatusRow label="Modal 2" value={showModal2 ? 'Open' : 'Closed'} variant={showModal2 ? 'success' : 'muted'} />
          <StatusRow
            label="Body Locked"
            value={hasModal ? '🔒 Locked' : '🔓 Unlocked'}
            variant={hasModal ? 'error' : 'muted'}
          />
          <StatusRow label="Scroll Y" value={`${Math.round(scrollPosition)}px`} monospace />
        </StatusCard>

        {/* Demo */}
        <Card title="Demo: Nested Modals">
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            Click the button below to open Modal 1. Inside Modal 1, you can open Modal 2.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <InfoBox variant="info">
              <strong>Key Pattern:</strong> Use a single{' '}
              <code style={{ backgroundColor: '#dbeafe', padding: '2px 4px', borderRadius: '4px' }}>
                useBodyScrollLock()
              </code>{' '}
              at the parent level when any modal is open, rather than individual locks in each modal.
            </InfoBox>

            <Button onClick={() => setShowModal1(true)} fullWidth>
              Open Modal 1
            </Button>

            {/* Scrollable test area */}
            <div
              style={{
                marginTop: '8px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                maxHeight: '256px',
                overflowY: 'auto',
              }}
            >
              <h4 style={{ fontWeight: 600, marginBottom: '8px', margin: 0 }}>Scroll this content</h4>
              <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
                Try scrolling. When a modal is open, body scroll will be locked.
              </p>
              {Array.from({ length: 15 }).map((_, i) => (
                <p key={i} style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
                  Line {i + 1}: Lorem ipsum dolor sit amet.
                </p>
              ))}
            </div>
          </div>
        </Card>

        {/* Code */}
        <Card title="Implementation Code">
          <CodeBlock code={EXAMPLE_CODE} />
        </Card>
      </div>

      {/* Modal 1 */}
      <Dialog open={showModal1} onOpenChange={setShowModal1} title="Modal 1">
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
          This is Modal 1. Body scroll is now locked.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Button onClick={() => setShowModal2(true)} fullWidth>
            Open Modal 2 (Nested)
          </Button>
          <div
            style={{ maxHeight: '150px', overflowY: 'auto', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '4px' }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <p key={i} style={{ fontSize: '14px', marginBottom: '8px' }}>
                Modal 1 content line {i + 1}
              </p>
            ))}
          </div>
        </div>
      </Dialog>

      {/* Modal 2 */}
      <Dialog open={showModal2} onOpenChange={setShowModal2} title="Modal 2 (Nested)">
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
          This is Modal 2, opened from Modal 1.
        </p>
        <InfoBox variant="tip">
          <strong>Tip:</strong> Close this modal first, then Modal 1. Body scroll unlocks only when both are closed.
        </InfoBox>
      </Dialog>
    </DemoLayout>
  );
}
