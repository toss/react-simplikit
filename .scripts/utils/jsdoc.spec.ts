import { describe, expect, it } from 'vitest';

import { readDeprecation, readNoDocs } from './jsdoc.ts';

describe('readNoDocs', () => {
  it('reads @no-docs from the last comment in the file, which documents the export', () => {
    expect(
      readNoDocs(`/**
 * @description Does something.
 * @no-docs
 */
export function useHidden() {}`)
    ).toBe(true);
  });

  it('reads @no-docs next to @deprecated', () => {
    expect(
      readNoDocs(`/**
 * @description The old name.
 * @no-docs
 * @deprecated Use \`useNew\` instead.
 */
export const useOld = useNew;`)
    ).toBe(true);
  });

  it('ignores @no-docs on an earlier comment, such as an options type', () => {
    expect(
      readNoDocs(`type Options = {
  /** @no-docs */
  wait?: number;
};

/**
 * @description Does something.
 */
export function useCurrent(options: Options) {}`)
    ).toBe(false);
  });

  it('is false for an export without the tag', () => {
    expect(
      readNoDocs(`/**
 * @description Does something.
 * @deprecated Use \`useNew\` instead.
 */
export function useOld() {}`)
    ).toBe(false);
  });
});

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

  it('keeps a Markdown link around the backticked replacement', () => {
    expect(
      readDeprecation(`/**
 * @description Does something.
 * @deprecated Use [\`useNew\`](https://react-simplikit.slash.page/hooks/useNew) instead.
 */
export function useOld() {}`)
    ).toBe('Use [`useNew`](https://react-simplikit.slash.page/hooks/useNew) instead.');
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
