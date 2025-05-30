import { useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

/**
 * @description
 * `useIsMounted` is a React hook that provides a stable function to determine if a component is currently mounted.
 * This is useful when performing asynchronous operations and you want to prevent state updates on unmounted components.
 *
 * Internally, it tracks the component's mount and unmount lifecycle using a ref,
 * and returns a memoized function that always reflects the latest mounted state.
 *
 * @returns {() => boolean} A stable function that returns `true` if the component is mounted, otherwise `false`.
 *
 * @example
 * function ProfileLoader() {
 *   const [profile, setProfile] = useState(null);
 *   const isMounted = useIsMounted();
 *
 *   useEffect(() => {
 *     fetchUserProfile().then((data) => {
 *       if (!isMounted()) return;
 *       setProfile(data);
 *     });
 *   }, []);
 *
 *   return profile ? <Profile data={profile} /> : <Spinner />;
 * }
 *
 * @example
 * function Timeout() {
 *   const [ready, setReady] = useState(false);
 *   const isMounted = useIsMounted();
 *
 *   useEffect(() => {
 *     const timer = setTimeout(() => {
 *       if (isMounted()) {
 *         setReady(true);
 *       }
 *     }, 1000);
 *     return () => clearTimeout(timer);
 *   }, []);
 *
 *   return <div>{ready ? 'Ready!' : 'Loading...'}</div>;
 * }
 */
export function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return usePreservedCallback(() => isMounted.current);
}
