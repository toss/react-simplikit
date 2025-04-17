# buildContext

`buildContext`는 리액트 컨텍스트를 정의할 때 반복적인 코드를 줄여주는 도우미 함수예요.

## 인터페이스

```ts
function buildContext(
  contextName: string,
  defaultContextValues: ContextValuesType
): [
  Provider: (props: ProviderProps<ContextValuesType>) => JSX.Element,
  useContext: () => ContextValuesType,
];
```

### 파라미터

<Interface
  required
  name="contextName"
  type="string"
  description="컨텍스트의 이름이에요."
/>

<Interface
  name="defaultContextValues"
  type="ContextValuesType"
  description="컨텍스트에 전달할 기본 값이에요."
/>

### 반환 값

<Interface
  name=""
  type="[Provider: (props: ProviderProps<ContextValuesType>) => JSX.Element, useContext: () => ContextValuesType]"
  description="다음과 같은 형태의 튜플이에요:"
  :nested="[
    {
      name: 'Provider',
      type: '(props: ProviderProps<ContextValuesType>) => JSX.Element',
      description: '컨텍스트를 제공하는 컴포넌트예요.',
    },
    {
      name: 'useContext',
      type: '() => ContextValuesType',
      description: '컨텍스트를 사용하는 훅이에요.',
    },
  ]"
/>

## 예시

```tsx
const [Provider, useContext] = buildContext<{ title: string }>(
  'TestContext',
  null
);

function Inner() {
  const { title } = useContext();
  return <div>{title}</div>;
}

function Page() {
  return (
    <Provider title="Hello">
      <Inner />
    </Provider>
  );
}
```
