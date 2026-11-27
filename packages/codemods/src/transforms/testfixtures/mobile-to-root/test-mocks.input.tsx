import { vi, describe, it, expect } from 'vitest';
import * as mobile from '@react-simplikit/mobile';

vi.mock('@react-simplikit/mobile', async () => ({
  ...(await vi.importActual<typeof import('@react-simplikit/mobile')>('@react-simplikit/mobile')),
  isIOS: () => true,
}));

describe('@react-simplikit/mobile', () => {
  it('works', () => expect(mobile.isIOS()).toBe(true));
});
