export type TargetPackage = {
  name: string;
  dir: string;
  sizeEntry: string;
  // Per-module output means adding hooks never moves this number — only the
  // measured export's own code or cross-module leakage does — so the budget can
  // stay tight without taxing ordinary feature work. Set relative to the current
  // measured size per package, not a shared flat ceiling.
  sizeLimitBytes: number;
};

export const TARGET_PACKAGES: TargetPackage[] = [
  {
    name: 'react-simplikit',
    dir: 'packages/core',
    sizeEntry: `export { useToggle } from 'react-simplikit';`,
    sizeLimitBytes: 256,
  },
  {
    name: '@react-simplikit/mobile',
    dir: 'packages/mobile',
    sizeEntry: `export { useNetworkStatus } from '@react-simplikit/mobile';`,
    sizeLimitBytes: 768,
  },
];
