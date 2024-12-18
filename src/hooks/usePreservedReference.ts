import { useMemo, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type NotNullishValue = {};

/**
 * @name usePreservedReference
 * @description
 * comparator로 비교했을 때 값이 변경되었을 때에만 레퍼런스를 변경하도록 합니다.
 *
 * 기본으로는 JSON.stringify를 했을 때 동일한 값이면 레퍼런스를 유지합니다.
 *
 * ```ts
 * import { usePreservedReference } from '@tossteam/react';
 *
 * // 값의 동일성을 검증을 JSON.stringify로 하는 검증 함수
 * function areDeeplyEqual<T extends NotNullishValue>(x: T, y: T) {
 *   return JSON.stringify(x) === JSON.stringify(y);
 * }
 *
 * function usePreservedReference<T extends NotNullishValue>(
 *   // 레퍼런스를 보존할 값
 *   value: T,
 *   // 값의 동일성을 검증하는 함수
 *   // default: areDeeplyEqual
 *   areValuesEqual: (a: T, b: T) => boolean = areDeeplyEqual
 * ): T
 * ```
 *
 * @example
 * const params = usePreservedReference(loggerParams, areParamsEqual);
 */
export function usePreservedReference<T extends NotNullishValue>(
  value: T,
  areValuesEqual: (a: T, b: T) => boolean = areDeeplyEqual
) {
  const ref = useRef(value);
  return useMemo(() => {
    if (!areValuesEqual(ref.current, value)) {
      ref.current = value;
    }
    return ref.current;
  }, [areValuesEqual, value]);
}

function areDeeplyEqual<T extends NotNullishValue>(x: T, y: T) {
  return JSON.stringify(x) === JSON.stringify(y);
}
