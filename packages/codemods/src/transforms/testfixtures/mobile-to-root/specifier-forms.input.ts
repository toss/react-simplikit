export async function load() {
  const mobile = await import('@react-simplikit/mobile');
  const path = require.resolve('@react-simplikit/mobile');
  type Inset = import('@react-simplikit/mobile').SafeAreaInset;
  const x: Inset | undefined = undefined;
  return { mobile, path, x, tpl: require(`@react-simplikit/mobile`) };
}
export * from '@react-simplikit/mobile';
export { isIOS as default } from '@react-simplikit/mobile';
