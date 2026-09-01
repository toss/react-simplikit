'use client';

import { useBodyScrollLock } from '@react-simplikit/mobile';
import type { ReactNode } from 'react';

/** Bottom sheet for list filters; locks background scroll while mounted. */
export function FilterSheet({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  useBodyScrollLock();

  return (
    <div role="dialog" aria-modal="true">
      <div onClick={onClose} data-testid="sheet-dim" />
      <section>{children}</section>
    </div>
  );
}
