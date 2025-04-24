import { ReactElement } from 'react';

type StringifiedValue<T> =
  | (T extends boolean ? 'true' | 'false' : never)
  | (T extends number ? `${T}` : never)
  | (T extends string ? T : never);

type Props<Case> = {
  value: Case;
  caseBy: Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>;
  defaultComponent?: () => ReactElement | null;
};

/**
 * @description
 * `SwitchCase` is a component that allows you to declaratively render components based on a given value,
 * similar to a `switch-case` statement. It is useful when you need to conditionally render different
 * components depending on a specific state.
 *
 * @param {Case} value - The value to compare against.
 *   The component associated with the matching key in `caseBy` will be rendered.
 * @param {Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>} caseBy - An object that maps values to
 *   components to render. The keys represent possible values, and the values are functions returning
 *   the corresponding components.
 * @param {() => ReactElement | null} [defaultComponent] - The component to render if `value` does not match
 *   any key in `caseBy`.
 *
 * @returns {ReactElement | null} A React component that conditionally renders based on cases.
 *
 * @example
 * function App() {
 *   return (
 *     <SwitchCase
 *       value={status}
 *       // Renders TypeA, TypeB, or TypeC based on the status value.
 *       caseBy={{
 *         a: () => <TypeA />,
 *         b: () => <TypeB />,
 *         c: () => <TypeC />,
 *       }}
 *       // Renders Default when the status value does not match any case.
 *       defaultComponent={() => <Default />}
 *     />
 *   );
 * }
 */
export function SwitchCase<Case>({ value, caseBy, defaultComponent = () => null }: Props<Case>): ReactElement | null {
  const stringifiedValue = String(value) as StringifiedValue<Case>;
  return (caseBy[stringifiedValue] ?? defaultComponent)();
}
