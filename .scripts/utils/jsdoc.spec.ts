import { describe, expect, it } from 'vitest';

import { readDeprecation } from './jsdoc.ts';

describe('readDeprecation', () => {
  it('reads @deprecated from the last comment in the file, which documents the export', () => {
    expect(
      readDeprecation(`/**
 * @description Does something.
 * @deprecated Use \`useNew\` instead.
 */
export function useOld() {}`)
    ).toBe('Use `useNew` instead.');
  });

  it('ignores @deprecated on an earlier comment, such as an options type', () => {
    expect(
      readDeprecation(`type Options = {
  /** @deprecated Use \`delay\` instead. */
  wait?: number;
};

/**
 * @description Does something.
 */
export function useCurrent(options: Options) {}`)
    ).toBeUndefined();
  });

  it('throws on a @deprecated that does not say what to use instead', () => {
    expect(() =>
      readDeprecation(`/**
 * @description Does something.
 * @deprecated
 */
export function useOld() {}`)
    ).toThrow('@deprecated must name the replacement in backticks');
  });

  it('throws on a @deprecated that names no replacement', () => {
    expect(() =>
      readDeprecation(`/**
 * @description Does something.
 * @deprecated Will be removed in v2.
 */
export function useOld() {}`)
    ).toThrow('@deprecated must name the replacement in backticks');
  });

  it('throws on a @deprecated that opens with {@link}, which the parser reads as a type', () => {
    expect(() =>
      readDeprecation(`/**
 * @description Does something.
 * @deprecated {@link useNew} instead.
 */
export function useOld() {}`)
    ).toThrow('@deprecated must name the replacement in backticks');
  });

  it('throws on a @deprecated that names the replacement with {@link}, which the skill catalog would show as written', () => {
    expect(() =>
      readDeprecation(`/**
 * @description Does something.
 * @deprecated Use {@link useNew} instead.
 */
export function useOld() {}`)
    ).toThrow('@deprecated must name the replacement in backticks');
  });
});
