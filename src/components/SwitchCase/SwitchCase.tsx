import { ReactNode } from 'react';

type StringifiedValue<T> = T extends boolean
  ? 'true' | 'false'
  : T extends number
    ? `${T}`
    : T extends string
      ? T
      : never;

type Props<Case> = {
  value: Case;
  caseBy: Partial<{ [P in StringifiedValue<Case>]: () => ReactNode }>;
  defaultComponent?: () => ReactNode;
};

/**
 * @description
 * `SwitchCase` is a component that allows you to use switch-case statements declaratively.
 *
 * @param value - The case value
 * @param caseBy - An object that defines the components to render based on the case.
 * @param defaultComponent - The component to render if the case does not match.
 * @returns A React component that conditionally rendered based on cases
 *
 * @example
 * function App() {
 *   return <SwitchCase
 *     value={status}
 *     // component is rendered based on the status value
 *     caseBy={{
 *       a: <TypeA />,
 *       b: <TypeB />,
 *       c: <TypeC />,
 *     }}
 *     // component is rendered when the status value is not matched
 *     defaultComponent={<Default />}
 *   />;
 * }
 */
export function SwitchCase<Case>({ value, caseBy, defaultComponent = () => null }: Props<Case>) {
  const stringifiedValue = String(value) as StringifiedValue<Case>;
  return (caseBy[stringifiedValue] ?? defaultComponent)();
}
