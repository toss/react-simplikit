# reactive-kit 소개

어떻게 하면 React 기반 앱을 좀 더 안전하고 탄탄하게 만들 수 있을까? 우리는 그 답을 ‘리액트를 리액트 답게’ 작성하는 것이라고 정의했고, `reactive-kit`으로 그 답을 구체화 했어요.

`reactive-kit`은 React 환경에서 유용하게 사용할 수 있는 다양한 유틸리티를 제공하는 가볍고 강력한 라이브러리예요. React의 설계 원칙을 존중하면서 동시에, React의 개발 경험을 개선하기 위해 설계 되었어요.

## 더 직관적이고 익숙한 인터페이스

React의 선언적인 API를 사용할 때와 최대한 유사한 개발 경험을 제공해요. 더 적게 쓰고, 더 많은 것들을 더 직관적으로 구현해보세요.

### 토글 기능 구현하기

::: code-group

```tsx [without-reactive-kit.tsx]
function Page() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setValue(b => !b);
  }, []);

  return <>
    <div>
      <p>Bottom Sheet state: {open ? 'opened' : 'closed'}</p>
      <button onClick={toggle}>Toggle</button>
   </div>
  <>;
}
```

```tsx [with-reactive-kit.tsx]
function Page() {
  const [open, toggle] = useToggle(false);

  return <>
    <div>
      <p>Bottom Sheet state: {open ? 'opened' : 'closed'}</p>
      <button onClick={toggle}>Toggle</button>
   </div>
  <>;
}
```

:::

### 특정 요소로 구분하여 배열 렌더링 하기

::: code-group

```tsx [without-reactive-kit.tsx]
const texts = ['hello', 'react', 'world'];

function Page() {
  return <>
    {texts.map((text, idx) => (
      <Fragment key={text}>
        <div>{text}</div>
        {idx === texts.length - 1 ? <Border type="padding24" /> : null}
      </Fragment>
    ))}
  <>;
}
```

```tsx [with-reactive-kit.tsx]
const texts = ['hello', 'react', 'world'];

function Page() {
  return <>
    <Seperated with={<Border type="padding24" />}>
      {texts.map(text => (
        <div>{text}</div>
      ))}
    </Seperated>
  <>;
}
```

:::

## React 19, RSC, React Native 등 다양한 환경에서의 완벽한 동작을 보장해요

React가 동작하는 환경이 다양해지면서, 특정 환경에서 동작하지 않는 기능들이 생겼어요.
`reactive-kit`은 이러한 환경에서 사용 가능한 대안을 제시하고, 최대한 일관된 경험을 제공하고자 해요.

### RSC 환경에서 Context API 사용하기

기존의 Context API는 RSC 환경에서 사용하기에 제약이 있었어요.
reactive-kit은 같은 인터페이스를 통해 RSC 환경에서도 대응되는 Context API 기능을 사용할 수 있어요

::: code-group

```tsx [without-reactive-kit.tsx]
const SomeContext = createContext({
  hello: 'world',
});

function Page() {
  return (
    <SomeServerComponent>
      {/**
       * 에러 발생: You're importing a component that needs `createContext`.
       * This React hook only works in a client component.
       * To fix, mark the file (or its parent) with the `"use client"` directive.
       */}
      <SomeContext.Provider value={{ hello: 'world' }}>
        <SomeNestedServerComponent>
          <ComponentA />
        </SomeNestedServerComponent>
        <ComponentB />
      </SomeContext.Provider>
    </SomeServerComponent>
  );
}
```

```tsx [with-reactive-kit.tsx]
const SomeContext = createRSCSafeContext({
  hello: 'world',
});

function Page() {
  return (
    <SomeServerComponent>
      <SomeContext.Provider value={{ hello: 'world' }}>
        <SomeNestedServerComponent>
          <ComponentA />
        </SomeNestedServerComponent>
        <ComponentB />
      </SomeContext.Provider>
    </SomeServerComponent>
  );
}
```

:::

## 간결한 구현으로, 의도하지 않은 동작이나 버그를 최소화해요

## React 외의 의존성을 두지 않아요

## 링크

`reactive-kit`에 대해 더 많은 정보를 얻고 싶다면 아래 링크를 참고하세요:

- [GitHub](https://github.com/toss/reactive-kit)
