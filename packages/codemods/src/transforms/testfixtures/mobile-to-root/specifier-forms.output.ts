export async function load() {
  const mobile = await import('react-simplikit');
  const path = require.resolve('react-simplikit');
  type Inset = import('react-simplikit').SafeAreaInset;
  const x: Inset | undefined = undefined;
  return { mobile, path, x, tpl: require(`react-simplikit`) };
}
export * from 'react-simplikit';
export { isIOS as default } from 'react-simplikit';
