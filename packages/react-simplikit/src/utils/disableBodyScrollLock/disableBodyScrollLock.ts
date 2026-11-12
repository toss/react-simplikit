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

  restoreBodyStyles();
  restoreScrollPosition(savedScrollY);
  clearSavedScrollPosition();
}

function restoreBodyStyles(): void {
  const { body } = document;
  // Parsing the saved declarations with a detached element keeps their `!important` priority and drops anything invalid.
  // Properties that were not set before the lock come back as an empty string, which `setProperty` removes.
  const saved = document.createElement('div').style;
  saved.cssText = body.getAttribute(BODY_STYLE_ATTR) ?? '';

  for (const property of LOCKED_STYLE_PROPERTIES) {
    body.style.setProperty(property, saved.getPropertyValue(property), saved.getPropertyPriority(property));
  }
}

function restoreScrollPosition(savedScrollY: string): void {
  const scrollY = Number(savedScrollY);

  if (Number.isNaN(scrollY)) {
    console.warn('[react-simplikit] Invalid scroll position, defaulting to 0');
    scrollToInstantly(0);
    return;
  }

  scrollToInstantly(scrollY);
}

// `window.scrollTo(x, y)` follows the CSS `scroll-behavior` of the page, so it animates under `scroll-behavior: smooth`.
// `behavior: 'instant'` jumps back to the saved position whatever the page sets.
function scrollToInstantly(top: number): void {
  window.scrollTo({ top, left: 0, behavior: 'instant' });
}

function clearSavedScrollPosition(): void {
  document.body.removeAttribute(SCROLL_POSITION_ATTR);
  document.body.removeAttribute(BODY_STYLE_ATTR);
}
