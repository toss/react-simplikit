import type { SafeAreaInset } from 'react-simplikit';
declare module 'app' {
  import { isIOS } from 'react-simplikit';
  export const inset: SafeAreaInset;
  export const check: typeof isIOS;
}
declare global {
  interface Window { inset?: import('react-simplikit').SafeAreaInset }
}
