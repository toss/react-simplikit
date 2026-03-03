import type { CSSProperties } from 'react';

type BaseProps = {
  style?: CSSProperties;
  [key: string]: unknown;
};

type TupleToIntersection<T extends Record<string, unknown>[]> = {
  [I in keyof T]: (x: T[I]) => void;
}[number] extends (x: infer I) => void
  ? I
  : never;

/**
 * @description
 * `mergeProps` is a utility function that merges multiple props objects into a single object.
 * It handles merging of `className`, `style`, and `function` properties.
 *
 * @template PropsList - The type of the props objects to merge.
 *
 * @param {PropsList} props - The props objects to merge.
 * @returns {TupleToIntersection<PropsList>} The merged props object.
 *
 * @example
 * const mergedProps = mergeProps({ className: 'foo', style: { color: 'red' } }, { className: 'bar', style: { backgroundColor: 'blue' } });
 * console.log(mergedProps); // { className: 'foo bar', style: { color: 'red', backgroundColor: 'blue' } }
 */
export function mergeProps<PropsList extends BaseProps[]>(...props: PropsList): TupleToIntersection<PropsList> {
  return props.reduce(pushProp, {}) as TupleToIntersection<PropsList>;
}

function pushProp(prev: BaseProps, curr: BaseProps): BaseProps {
  for (const key in curr) {
    if (curr[key] === undefined) continue;

    switch (key) {
      case 'className': {
        prev[key] = [prev[key], curr[key]].join(' ').trim();
        break;
      }
      case 'style': {
        prev[key] = mergeStyle(prev[key], curr[key]);
        break;
      }
      default: {
        const mergedFunction = mergeFunction(prev[key], curr[key]);

        if (mergedFunction) {
          prev[key] = mergedFunction;
        } else if (curr[key] !== undefined) {
          prev[key] = curr[key];
        }
      }
    }
  }
  return prev;
}

function mergeStyle(a?: CSSProperties, b?: CSSProperties): CSSProperties | undefined {
  if (a == null) return b;
  return { ...a, ...b };
}

function mergeFunction(a: unknown, b: unknown): ((...args: unknown[]) => void) | undefined {
  if (typeof a === 'function' && typeof b === 'function') {
    return (...args: unknown[]) => {
      a(...args);
      b(...args);
    };
  }
}
