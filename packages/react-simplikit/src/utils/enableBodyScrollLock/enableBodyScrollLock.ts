import { isServer } from '../isServer/index.ts';

/**
 * Data attribute key for storing scroll position
 */
const SCROLL_POSITION_ATTR = 'data-simplikit-scroll-y';

/**
 * Data attribute key for storing the inline styles the lock overrides
 */
const BODY_STYLE_ATTR = 'data-simplikit-body-style';

/**
 * Inline style properties the lock overrides.
 * `overflow` comes first so that its longhands, which keep a value set only on one axis, are applied after it.
 */
const LOCKED_STYLE_PROPERTIES = ['overflow', 'overflow-x', 'overflow-y', 'position', 'top', 'left', 'right', 'bottom'];

/**
 * @description
 * `enableBodyScrollLock` is a utility function that locks the body scroll.
 * It prevents the body from scrolling by applying fixed positioning.
 * This is useful when opening modals, drawers, or other overlay components.
 *
 * Safe to call in SSR environment (no-op on server).
 * Calling multiple times has no effect until unlocked.
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
  saveBodyStyles();
  applyScrollLockStyles(scrollY);
}

function isBodyScrollLocked(): boolean {
  return document.body.getAttribute(SCROLL_POSITION_ATTR) != null;
}

function saveScrollPosition(scrollY: number): void {
  document.body.setAttribute(SCROLL_POSITION_ATTR, scrollY.toString());
}

function saveBodyStyles(): void {
  const { body } = document;
  const saved = document.createElement('div').style;

  for (const property of LOCKED_STYLE_PROPERTIES) {
    saved.setProperty(property, body.style.getPropertyValue(property), body.style.getPropertyPriority(property));
  }

  body.setAttribute(BODY_STYLE_ATTR, saved.cssText);
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
