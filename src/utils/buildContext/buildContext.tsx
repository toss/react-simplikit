import { createContext, ReactNode, useContext, useMemo } from 'react';

type ProviderProps<ContextValuesType> = (ContextValuesType & { children: ReactNode }) | { children: ReactNode };

/**
 * @description
 * `buildContext` is a helper function that reduces repetitive code when defining React Context.
 *
 * @param {string} contextName - The name of the context.
 * @param {ContextValuesType} [defaultContextValues] - The default values to be passed to the context.
 *
 * @returns {[Provider: (props: ProviderProps<ContextValuesType>) => JSX.Element, useContext: () => ContextValuesType]} A tuple of the form :
 * - Provider `(props: ProviderProps<ContextValuesType>) => JSX.Element` - The component that provides the context;
 * - useContext `() => ContextValuesType` - The hook that uses the context;
 *
 * @example
 * const [Provider, useContext] = buildContext<{ title: string }>('TestContext', null);
 *
 * function Inner() {
 *   const { title } = useContext();
 *   return <div>{title}</div>;
 * }
 *
 * function Page() {
 *   return (
 *     <Provider title="Hello">
 *       <Inner />
 *     </Provider>
 *   );
 * }
 */
export function buildContext<ContextValuesType extends object>(
  contextName: string,
  defaultContextValues?: ContextValuesType
) {
  const Context = createContext<ContextValuesType | undefined>(defaultContextValues ?? undefined);

  function Provider({ children, ...contextValues }: ProviderProps<ContextValuesType>) {
    const value = useMemo(
      () => (Object.keys(contextValues).length > 0 ? contextValues : null),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...Object.values(contextValues)]
    ) as ContextValuesType;

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useInnerContext() {
    const context = useContext(Context);

    if (context != null) {
      return context;
    }

    if (defaultContextValues != null) {
      return defaultContextValues;
    }

    throw new Error(`\`${contextName}Context\` must be used within \`${contextName}Provider\``);
  }

  return [Provider, useInnerContext] as const;
}
