import { useEffect } from 'react';

import { disableBodyScrollLock, enableBodyScrollLock } from '../../utils/bodyScrollLock.ts';

/**
 * Hook to lock body scroll
 *
 * Automatically locks body scroll when mounted,  unlocks when unmounted.
 *
 * **Note:** For multiple overlapping modals, use a single lock at the parent level.
 *
 * @example
 * ```tsx
 * function Modal() {
 *   useBodyScrollLock();
 *   return <div className="modal">Modal content</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
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
 * ```
 */
export function useBodyScrollLock(): void {
  useEffect(() => {
    enableBodyScrollLock();

    return () => {
      disableBodyScrollLock();
    };
  }, []);
}
