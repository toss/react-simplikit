import { useCallback, useEffect, useRef } from 'react';

/**
 *
 *
 *
 * @description
 * window.setTimeout 를 편리하게 이용할 수 있는 hook 입니다.
 *
 * `useTimeout` 은 `전달받은 callback을 delay 만큼 지연 후 실행하는 훅입니다.
 * `useTimeout`을 사용하는 정확한 방법은 아래 Example을 참고해주시기 바랍니다.
 *
 * @example
 * function Example() {
 *   const [title, setTitle] = useState('');
 *
 *   useTimeout(() => {
 *     setTitle(`상품을 찾고있어요`);
 *   }, 2000);
 *
 *   useTimeout(() => {
 *     setTitle(`거의 다 끝났어요`);
 *   }, 4000);
 *
 *   return <div>{title}</div>;
 * }
 *
 */

export function useTimeout(callback: () => void, delay = 0) {
  const savedCallback = usePreservedCallback(callback);

  useEffect(() => {
    const timeoutId = window.setTimeout(savedCallback, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, savedCallback]);
}

// temporary implementation
function usePreservedCallback<Callback extends (...args: any[]) => any>(callback: Callback) {
  const callbackRef = useRef<Callback>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as Callback;
}
