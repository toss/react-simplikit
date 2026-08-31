import { describe, expect, it } from 'vitest';

import { describeError, ExecutionError, UsageError } from './errors.ts';

describe('errors', () => {
  it('maps each error class to its exit code', () => {
    expect(new UsageError('bad flag').exitCode).toBe(2);
    expect(new ExecutionError('write failed').exitCode).toBe(1);
  });

  it('keeps the message and a distinguishable name', () => {
    const error = new UsageError('bad flag');

    expect(error.message).toBe('bad flag');
    expect(error.name).toBe('UsageError');
    expect(new ExecutionError('write failed').name).toBe('ExecutionError');
  });

  it('describes both Error instances and anything else that was thrown', () => {
    expect(describeError(new Error('boom'))).toBe('boom');
    expect(describeError('boom')).toBe('boom');
  });
});
