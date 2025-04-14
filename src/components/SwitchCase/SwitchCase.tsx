import { ReactElement } from 'react';

// Selector type for discriminated unions
type Selector<T, K extends keyof T, V = T[K]> = K | ((value: T) => V);

type StringifiedValue<T> =
  | (T extends boolean ? 'true' | 'false' : never)
  | (T extends number ? `${T}` : never)
  | (T extends string ? T : never);

type Props<Value, Key extends keyof Value = never, Selected = never extends Key  ? Value : Value[Key]> = {
  value: Value;
  selector?: Selector<Value, Key, Selected>;
  caseBy: Partial<{ [P in StringifiedValue<Selected>]: () => ReactElement | null }>;
  defaultComponent?: () => ReactElement | null;
};

/**
 * @description
 * `SwitchCase` is a component that allows you to declaratively render components based on a given value,
 * similar to a `switch-case` statement. It is useful when you need to conditionally render different
 * components depending on a specific state.
 *
 * It supports both primitive values and objects with discriminated unions.
 *
 * @param {any} value - The value to compare against or an object with a discriminator property.
 * @param {string | function} [selector] - Optional property name or function to extract the value to match against.
 *   If a string is provided, it will use that property of the value object.
 *   If a function is provided, it will call the function with the value and use the result.
 *   If not provided, it will use the value directly.
 * @param {Record<string | number, () => JSX.Element>} caseBy - An object that maps values to
 *   components to render. The keys represent possible values, and the values are functions returning
 *   the corresponding components.
 * @param {() => JSX.Element} [defaultComponent] - The component to render if `value` does not match
 *   any key in `caseBy`.
 *
 * @returns {JSX.Element} A React component that conditionally renders based on cases.
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
 *
 * @example
 * type Ok<T> = { tag: "Ok"; value: T };
 * type Err = { tag: "Err"; error: string };
 * type Result<T> = Ok<T> | Err;
 *
 * function App() {
 *   return (
 *     <SwitchCase
 *       value={result}
 *       selector="tag"
 *       caseBy={{
 *         Ok: () => <ResultComponent data={result.value} />,
 *         Err: () => <ErrorComponent />,
 *       }}
 *     />
 *   );
 * }
 * 
 * @example
 * type Ok<T> = { tag: "Ok"; value: T };
 * type Err = { tag: "Err"; error: string };
 * type Result<T> = Ok<T> | Err;
 *
 * function App() {
 *   return (
 *     <SwitchCase
 *       value={result}
 *       selector={result => result.tag === 'Ok' && result.value === 42}
 *       caseBy={{
 *         true: () => <div>The answer is correct</div>,
 *         false: () => <div>Error</div>,
 *       }}
 *     />
 *   );
 * }
 */
export function SwitchCase<Value, Key extends keyof Value = never, Selected = [Key] extends [never] ? Value : Value[Key]>({
  value,
  selector,
  caseBy,
  defaultComponent = () => null
}: Props<Value, Key, Selected>): ReactElement | null {
  // Extract the selected value based on the selector
  let selectedValue: Selected;
  
  if (selector === undefined) {
    // If no selector is provided, use the value directly (backward compatibility)
    selectedValue = value as unknown as Selected;
  } else if (typeof selector === 'function') {
    // If selector is a function, call it with the value
    selectedValue = (selector as (value: Value) => Selected)(value);
  } else {
    // If selector is a property key, access that property
    selectedValue = value[selector as keyof Value] as unknown as Selected;
  }
  
  // Convert to string for case matching
  const stringifiedValue = String(selectedValue) as StringifiedValue<Selected>;
  
  // Return the matching case or default component
  return (caseBy[stringifiedValue] ?? defaultComponent)();
}
