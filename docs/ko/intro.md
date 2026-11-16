---
description: React 코드를 간단하게 만드는 훅, 컴포넌트, 유틸리티를 소개해요.
---

# react-simplikit 소개

어떻게 하면 React 기반 앱을 좀 더 안전하고 탄탄하게 만들 수 있을까요? 우리는 그 답을 '리액트를 리액트답게' 작성하는 것이라고 정의했고 `react-simplikit`으로 그 답을 구체화했어요.

`react-simplikit`은 가볍고 강력한 라이브러리예요. React 환경에서 유용하게 사용할 수 있는 다양한 도구를 담고 있어요. React의 설계 원칙을 존중하면서 React의 개발 경험을 더 낫게 만드는 것을 목표로 해요.

## 더 직관적이고 익숙한 인터페이스

React의 선언적인 API를 사용할 때와 최대한 유사한 개발 경험을 제공해요. 코드는 적게 쓰고 더 많은 일을 더 쉽게 해 보세요.

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

### 특정 구분자로 배열 렌더링하기

<SplitView
left-title="without-react-simplikit.tsx"
right-title="with-react-simplikit.tsx">

<template #left>

```tsx
// without `react-simplikit`
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
// with `react-simplikit`
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

## 간결한 구현으로 의도하지 않은 동작과 버그 최소화

`react-simplikit`의 모든 구현체에는 숨겨진 로직이 없어요. 기능 조합이나 확장이 필요하면 외부에서 주입할 수 있는 인터페이스를 갖추고 있어요. 또한 모던한 구현으로 코드를 깔끔하게 유지해요.

그래서 `react-simplikit`을 사용하면 코드의 안정성과 신뢰성을 높일 수 있어요.

```tsx
function Page() {
  // useIntersectionObserver는 교차 감지에 필요한 최소한의 기능만 제공하고,
  // 콜백과 교차 판정 옵션은 외부에서 주입받아요
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

`react-simplikit`은 모든 구현체의 테스트 커버리지를 100%로 유지해 높은 신뢰성을 보장해요.

## SSR 환경에서도 안전한 동작 보장

SSR을 도입하는 곳이 늘면서 잘못 작성된 컴포넌트나 훅이 SSR 환경에서 에러를 내거나 하이드레이션 미스매치를 일으킬 수 있어요. `react-simplikit`은 이러한 문제를 최소화하도록 만들어졌어요. SSR 환경에서도 테스트 커버리지 100%를 지켜 안전한 동작을 보장해요.

## React 외에는 의존성 없음

react-use는 React와 React-DOM을 빼고도 [의존성이 14개](https://www.npmjs.com/package/react-use?activeTab=dependencies)예요. 반면 `react-simplikit`은 React에 대한 peer dependency 외에는 다른 의존성이 없어요.

## 더 알아보기 {#링크}

소스 코드는 [GitHub](https://github.com/toss/react-simplikit)에서 확인할 수 있어요.

완성된 예제는 [문제별 사용법](/ko/use-cases)에서 확인하고 전체 도구는 [API 레퍼런스](/ko/reference)에서 찾아보세요.
