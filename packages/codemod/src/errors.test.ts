import { describe, expect, it } from 'vitest';

import { describeError } from './errors.ts';

describe('describeError', () => {
  it('describes both Error instances and anything else that was thrown', () => {
    expect(describeError(new Error('boom'))).toBe('boom');
    expect(describeError('boom')).toBe('boom');
  });
});
