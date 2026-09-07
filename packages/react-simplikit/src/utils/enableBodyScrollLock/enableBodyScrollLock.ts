import { isServer } from '../isServer/index.ts';

/**
 * Data attribute key for storing scroll position
 */
const SCROLL_POSITION_ATTR = 'data-simplikit-scroll-y';

/**
 * @description
 * `enableBodyScrollLock` is a utility function that locks the body scroll.
 * It prevents the body from scrolling by applying fixed positioning.
 * This is useful when opening modals, drawers, or other overlay components.
 *
 * Safe to call in SSR environment (no-op on server).
 * Calling multiple times has no effect until unlocked.
 *
 * @returns {void}
 *
 * @example
 * // When modal opens
 * enableBodyScrollLock();
 *
 * // When modal closes
 * disableBodyScrollLock();
 */
export function enableBodyScrollLock(): void {
  if (isServer()) {
    return;
  }

  if (isBodyScrollLocked()) {
    return;
  }

  const scrollY = window.scrollY;
  saveScrollPosition(scrollY);
  applyScrollLockStyles(scrollY);
}

function isBodyScrollLocked(): boolean {
  return document.body.getAttribute(SCROLL_POSITION_ATTR) != null;
}

function saveScrollPosition(scrollY: number): void {
  document.body.setAttribute(SCROLL_POSITION_ATTR, scrollY.toString());
}

function applyScrollLockStyles(scrollY: number): void {
  const { body } = document;
  body.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.left = '0px';
  body.style.right = '0px';
  body.style.bottom = '0px';
}
