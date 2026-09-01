'use client';

import { useKeyboardHeight } from 'react-simplikit/mobile';

/** Sticky pay bar; offsets itself by the keyboard height on mobile web. */
export function PayBar({ total, onPay }: { total: string; onPay: () => void }) {
  const { keyboardHeight } = useKeyboardHeight();

  return (
    <footer style={{ position: 'fixed', left: 0, right: 0, bottom: keyboardHeight }}>
      <span>{total}</span>
      <button type="button" onClick={onPay}>
        결제하기
      </button>
    </footer>
  );
}
