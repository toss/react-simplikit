# ErrorBoundary

`ErrorBoundary` is a component that catches errors in its children and displays a fallback UI.
It provides a clean way to handle runtime errors in React components, allowing your application to gracefully recover from unexpected errors.

## Interface

```ts
type RenderFallbackProps<ErrorType extends Error = Error> = {
  error: ErrorType;
  reset: () => void;
};

type Props<ErrorType extends Error = Error> = {
  resetKeys?: unknown[];
  onReset?(): void;
  renderFallback: (props: RenderFallbackProps<ErrorType>) => ReactNode;
  onError?(error: ErrorType, info: ErrorInfo): void;
  ignoreError?: (error: ErrorType) => boolean;
};

const ErrorBoundary: ForwardRefExoticComponent<PropsWithoutRef<Props> & RefAttributes<{ reset(): void }>>;

function useErrorBoundary<ErrorType extends Error>(): (error: ErrorType) => void;

function withErrorBoundary<Props extends object>(
  Component: ComponentType<Props>,
  errorBoundaryProps: Omit<ComponentPropsWithoutRef<typeof ErrorBoundary>, 'children'>
): (props: Props) => JSX.Element;
```

### Props

- `resetKeys` (unknown[] | optional): Array of dependencies that will automatically reset the error boundary when changed.
- `onReset` (() => void | optional): Function called when the error boundary is reset.
- `renderFallback` ((props: RenderFallbackProps) => ReactNode): Function to render a fallback UI when an error is caught.
  Receives the error and a reset function.
- `onError` ((error: Error, info: ErrorInfo) => void | optional): Function called when an error is caught.
  Useful for error logging.
- `ignoreError` ((error: Error) => boolean | optional): Function to determine whether an error should be ignored.
  If it returns true, the error will be re-thrown to parent boundaries.

### Ref API

The component exposes a ref with a reset() method to programmatically reset the error state.

### useErrorBoundary

A hook that returns a function which, when called with an error, will throw that error to be caught by the nearest ErrorBoundary.

### withErrorBoundary

A higher-order component that wraps a component with an ErrorBoundary.

## Example

### Basic

```tsx
const ref = useRef<ComponentRef<typeof ErrorBoundary>>();
const onReset = () => {
  ref.current?.reset();
};

<ErrorBoundary
  ref={ref}
  renderFallback={error => <div>error: {error.message}</div>}
  onError={(error, { componentStack }) => {
    alert(error.message);
    console.log(componentStack);
  }}
  resetKeys={['key1', 'key2']}
  ignoreError={error => error.message.includes('non_target_error')}
>
  <ErrorComponent />
</ErrorBoundary>;
```

### withErrorBoundary

```tsx
const Wrapped = withErrorBoundary(ErrorComponent, {
  renderFallback: ({ error }) => <div>error: {error.message}</div>,
});
```

### useErrorBoundary

```tsx
const ErrorComponent = () => {
  const throwError = useErrorBoundary();
  return <Button onClick={() => throwError(new Error('error'))}>throw error</Button>;
};

<ErrorBoundary renderFallback={({ error }) => <div>error: {error.message}</div>}>
  <ErrorComponent />
</ErrorBoundary>;
```
