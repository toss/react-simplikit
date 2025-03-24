import { describe, it } from 'vitest';
import { getBundleSize } from './utils/analysisBundleSize.ts';

describe('check total bundle size', () => {
  it('react-use', async () => {
    const size = await getBundleSize('react-use');
    console.log(size);
  });

  it('usehooks-ts', async () => {
    const size = await getBundleSize('usehooks-ts');
    console.log(size);
  });

  it('@react-hookz/web', async () => {
    const size = await getBundleSize('@react-hookz/web');
    console.log(size);
  });

  it('reactive-kit', async () => {
    const size = await getBundleSize('reactive-kit');
    console.log(size);
  });
});
