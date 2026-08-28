# react-simplikit 소개

어떻게 하면 React 기반 앱을 좀 더 안전하고 탄탄하게 만들 수 있을까요? 우리는 그 답을 '리액트를 리액트답게' 작성하는 것이라고 정의했고, `react-simplikit`으로 그 답을 구체화했어요.

`react-simplikit`은 React 환경에서 유용하게 사용할 수 있는 다양한 도구들을 제공하는 가볍고 강력한 라이브러리예요. React의 설계 원칙을 존중하면서 동시에, React의 개발 경험을 개선하기 위해 설계되었어요.

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

## 간결한 구현으로 의도하지 않은 동작과 버그 최소화

`react-simplikit`의 모든 구현체에는 숨겨진 로직이 없어요. 기능 조합이나 확장이 필요한 경우, 외부에서 주입할 수 있는 인터페이스를 제공해요. 또한 모던한 구현을 통해 깔끔한 코드를 유지하고 있어요.

`react-simplikit`을 사용하면 코드의 안정성과 신뢰성을 높일 수 있는 이유예요.

## 높은 신뢰성

`react-simplikit`은 모든 구현체에 대해 100% 테스트 커버리지를 유지하여 높은 신뢰성을 보장해요.

## SSR 환경에서도 안전한 동작 보장

SSR 환경의 활발한 도입으로, 잘못 작성된 컴포넌트나 훅이 SSR 환경에서 에러를 발생시키거나 하이드레이션 미스매치를 일으킬 수 있어요. `react-simplikit`은 이러한 문제를 최소화하도록 설계되었고, SSR 환경에서의 100% 테스트 커버리지로 이를 보장해요.

## React 외에는 의존성 없음

14개의 의존성을 가진 react-use와 달리, `react-simplikit`은 React에 대한 peer dependency 외에는 다른 의존성이 없어요.

## 링크

react-simplikit에 대한 더 많은 정보는 다음 링크를 확인해 주세요:

- [GitHub](https://github.com/toss/react-simplikit)
