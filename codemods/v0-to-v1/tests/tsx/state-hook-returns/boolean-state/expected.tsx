import { useBooleanState } from 'react-simplikit';

export function Dialog() {
  const [isOpen, { setTrue, setFalse, toggle }] = useBooleanState(false);
  const [isLoading, { setTrue: startLoading, setFalse: stopLoading }] = useBooleanState();
  const [isExpanded, { toggle: toggleExpanded }] = useBooleanState(true);
  const [isChecked] = useBooleanState();

  return null;
}
