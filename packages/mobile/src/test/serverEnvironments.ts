/* eslint-disable @typescript-eslint/no-explicit-any */
const KEYS = [
  'window',
  'document',
  'navigator',
  'location',
  'history',
  'localStorage',
  'sessionStorage',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'matchMedia',
  'ResizeObserver',
  'IntersectionObserver',
  'MutationObserver',
  'performance',
  'Event',
  'CustomEvent',
  'screen',
];

export function serverEnvironments<T>(callback: () => T) {
  const origins = KEYS.map(key => [key, globalThis[key as keyof typeof globalThis]]);

  try {
    origins.forEach(([key]) => {
      delete globalThis[key as keyof typeof globalThis];
    });

    return callback();
  } finally {
    origins.forEach(([key, value]) => {
      (globalThis as any)[key] = value;
    });
  }
}
