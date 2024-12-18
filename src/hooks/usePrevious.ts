import { useRef } from 'react';

import { useFirstMountState } from './_internal/useFirstMountState.ts';

const strictEquals = <T>(prev: T | undefined, next: T) => prev === next;

type PreviousOptionsWithoutInitial<T> = {
  compare?: (prev: T | undefined, next: T) => boolean;
  withoutCompare?: boolean;
  withInitialValue?: false;
};

type PreviousOptionsWithInitial<T> = {
  compare?: (prev: T, next: T) => boolean;
  withoutCompare?: boolean;
  withInitialValue: true;
};

type PreviousOptions<T> = PreviousOptionsWithoutInitial<T> | PreviousOptionsWithInitial<T>;

/**
 * Returns the previous value of the input state.
 * If re-rendering occured but value of state is not changed, the previous value will not be updated. If you want to update it, set `options.withoutCompare` to `true`.
 * If the state is of object type or if a separate logic is needed to detect changes in value, pass `options.compare` function.
 * If no compare function is provided, the default comparison `prev === next` will be used.
 *
 * @template T - The type of state.
 * @param {T} state - The state to get previous value.
 * @returns previous value of the state
 */
export function usePrevious<T>(state: T): T | undefined;

/**
 * Returns the previous value of the input state.
 * If re-rendering occured but value of state is not changed, the previous value will not be updated. If you want to update it, set `options.withoutCompare` to `true`.
 * If the state is of object type or if a separate logic is needed to detect changes in value, pass `options.compare` function.
 * If no compare function is provided, the default comparison `prev === next` will be used.
 *
 * @template T - The type of state.
 * @param {T} state - The state to get previous value.
 * @param {PreviousOptions<T>} options - The options object
 * @param {(prev: T | undefined, next: T) => boolean} options.compare - The comparison function to detect that state has been changed.
 * @param {boolean} options.withoutCompare - Set `withoutCompare` to `true` when previous value always need to be updated.
 * @param {boolean} options.withInitialValue - Set `withInitialValue` to `true` when initial value of previous should be initial value of state.
 * @returns previous value of the state
 */
export function usePrevious<T>(state: T, options: PreviousOptionsWithoutInitial<T>): T | undefined;

/**
 * Returns the previous value of the input state.
 * If re-rendering occured but value of state is not changed, the previous value will not be updated. If you want to update it, set `options.withoutCompare` to `true`.
 * If the state is of object type or if a separate logic is needed to detect changes in value, pass `options.compare` function.
 * If no compare function is provided, the default comparison `prev === next` will be used.
 *
 * @template T - The type of state.
 * @param {T} state - The state to get previous value.
 * @param {PreviousOptions<T>} options - The options object
 * @param {(prev: T | undefined, next: T) => boolean} options.compare - The comparison function to detect that state has been changed.
 * @param {boolean} options.withoutCompare - Set `withoutCompare` to `true` when previous value always need to be updated.
 * @param {boolean} options.withInitialValue - Set `withInitialValue` to `true` when initial value of previous should be initial value of state.
 * @returns Previous value of the state
 */
export function usePrevious<T>(state: T, options: PreviousOptionsWithInitial<T>): T;

export function usePrevious<T>(
  state: T,
  options: PreviousOptions<T> = {
    compare: strictEquals,
    withoutCompare: false,
    withInitialValue: false,
  }
): T | undefined {
  const prevRef = useRef<T>(options.withInitialValue ? state : undefined);
  const currentRef = useRef<T>(state);
  const isFirstMount = useFirstMountState();

  if (isFirstMount || (!options.withoutCompare && options.compare!(currentRef.current, state))) {
    return prevRef.current;
  }

  prevRef.current = currentRef.current;
  currentRef.current = state;

  return prevRef.current;
}
