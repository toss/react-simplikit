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
 * `disableBodyScrollLock` is a utility function that unlocks the body scroll.
 * It restores the scroll locked by `enableBodyScrollLock` and returns to the saved scroll position.
 *
 * Safe to call in SSR environment (no-op on server).
 * Safe to call even if not locked (no-op).
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

  restoreBodyStyles(savedScrollY);
  restoreScrollPosition(savedScrollY);
  clearSavedScrollPosition();
}

function restoreBodyStyles(savedScrollY: string): void {
  const { body } = document;
  // Parsing the saved declarations with a detached element keeps their `!important` priority and drops anything invalid.
  // Properties that were not set before the lock come back as an empty string, which `setProperty` removes.
  const saved = document.createElement('div').style;
  saved.cssText = body.getAttribute(BODY_STYLE_ATTR) ?? '';
  // The values the lock applied, serialized the same way the body serializes them (e.g. `-0px` becomes `0px`).
  const locked = document.createElement('div').style;
  locked.overflow = 'hidden';
  locked.position = 'fixed';
  locked.top = `-${savedScrollY}px`;
  locked.left = '0px';
  locked.right = '0px';
  locked.bottom = '0px';

  // A property that no longer holds the lock value was changed by other code during the lock, so it is left alone.
  // Compare before restoring anything: restoring `overflow` also changes its longhands.
  const untouched = LOCKED_STYLE_PROPERTIES.filter(
    property => body.style.getPropertyValue(property) === locked.getPropertyValue(property)
  );

  for (const property of untouched) {
    body.style.setProperty(property, saved.getPropertyValue(property), saved.getPropertyPriority(property));
  }
}

function restoreScrollPosition(savedScrollY: string): void {
  let top = Number(savedScrollY);

  if (Number.isNaN(top)) {
    console.warn('[react-simplikit] Invalid scroll position, defaulting to 0');
    top = 0;
  }

  // Unlike `scrollTo(x, y)`, `behavior: 'instant'` does not follow the root element's `scroll-behavior: smooth`.
  window.scrollTo({ top, left: 0, behavior: 'instant' });
}

function clearSavedScrollPosition(): void {
  document.body.removeAttribute(SCROLL_POSITION_ATTR);
  document.body.removeAttribute(BODY_STYLE_ATTR);
}
