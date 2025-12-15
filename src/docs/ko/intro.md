# react-simplikit 소개

어떻게 하면 React 기반 앱을 좀 더 안전하고 탄탄하게 만들 수 있을까? 우리는 그 답을 '리액트를 리액트답게' 작성하는 것이라고 정의했고, `react-simplikit`으로 그 답을 구체화했어요.

`react-simplikit`은 React 환경에서 유용하게 사용할 수 있는 다양한 도구들을 제공하는 가볍고 강력한 라이브러리예요. React의 설계 원칙을 존중하면서 동시에, React의 개발 경험을 개선하기 위해 설계되었어요.

## 라이브러리 운영 방향

**react-simplikit은 이제 완전히 순수한 상태/로직 훅만을 위한 Universal Hook Library로 유지됩니다.**

react-simplikit은 웹/앱(React Native 등) 어디서든 동작 가능한, **플랫폼에 종속되지 않은 순수 상태/로직 훅만을 제공하는 라이브러리**로 재편됩니다. 네트워크, 브라우저 API, DOM 등에 강하게 결합된 기능은 더 이상 react-simplikit의 관심사가 아니에요.

### 유지되는 것

특정 플랫폼 API에 의존하지 않는 순수 로직 기반 훅들은 계속 제공돼요. 상태 관리 훅(`useToggle`, `useBooleanState`), 라이프사이클 훅(`usePrevious`), 유틸리티 훅(`useDebounce`, `useThrottle`) 등이 해당되며, 기존 프로젝트의 Backward Compatibility는 보존돼요.

### Deprecated 되는 것

`useGeolocation`, `useStorageState`, `useIntersectionObserver`, `useImpressionRef`, `useDoubleClick`, `useLongPress`, `useOutsideClickEffect`, `useVisibilityEvent` 같은 브라우저/플랫폼 의존 훅들은 Deprecated 처리돼요. 이 훅들은 새 기능을 추가하지 않으며, 장기적으로는 메이저 버전 업데이트에서 제거를 검토할 수 있어요.

## 더 직관적이고 익숙한 인터페이스

React의 선언적인 API를 사용할 때와 최대한 유사한 개발 경험을 제공해요. 더 적게 쓰고, 더 많은 것들을 더 직관적으로 구현해 보세요.

### 토글 기능 구현하기

```tsx
function Page() {
  const [isOpen, setOpen] = useState(false); // [!code --]
  // [!code --]
  const toggle = useCallback(() => {
    // [!code --]
    setOpen(isOpen => !isOpen); // [!code --]
  }, []); // [!code --]
  const [isOpen, toggle] = useToggle(false); // [!code ++]

  return (
    <div>
      <p>Bottom Sheet state: {isOpen ? 'opened' : 'closed'}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```

### 특정 요소로 구분하여 배열 렌더링하기

<SplitView
left-title="without-react-simplikit.tsx"
right-title="with-react-simplikit.tsx">

<template #left>

```tsx
// `react-simplikit`을 사용하지 않은 코드
const texts = ['hello', 'react', 'world'];

function Page() {
  return (
    <>
      {texts.map((text, idx) => (
        <Fragment key={text}>
          <div>{text}</div>
          {idx < texts.length - 1 ? (
            <Border type="padding24" />
          ) : null}
        </Fragment>
      ))}
    </>
  );
}
```

  </template>

<template #right>

```tsx
// `react-simplikit`을 사용한 코드
const texts = ['hello', 'react', 'world'];

function Page() {
  return (
    <Separated by={<Border type="padding24" />}>
      {texts.map(text => (
        <div key={text}>{text}</div>
      ))}
    </Separated>
  );
}
```

  </template>
</SplitView>

## 간결한 구현으로, 의도하지 않은 동작이나 버그를 최소화해요

`react-simplikit`의 모든 구현체는 숨은 로직을 포함하지 않아요. 만약 기능의 조합이나 확장이 필요하다면 외부에서 주입될 수 있도록 인터페이스를 제공해요. 또한 현대적인 구현을 통해 간결한 코드를 유지해요.

그렇기 때문에 `react-simplikit`을 사용하면 코드의 안정성과 신뢰성을 높일 수 있어요.

```tsx
function Page() {
  // useIntersectionObserver는 intersection을 감지하는 최소한의 기능을 제공하고,
  // 감지 후, 콜백과 intersection 옵션은 외부로부터 주입받아요.
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

## 높은 신뢰성

`react-simplikit`은 높은 신뢰성을 보장하기 위해 모든 구현체의 테스트를 100% 커버리지 수준으로 지원하여 이를 보장해요.

## SSR 환경에서 안전한 동작을 보장해요

SSR 환경이 적극적으로 도입되면서, 컴포넌트나 훅을 자칫 잘못 작성하면 SSR 환경에서 오류가 발생하거나, hydration 불일치 오류가 발생할 수 있어요. `react-simplikit`은 이러한 문제를 최소화하기 위해 설계되었고, 역시 SSR 환경에서의 테스트를 100% 커버리지 수준으로 지원하여 이를 보장해요.

## React 외의 의존성을 두지 않아요

react-use가 React와 React-DOM 제외 [14개의 의존성](https://www.npmjs.com/package/react-use?activeTab=dependencies)을 가지고 있는 것에 비해, `react-simplikit`은 React에 대한 peer-dependency를 제외하고, 그 어떤 라이브러리에도 의존하지 않아요.

## 링크

`react-simplikit`에 대해 더 많은 정보를 얻고 싶다면 아래 링크를 참고하세요:

- [GitHub](https://github.com/toss/react-simplikit)
