# reactive-kit 소개

어떻게 하면 React 기반 앱을 좀 더 안전하고 탄탄하게 만들 수 있을까? 우리는 그 답을 ‘리액트를 리액트 답게’ 작성하는 것이라고 정의했고, `reactive-kit`으로 그 답을 구체화 했어요.

`reactive-kit`은 React 환경에서 유용하게 사용할 수 있는 다양한 유틸리티를 제공하는 가볍고 강력한 라이브러리예요. React의 설계 원칙을 존중하면서 동시에, React의 개발 경험을 개선하기 위해 설계 되었어요.

## 더 직관적이고 익숙한 인터페이스

React의 선언적인 API를 사용할 때와 최대한 유사한 개발 경험을 제공해요. 더 적게 쓰고, 더 많은 것들을 더 직관적으로 구현해보세요.

### 토글 기능 구현하기

```tsx
function Page() {
  const [open, setOpen] = useState(false); // [!code --]
  // [!code --]
  const toggle = useCallback(() => { // [!code --]
    setValue(b => !b); // [!code --]
  }, []); // [!code --]
  const [open, toggle] = useToggle(false); // [!code ++]

  return <>
    <div>
      <p>Bottom Sheet state: {open ? 'opened' : 'closed'}</p>
      <button onClick={toggle}>Toggle</button>
   </div>
  <>;
}
```

### 특정 요소로 구분하여 배열 렌더링 하기

```tsx [without-reactive-kit.tsx]
const texts = ['hello', 'react', 'world'];

function Page() {
  return <>
    {texts.map((text, idx) => ( // [!code --]
      <Fragment key={text}> // [!code --]
        <div>{text}</div> // [!code --]
        {idx === texts.length - 1 ? <Border type="padding24" /> : null} // [!code --]
      </Fragment> // [!code --]
    ))} // [!code --]
    <Seperated with={<Border type="padding24" />}> // [!code ++]
      {texts.map(text => ( // [!code ++]
        <div>{text}</div> // [!code ++]
      ))} // [!code ++]
    </Seperated> // [!code ++]
  <>;
}
```

## React 19, RSC, React Native 등 다양한 환경에서의 완벽한 동작을 보장해요

React가 동작하는 환경이 다양해지면서, 특정 환경에서 동작하지 않는 기능들이 생겼어요.
`reactive-kit`은 이러한 환경에서 사용 가능한 대안을 제시하고, 최대한 일관된 경험을 제공하고자 해요.

### RSC 환경에서 Context API 사용하기

기존의 Context API는 RSC 환경에서 사용하기에 제약이 있었어요.
reactive-kit은 같은 인터페이스를 통해 RSC 환경에서도 대응되는 Context API 기능을 사용할 수 있어요

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

## 간결한 구현으로, 의도하지 않은 동작이나 버그를 최소화해요

reactive-kit의 모든 구현체는 숨은 로직을 포함하지 않아요. 만약 기능의 조합이나 확장이 필요하다면 외부에서 주입될 수 있도록 인터페이스를 제공해요. 또한 현대적인 구현을 통해 간결한 코드를 유지해요.

그렇기 때문에 reactive-kit을 사용하면 코드의 안정성과 신뢰성을 높일 수 있어요.

```tsx
function Page() {
  // useIntersectionObserver는 intersection을 감지하는 최소한의 기능을 제공하고,
  // 감지 후 콜백, intersection 옵션은 외부로부터 주입 받습니다.
  const ref = useIntersectionObserver<HTMLDivElement>(
    entry => {
      if (entry.isIntersecting) {
        console.log('Element is in view:', entry.target);
      } else {
        console.log('Element is out of view:', entry.target);
      }
    },
    { threshold: 0.5 }
  );

  return <div ref={ref}>Observe me!</div>;
}
```

## React 외의 의존성을 두지 않아요

react-use가 React와 React-DOM 제외 [14개의 의존성](https://www.npmjs.com/package/react-use?activeTab=dependencies)을 가지고 있는 것에 비해, reactive-kit은 React 및 React-DOM에 대한 peer-dependency를 제외하고, 그 어떤 라이브러리에도 의존하지 않아요.

## 링크

`reactive-kit`에 대해 더 많은 정보를 얻고 싶다면 아래 링크를 참고하세요:

- [GitHub](https://github.com/toss/reactive-kit)
