# ErrorBoundary

`ErrorBoundary`는 자식 컴포넌트 트리에서 발생한 JavaScript 에러를 감지하고 전체 애플리케이션이 중단되는 대신 대체 UI를 표시하는 React 컴포넌트에요. React 컴포넌트에서 런타임 오류를 처리하는 깔끔한 방법을 제공하여, 애플리케이션이 예상치 못한 오류로부터 우아하게 복구할 수 있도록 해요.

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

- `resetKeys` (unknown[] | optional): 변경시 에러 상태를 초기화할 때 사용하는 키 배열이에요.
- `onReset` (() => void | optional): 에러 상태가 초기화되었을 때 호출되는 함수에요.
- `renderFallback` ((props: RenderFallbackProps) => ReactNode): 에러가 발생할 때 대체 UI를 렌더링하는 함수에요.
  에러와 리셋 함수를 받아요.
- `onError` ((error: Error, info: ErrorInfo) => void | optional): 에러가 발생할 때 호출되는 함수에요.
  에러 로깅에 유용해요.
- `ignoreError` ((error: Error) => boolean | optional): 어떤 에러를 무시할지 잡을지 결정하는 함수에요.
  이 함수가 true를 반환하면 에러는 부모 경계로 다시 던져질 거에요.

### Ref API

ref로 연결해 에러 상태를 초기화할 수 있어요.

### useErrorBoundary

에러를 발생시키는 함수를 반환해요. 이 함수를 호출하면 가장 가까운 ErrorBoundary에 에러가 전파돼요.

### withErrorBoundary

컴포넌트를 ErrorBoundary로 감싸는 고차 컴포넌트(HOC)에요.

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
