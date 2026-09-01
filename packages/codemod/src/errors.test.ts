import { describe, expect, it } from 'vitest';

import { describeError, describeFailure } from './errors.ts';

describe('describeError', () => {
  it('describes both Error instances and anything else that was thrown', () => {
    expect(describeError(new Error('boom'))).toBe('boom');
    expect(describeError('boom')).toBe('boom');
  });
});

describe('describeFailure', () => {
  it('explains an unparseable manifest instead of quoting the parser', () => {
    const reason = describeFailure(new SyntaxError("Expected ':' after property name in JSON at position 46"));

    expect(reason).toContain('valid JSON');
    expect(reason).not.toContain('position 46');
  });

  it('explains a permission error and what to do', () => {
    const denied = Object.assign(new Error("EACCES: permission denied, open '/x/b.ts'"), { code: 'EACCES' });

    expect(describeFailure(denied)).toContain('write permission');
  });

  it('falls back to the original message for anything else', () => {
    expect(describeFailure(new Error('something odd'))).toBe('something odd');
  });
});
