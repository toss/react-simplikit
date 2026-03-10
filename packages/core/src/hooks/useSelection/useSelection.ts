import { useEffect, useMemo, useState } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { usePreservedReference } from '../usePreservedReference/index.ts';

type UseSelectionOptions<T> = {
  defaultSelected?: ReadonlyArray<T>;
};

type UseSelectionReturn<T> = {
  selected: ReadonlyArray<T>;
  select: (value: T) => void;
  deselect: (value: T) => void;
  toggle: (value: T) => void;
  isSelected: (value: T) => boolean;
  selectAll: () => void;
  deselectAll: () => void;
  toggleAll: () => void;
  isAllSelected: boolean;
  isSomeSelected: boolean;
};

/**
 * @description
 * `useSelection` is a React hook that manages multi-selection state over a list of items.
 * It provides functions to select, deselect, and toggle items, along with utilities
 * like `selectAll`, `toggleAll`, `isAllSelected`, and `isSomeSelected`.
 *
 * @template T - The type of items in the list.
 *
 * @param {ReadonlyArray<T>} items - The list of items to manage selection for.
 * @param {UseSelectionOptions<T>} [options] - Optional configuration.
 * @param {ReadonlyArray<T>} [options.defaultSelected] - Items that are selected by default.
 *
 * @returns {UseSelectionReturn<T>} An object containing the current selection state and action functions.
 * - selected `ReadonlyArray<T>` - Array of currently selected items
 * - select `(value: T) => void` - Add a value to the selection. Values not in items are ignored
 * - deselect `(value: T) => void` - Remove a value from the selection
 * - toggle `(value: T) => void` - Toggle a value in the selection. Values not in items are ignored
 * - isSelected `(value: T) => boolean` - Check if a value is selected
 * - selectAll `() => void` - Select all items
 * - deselectAll `() => void` - Clear the selection
 * - toggleAll `() => void` - If all items are selected, deselect all; otherwise select all
 * - isAllSelected `boolean` - True if all items are selected and the list is non-empty
 * - isSomeSelected `boolean` - True if at least one but not all items are selected
 *
 * @example
 * import { useSelection } from 'react-simplikit';
 *
 * function FileList() {
 *   const files = ['report.pdf', 'photo.png', 'notes.txt'];
 *   const {
 *     selected,
 *     toggle,
 *     toggleAll,
 *     isSelected,
 *     isAllSelected,
 *     isSomeSelected,
 *   } = useSelection(files);
 *
 *   return (
 *     <div>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={isAllSelected}
 *           ref={el => { if (el) el.indeterminate = isSomeSelected; }}
 *           onChange={toggleAll}
 *         />
 *         Select all
 *       </label>
 *       {files.map(file => (
 *         <label key={file}>
 *           <input
 *             type="checkbox"
 *             checked={isSelected(file)}
 *             onChange={() => toggle(file)}
 *           />
 *           {file}
 *         </label>
 *       ))}
 *       <p>{selected.length} file(s) selected</p>
 *     </div>
 *   );
 * }
 */
export function useSelection<T>(items: ReadonlyArray<T>, options: UseSelectionOptions<T> = {}): UseSelectionReturn<T> {
  const preservedItems = usePreservedReference(items);
  const preservedDefaultSelected = usePreservedReference(options.defaultSelected ?? []);

  const [selectedSet, setSelectedSet] = useState<Set<T>>(
    () => new Set(preservedDefaultSelected.filter(item => preservedItems.includes(item)))
  );

  useEffect(
    function syncItemsChange() {
      setSelectedSet(prev => {
        const itemSet = new Set(preservedItems);
        const next = new Set<T>();
        for (const item of prev) {
          if (itemSet.has(item)) {
            next.add(item);
          }
        }
        return next.size !== prev.size ? next : prev;
      });
    },
    [preservedItems]
  );

  const select = usePreservedCallback((value: T) => {
    setSelectedSet(prev => {
      if (prev.has(value) || !preservedItems.includes(value)) {
        return prev;
      }
      const next = new Set(prev);
      next.add(value);
      return next;
    });
  });

  const deselect = usePreservedCallback((value: T) => {
    setSelectedSet(prev => {
      if (!prev.has(value)) {
        return prev;
      }
      const next = new Set(prev);
      next.delete(value);
      return next;
    });
  });

  const toggle = usePreservedCallback((value: T) => {
    setSelectedSet(prev => {
      if (!prev.has(value) && !preservedItems.includes(value)) {
        return prev;
      }
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  });

  const isSelected = usePreservedCallback((value: T) => {
    return selectedSet.has(value);
  });

  const selectAll = usePreservedCallback(() => {
    setSelectedSet(() => new Set(preservedItems));
  });

  const deselectAll = usePreservedCallback(() => {
    setSelectedSet(() => new Set());
  });

  const toggleAll = usePreservedCallback(() => {
    setSelectedSet(prev => {
      const isAll = preservedItems.length > 0 && preservedItems.every(item => prev.has(item));
      return isAll ? new Set() : new Set(preservedItems);
    });
  });

  return useMemo(() => {
    const selected = preservedItems.filter(item => selectedSet.has(item));
    const isAllSelected = preservedItems.length > 0 && preservedItems.every(item => selectedSet.has(item));
    const isSomeSelected = selected.length > 0 && !isAllSelected;

    return {
      selected,
      select,
      deselect,
      toggle,
      isSelected,
      selectAll,
      deselectAll,
      toggleAll,
      isAllSelected,
      isSomeSelected,
    };
  }, [selectedSet, preservedItems, select, deselect, toggle, isSelected, selectAll, deselectAll, toggleAll]);
}
