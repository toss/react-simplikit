import { useBooleanState } from 'react-simplikit';

export function Dialog() {
  const [isOpen, setTrue, setFalse, toggle] = useBooleanState(false);
  const [isLoading, startLoading, stopLoading] = useBooleanState();
  const [isExpanded, , , toggleExpanded] = useBooleanState(true);
  const [isChecked] = useBooleanState();

  return null;
}
