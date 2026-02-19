import { isServer } from '../isServer/index.ts';

/**
 * Data attribute key for storing scroll position
 */
const SCROLL_POSITION_ATTR = 'data-simplikit-scroll-y';

/**
 * @description
 * `disableBodyScrollLock` is a utility function that unlocks the body scroll.
 * It restores the scroll locked by `enableBodyScrollLock` and returns to the saved scroll position.
 *
 * Safe to call in SSR environment (no-op on server).
 * Safe to call even if not locked (no-op).
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
export function disableBodyScrollLock(): void {
  if (isServer()) {
    return;
  }

  const savedScrollY = document.body.getAttribute(SCROLL_POSITION_ATTR);

  if (savedScrollY == null) {
    return;
  }

  removeScrollLockStyles();
  restoreScrollPosition(savedScrollY);
  clearSavedScrollPosition();
}

function removeScrollLockStyles(): void {
  const { body } = document;
  body.style.removeProperty('overflow');
  body.style.removeProperty('position');
  body.style.removeProperty('top');
  body.style.removeProperty('left');
  body.style.removeProperty('right');
  body.style.removeProperty('bottom');
}

function restoreScrollPosition(savedScrollY: string): void {
  const scrollY = Number(savedScrollY);

  if (Number.isNaN(scrollY)) {
    console.warn('[@react-simplikit/mobile] Invalid scroll position, defaulting to 0');
    window.scrollTo(0, 0);
    return;
  }

  window.scrollTo(0, scrollY);
}

function clearSavedScrollPosition(): void {
  document.body.removeAttribute(SCROLL_POSITION_ATTR);
}
