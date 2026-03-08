import { useMemo, useState } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

type UseHistoryOptions = {
  capacity?: number;
};

/**
 * @description
 * `useHistory` is a React hook that tracks the change history of a value and provides undo/redo functionality.
 * Each time `setValue` is called, the value is recorded in the history stack, and you can navigate through
 * past values using `undo` and `redo`.
 *
 * @param {T} initialValue - The initial value.
 * @param {UseHistoryOptions} [options] - Configuration options.
 * @param {number} [options.capacity] - The maximum number of history entries to keep. When exceeded, the oldest entry is removed. Defaults to unlimited.
 *
 * @returns {object} An object containing:
 * - `value` — The current value.
 * - `setValue` — A function to set a new value and record it in the history.
 * - `history` — A readonly array of all recorded values.
 * - `pointer` — The current position in the history stack.
 * - `undo` — A function to revert to the previous value.
 * - `redo` — A function to move forward to the next value.
 * - `canUndo` — Whether there is a previous value to revert to.
 * - `canRedo` — Whether there is a next value to move forward to.
 * - `clear` — A function to clear the history and reset to the current value.
 *
 * @example
 * function TextEditor() {
 *   const { value, setValue, undo, redo, canUndo, canRedo } = useHistory('');
 *
 *   return (
 *     <div>
 *       <input value={value} onChange={(e) => setValue(e.target.value)} />
 *       <button onClick={undo} disabled={!canUndo}>Undo</button>
 *       <button onClick={redo} disabled={!canRedo}>Redo</button>
 *     </div>
 *   );
 * }
 *
 * @example
 * function Counter() {
 *   const { value, setValue, undo, canUndo, clear } = useHistory(0, { capacity: 10 });
 *
 *   return (
 *     <div>
 *       <p>Count: {value}</p>
 *       <button onClick={() => setValue(value + 1)}>Increment</button>
 *       <button onClick={undo} disabled={!canUndo}>Undo</button>
 *       <button onClick={clear}>Clear History</button>
 *     </div>
 *   );
 * }
 */
export function useHistory<T>(initialValue: T, options?: UseHistoryOptions) {
  const { capacity } = options ?? {};

  const [state, setState] = useState<{ history: T[]; pointer: number }>({
    history: [initialValue],
    pointer: 0,
  });

  const setValue = usePreservedCallback((newValue: T) => {
    setState(prev => {
      const newHistory = [...prev.history.slice(0, prev.pointer + 1), newValue];

      if (capacity !== undefined && capacity >= 1 && newHistory.length > capacity) {
        newHistory.splice(0, newHistory.length - capacity);
      }

      return { history: newHistory, pointer: newHistory.length - 1 };
    });
  });

  const undo = usePreservedCallback(() => {
    setState(prev => (prev.pointer > 0 ? { ...prev, pointer: prev.pointer - 1 } : prev));
  });

  const redo = usePreservedCallback(() => {
    setState(prev => (prev.pointer < prev.history.length - 1 ? { ...prev, pointer: prev.pointer + 1 } : prev));
  });

  const clear = usePreservedCallback(() => {
    setState(prev => ({ history: [prev.history[prev.pointer]], pointer: 0 }));
  });

  const { history, pointer } = state;
  const value = history[pointer];
  const canUndo = pointer > 0;
  const canRedo = pointer < history.length - 1;

  return useMemo(
    () => ({
      value,
      setValue,
      history: history as readonly T[],
      pointer,
      undo,
      redo,
      canUndo,
      canRedo,
      clear,
    }),
    [value, setValue, history, pointer, undo, redo, canUndo, canRedo, clear]
  );
}
