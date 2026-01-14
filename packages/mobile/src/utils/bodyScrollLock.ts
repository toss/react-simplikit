import { isServer } from './isServer.ts';

/**
 * Data attribute key for storing scroll position
 */
const SCROLL_POSITION_ATTR = 'data-simplikit-scroll-y';

/**
 * Lock body scroll
 *
 * Prevents the body from scrolling by applying fixed positioning.
 * Safe to call in SSR environment (no-op on server).
 * Calling multiple times has no effect until unlocked.
 *
 * @example
 * ```ts
 * // When modal opens
 * enableBodyScrollLock();
 *
 * // When modal closes
 * disableBodyScrollLock();
 * ```
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

/**
 * Unlock body scroll
 *
 * Unlocks the scroll locked by enableBodyScrollLock() and
 * restores the saved scroll position.
 * Safe to call in SSR environment (no-op on server).
 * Safe to call even if not locked (no-op).
 *
 * @example
 * ```ts
 * // When modal closes
 * disableBodyScrollLock();
 * ```
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
