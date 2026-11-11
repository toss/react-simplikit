# subscribeKeyboardHeight

`subscribeKeyboardHeight`는 온스크린 키보드 높이의 변화를 구독하는 유틸리티 함수예요. 전달한 콜백은 키보드가 나타나거나 사라지거나 크기가 바뀌는 등 키보드 높이가 바뀔 수 있을 때마다 호출돼요.

이 함수는 내부적으로 Visual Viewport의 `resize`와 `scroll` 이벤트를 모두 감지해요.

- `resize`: Visual Viewport의 높이가 바뀔 때 발생해요.
- `scroll`: Visual Viewport의 오프셋이 바뀔 때 발생해요. iOS에서는 크기가 바뀌지 않고 뷰포트만 이동할 수 있어서 이 이벤트가 중요해요.

**성능 최적화**

- 기본적으로 16ms(약 60fps) 간격으로 스로틀링해서 콜백이 지나치게 자주 호출되지 않게 해요.
- 높이가 그대로면 콜백을 건너뛰어요(중복 제거).

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
  description="설정 옵션이에요."
  :nested="[
    {
      name: 'options.callback',
      type: '(height: number) => void',
      required: true,
      description: '업데이트된 키보드 높이(px)를 받아 호출되는 함수예요.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description: '<code>true</code>이면 현재 키보드 높이로 콜백을 즉시 호출해요.',
    },
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '16',
      description: '콜백 호출을 스로틀링할 간격(밀리초)이에요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="SubscribeKeyboardHeightResult"
  description="구독 해제 함수를 담은 객체예요."
  :nested="[
    {
      name: 'unsubscribe',
      type: '() => void',
      required: false,
      description: '모든 리스너를 해제하고 더 이상 키보드 높이 업데이트를 받지 않아요.',
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
