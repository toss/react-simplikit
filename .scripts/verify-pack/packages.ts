export type TargetPackage = {
  name: string;
  dir: string;
  sizeEntry: string;
};

export const TARGET_PACKAGES: TargetPackage[] = [
  { name: 'react-simplikit', dir: 'packages/core', sizeEntry: `export { useToggle } from 'react-simplikit';` },
  {
    name: '@react-simplikit/mobile',
    dir: 'packages/mobile',
    sizeEntry: `export { useNetworkStatus } from '@react-simplikit/mobile';`,
  },
];
