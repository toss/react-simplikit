import type { SafeAreaInset } from '@react-simplikit/mobile';
declare module 'app' {
  import { isIOS } from '@react-simplikit/mobile';
  export const inset: SafeAreaInset;
  export const check: typeof isIOS;
}
declare global {
  interface Window { inset?: import('@react-simplikit/mobile').SafeAreaInset }
}
