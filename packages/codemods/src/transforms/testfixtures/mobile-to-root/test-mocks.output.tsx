import { vi, describe, it, expect } from 'vitest';
import * as mobile from 'react-simplikit';

vi.mock('react-simplikit', async () => ({
  ...(await vi.importActual<typeof import('react-simplikit')>('react-simplikit')),
  isIOS: () => true,
}));

describe('@react-simplikit/mobile', () => {
  it('works', () => expect(mobile.isIOS()).toBe(true));
});
