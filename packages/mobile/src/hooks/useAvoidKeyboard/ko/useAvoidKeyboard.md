# useAvoidKeyboard

하단 고정 요소가 온스크린 키보드를 자연스럽게 피할 수 있도록 도와주는 리액트 훅이에요. 키보드가 나타나면 `transform`을 사용해 요소를 위로 부드럽게 이동시켜요.

## Interface

```ts
function useAvoidKeyboard(
  options?: UseAvoidKeyboardOptions
): UseAvoidKeyboardResult;
```

### 파라미터

<Interface
  name="options"
  type="UseAvoidKeyboardOptions"
  description="키보드 회피 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.safeAreaBottom',
      type: 'number',
      required: false,
      defaultValue: '0',
      description:
        '키보드가 숨겨져 있을 때 기본 하단 오프셋(px)이에요. iPhone의 홈 인디케이터 영역을 고려할 때 유용해요.',
    },
    {
      name: 'options.transitionDuration',
      type: 'number',
      required: false,
      defaultValue: '200',
      description:
        '부드러운 애니메이션을 위한 전환 시간(ms)이에요.',
    },
    {
      name: 'options.transitionTimingFunction',
      type: 'string',
      required: false,
      description:
        '애니메이션의 전환 타이밍 함수예요. 기본값은 <code>ease-out</code>이에요.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      description:
        '만약 <code>true</code>이면, 마운트 시 즉시 현재 키보드 높이를 가져와요. 기본값은 <code>true</code>예요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="UseAvoidKeyboardResult"
  description="키보드 회피를 위한 CSS 스타일을 담은 객체예요."
  :nested="[
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        '하단 고정 요소에 적용할 CSS 스타일 객체예요. <code>transform</code>과 <code>transition</code> 속성을 포함해요.',
    },
  ]"
/>

## 예시

```tsx
function FixedBottomCTA() {
  const { style } = useAvoidKeyboard();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>제출</button>
    </div>
  );
}
```

```tsx
// iPhone 홈 인디케이터 오프셋을 포함한 예시
function FixedBottomCTA() {
  const { style } = useAvoidKeyboard({ safeAreaBottom: 34 });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>제출</button>
    </div>
  );
}
```
