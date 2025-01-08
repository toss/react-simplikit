interface Props<Case extends string | number | boolean> {
  caseBy: {
    [K in Case extends boolean ? 'true' | 'false' : Case extends number ? `${Case}` : Case]: React.ReactNode | null;
  };
  value: Case;
  defaultComponent?: React.ReactNode;
}

export function SwitchCase<Case extends string | number | boolean>({
  value,
  caseBy,
  defaultComponent: defaultComponent = null,
}: Props<Case>) {
  if (value == null) {
    return defaultComponent;
  }

  return caseBy[value as keyof typeof caseBy] ?? defaultComponent;
}
