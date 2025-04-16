import { CSSProperties } from 'react';

type InlineStyle = CSSProperties | Record<string, number | string | undefined> | undefined;

/**
 * @description
 * Merges multiple inline style objects into a single style object.
 * Falsy values (such as `undefined`) are ignored.
 * If a property exists in multiple objects, the last one takes precedence.
 *
 * @param {Array<InlineStyle>} styles - A variadic list of style objects to merge. Each argument can be a `CSSProperties` object or a plain object with string keys and values of type `string | number | undefined`. `undefined` values are ignored.
 *
 * @returns {InlineStyle} A single merged style object. Returns `undefined` if all inputs are falsy or the merged object is empty.
 *
 * @example
 * ```ts
 * // Logic usage
 * const style1 = { color: 'red', fontSize: '14px' };
 * const style2 = { fontWeight: 'bold', fontSize: '16px' };
 *
 * const result = mergeStyles(style1, style2);
 * // result: { color: 'red', fontSize: '16px', fontWeight: 'bold' }
 * ```
 *
 * @example
 * ```tsx
 * // React usage (merged without overrides)
 * const baseStyle = { color: 'blue' };
 * const textStyle = { fontSize: '18px' };
 *
 * export function StyledComponent() {
 *   return <div style={mergeStyles(baseStyle, textStyle)}>Styled Text</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // React usage (merged with overrides)
 * const style1 = { color: 'blue', fontSize: '14px' };
 * const style2 = { color: 'green', fontWeight: 'bold' };
 *
 * export function OverriddenStyleComponent() {
 *   return <div style={mergeStyles(style1, style2)}>Styled Text</div>;
 *   // final style: { color: 'green', fontSize: '14px', fontWeight: 'bold' }
 * }
 * ```
 */
export function mergeStyles(...styles: Array<InlineStyle>): InlineStyle {
  let mergedStyle: InlineStyle = {};

  for (const style of styles) {
    if (style) {
      mergedStyle = { ...mergedStyle, ...style };
    }
  }

  return Object.keys(mergedStyle).length ? mergedStyle : undefined;
}
