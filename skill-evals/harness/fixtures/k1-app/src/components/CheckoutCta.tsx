'use client';

import { useKeyboardHeight } from '@react-simplikit/mobile';
import type { ReactNode } from 'react';

/** Fixed bottom CTA that stays visible above the on-screen keyboard. */
export function CheckoutCta({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  const { keyboardHeight } = useKeyboardHeight();

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ position: 'fixed', left: 16, right: 16, bottom: 16 + keyboardHeight }}
    >
      {children}
    </button>
  );
}
