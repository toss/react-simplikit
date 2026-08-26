export type SizeGate = {
  // Names the gate in output: one package can carry several entry points now.
  label: string;
  entry: string;
  // Per-module output means adding hooks never moves this number — only the
  // measured export's own code or cross-module leakage does — so the budget can
  // stay tight without taxing ordinary feature work. Set relative to the current
  // measured size per entry, not a shared flat ceiling.
  limitBytes: number;
};

export type TargetPackage = {
  name: string;
  dir: string;
  sizeGates: SizeGate[];
};

export const TARGET_PACKAGES: TargetPackage[] = [
  {
    name: 'react-simplikit',
    dir: 'packages/react-simplikit',
    sizeGates: [
      {
        label: 'root',
        entry: `export { useToggle } from 'react-simplikit';`,
        limitBytes: 256,
      },
      {
        label: 'mobile hook via root',
        entry: `export { useNetworkStatus } from 'react-simplikit';`,
        limitBytes: 768,
      },
    ],
  },
];
