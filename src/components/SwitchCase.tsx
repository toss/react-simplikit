import { ReactNode } from 'react';

type CaseValue = string | number | boolean;
type StringifiedValue<T> = T extends boolean ? 'true' | 'false' : T extends number ? `${T}` : T;

interface Props<Case extends CaseValue> {
  value: Case;
  caseBy: {
    [Key in StringifiedValue<Case>]: () => ReactNode;
  };
  defaultComponent?: () => ReactNode;
}

export function SwitchCase<Case extends CaseValue>({ value, caseBy, defaultComponent = () => null }: Props<Case>) {
  const key = value as keyof typeof caseBy;

  return caseBy[key] ?? defaultComponent();
}
