# useKeyboardHeight

모바일 온스크린 키보드의 높이를 실시간으로 추적하는 리액트 훅이에요. 키보드가 나타나거나 사라지거나 크기가 변경될 때 자동으로 업데이트돼요.

## Interface

```ts
function useKeyboardHeight(
  options?: UseKeyboardHeightOptions
): UseKeyboardHeightResult;
```

### 파라미터

<Interface
  name="options"
  type="UseKeyboardHeightOptions"
  description="키보드 높이 추적 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '만약 <code>true</code>이면, 마운트 시 즉시 현재 키보드 높이를 가져와요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="UseKeyboardHeightResult"
  description="키보드 높이 정보를 담은 객체예요."
  :nested="[
    {
      name: 'keyboardHeight',
      type: 'number',
      description:
        '현재 키보드 높이(px)예요. 키보드가 닫혀 있으면 <code>0</code>이에요.',
    },
  ]"
/>

## 예시

```tsx
function ChatInput() {
  const { keyboardHeight } = useKeyboardHeight();

  return (
    <div style={{ paddingBottom: `${keyboardHeight}px` }}>
      <input type="text" placeholder="메시지를 입력하세요" />
    </div>
  );
}
```

```tsx
function KeyboardStatus() {
  const { keyboardHeight } = useKeyboardHeight();

  return (
    <div>
      {keyboardHeight > 0
        ? `키보드가 열려 있어요 (${keyboardHeight}px)`
        : '키보드가 닫혀 있어요'}
    </div>
  );
}
```
