# buildContext

`buildContext`는 React Context를 정의할 때 반복되는 코드를 줄여주는 헬퍼 함수에요.

## 인터페이스

```ts
function buildContext<T>(contextName: string, defaultContextValues: T): [React.Provider<T>, () => T];
```

## 파라미터

- `contextName`: context의 이름을 지정해요.
- `defaultContextValues`: context로 전달하는 기본값을 지정해요

## 반환값

- `Provider`: context를 제공하는 컴포넌트에요.
- `useContext`: context로 전달된 값을 사용하는 훅에요.

## 예제

```tsx
const [Provider, useContext] = buildContext<{ title: string }>('TestContext', null);

function Inner() {
  const context = useContext();

  return <h1>{context.title}</h1>;
}

function Page() {
  return (
    <Provider title="타이틀">
      <Inner />
    </Provider>
  );
}
```
