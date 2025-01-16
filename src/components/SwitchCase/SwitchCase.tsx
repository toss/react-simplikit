import { ReactNode } from 'react';

type StringifiedValue<T> = T extends boolean
  ? 'true' | 'false'
  : T extends number
    ? `${T}`
    : T extends string
      ? T
      : never;

interface Props<Case> {
  value: Case;
  caseBy: Partial<{ [P in StringifiedValue<Case>]: () => ReactNode }>;
  defaultComponent?: () => ReactNode;
}

export function SwitchCase<Case>({ value, caseBy, defaultComponent = () => null }: Props<Case>) {
  const stringifiedValue = String(value) as StringifiedValue<Case>;
  return (caseBy[stringifiedValue] ?? defaultComponent)();
}
