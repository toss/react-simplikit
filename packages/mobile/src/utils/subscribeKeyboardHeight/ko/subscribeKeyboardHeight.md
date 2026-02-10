# subscribeKeyboardHeight

`subscribeKeyboardHeight`는 화면 키보드 높이의 변경 사항을 구독하는 유틸리티 함수에요. 제공된 콜백은 키보드 높이가 변경될 때마다 호출돼요. 키보드가 나타나거나 사라지거나 크기가 변경될 때 등이 포함돼요. 내부적으로 이 함수는 Visual Viewport에서 `resize` 및 `scroll` 이벤트를 모두 듣습니다: - `resize`: 시각적 뷰포트 높이가 변경될 때 트리거됨 - `scroll`: 시각적 뷰포트 오프셋이 변경될 때 트리거됨(iOS의 경우 뷰포트가 리사이징 없이 이동할 수 있어 중요함) 성능 최적화: - 과도한 콜백 호출을 방지하기 위해 기본적으로 쓰로틀링(16ms, 약 60fps) - 높이가 변경되지 않았을 때 콜백을 건너뛰기

## 인터페이스

```ts
function subscribeKeyboardHeight(
  options: SubscribeKeyboardHeightOptions
): SubscribeKeyboardHeightResult;
```

### 파라미터

<Interface
  required
  name="options"
  type="SubscribeKeyboardHeightOptions"
  description="구성 옵션"
  :nested="[
    {
      name: 'options.callback',
      type: '(height: number) => void',
      required: true,
      description: '업데이트된 키보드 높이(픽셀 단위)로 호출될 함수.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description: '참일 경우 현재 키보드 높이로 즉시 호출될 콜백.',
    },
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '16',
      description: '밀리초 단위의 쓰로틀 간격.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="SubscribeKeyboardHeightResult"
  description="언사브스크라이브 함수를 포함하는 객체."
  :nested="[
    {
      name: 'unsubscribe',
      type: '() => void',
      required: false,
      description: '모든 리스너의 구독을 해제하고 키보드 높이 업데이트를 중단해요.',
    },
  ]"
/>

## 예시

```tsx
const { unsubscribe } = subscribeKeyboardHeight({
  callback: height => {
    footer.style.paddingBottom = `${height}px`;
  },
  immediate: true,
});

// 나중에 정리가 필요할 때
unsubscribe();
```
