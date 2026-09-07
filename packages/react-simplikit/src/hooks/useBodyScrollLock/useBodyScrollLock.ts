import { useEffect } from 'react';

import { disableBodyScrollLock } from '../../utils/disableBodyScrollLock/index.ts';
import { enableBodyScrollLock } from '../../utils/enableBodyScrollLock/index.ts';

/**
 * @description
 * `useBodyScrollLock` is a React hook that locks body scroll while the component is mounted.
 * It automatically locks on mount and unlocks on unmount.
 *
 * **Note:** For multiple overlapping modals, use a single lock at the parent level.
 *
 * @example
 * function Modal() {
 *   useBodyScrollLock();
 *   return <div className="modal">Modal content</div>;
 * }
 *
 * @example
 * // Multiple modals - single lock pattern
 * function BodyScrollLock() {
 *   useBodyScrollLock();
 *   return null;
 * }
 *
 * function App() {
 *   const hasModal = showModal1 || showModal2;
 *
 *   return (
 *     <>
 *       {hasModal && <BodyScrollLock />}
 *       {showModal1 && <Modal1 />}
 *       {showModal2 && <Modal2 />}
 *     </>
 *   );
 * }
 */
export function useBodyScrollLock(): void {
  useEffect(() => {
    enableBodyScrollLock();

    return () => {
      disableBodyScrollLock();
    };
  }, []);
}
