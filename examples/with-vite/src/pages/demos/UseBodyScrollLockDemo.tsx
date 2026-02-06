import { useEffect, useState } from 'react';
import { Button, Card, CodeBlock, Dialog, StatusCard, StatusRow } from '@examples/shared';
import { useBodyScrollLock } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

export function UseBodyScrollLockDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(function handleScroll() {
    function handleScrollEvent() {
      setScrollY(window.scrollY);
    }
    window.addEventListener('scroll', handleScrollEvent);
    return function cleanupScroll() {
      window.removeEventListener('scroll', handleScrollEvent);
    };
  }, []);

  return (
    <DemoLayout title="useBodyScrollLock" description="Prevents background scroll when modal is open.">
      <div style={{ paddingBottom: '128px' }}>
        {/* Status */}
        <StatusCard title="Status">
          <StatusRow
            label="Body Scroll"
            value={isOpen ? '🔒 Locked' : '🔓 Unlocked'}
            variant={isOpen ? 'error' : 'success'}
          />
          <StatusRow label="Scroll Y" value={`${Math.round(scrollY)}px`} monospace />
        </StatusCard>

        {/* Demo */}
        <Card title="Demo">
          <Button onClick={() => setIsOpen(true)} fullWidth>
            Open Modal
          </Button>
        </Card>

        {/* Scroll Test Area */}
        <Card title="Scroll Test">
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            Try scrolling this page while the modal is open.
          </p>
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
              {i + 1}. Lorem ipsum dolor sit amet.
            </p>
          ))}
        </Card>

        {/* Code */}
        <Card title="Usage">
          <CodeBlock code={EXAMPLE_CODE} />
        </Card>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen} title="Modal">
        {isOpen ? <ModalContent onClose={() => setIsOpen(false)} /> : null}
      </Dialog>
    </DemoLayout>
  );
}

const EXAMPLE_CODE = `import { useBodyScrollLock } from '@react-simplikit/mobile';

function Modal({ onClose }) {
  // Lock body scroll when modal mounts
  useBodyScrollLock();

  return (
    <div className="modal">
      <p>Body scroll is locked!</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      {isOpen ? <Modal onClose={() => setIsOpen(false)} /> : null}
    </>
  );
}`;

/** Lock body scroll inside modal */
function ModalContent({ onClose }: { onClose: () => void }) {
  useBodyScrollLock();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>
        Body scroll is now locked. Try scrolling the background page.
      </p>

      {/* Scrollable area inside modal */}
      <div
        style={{
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: '#f9fafb',
          padding: '16px',
          borderRadius: '8px',
        }}
      >
        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>This area is scrollable</p>
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i} style={{ fontSize: '14px', marginBottom: '8px' }}>
            Modal content line {i + 1}
          </p>
        ))}
      </div>

      <Button onClick={onClose} fullWidth>
        Close
      </Button>
    </div>
  );
}
