# isKeyboardVisible

`isKeyboardVisible`은 현재 화면 키보드가 표시되어 있는지를 확인하는 유틸리티 함수에요. 이 함수는 내부적으로 `getKeyboardHeight()`를 사용하고, 키보드 높이가 0보다 크면 `true`를 반환해요.

## 인터페이스

```ts
function isKeyboardVisible(): boolean;
```

### 파라미터

### 반환 값

<Interface
  name=""
  type="boolean"
  description="만약 키보드가 보이면, <code>false</code>를 반환해요."
/>

## 예시

```tsx
if (isKeyboardVisible()) {
  console.log('키보드가 열렸어요');
} else {
  console.log('키보드가 닫혔어요');
}
```
