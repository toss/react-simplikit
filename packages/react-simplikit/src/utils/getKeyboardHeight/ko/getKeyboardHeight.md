# getKeyboardHeight

`getKeyboardHeight`는 현재 화면에 표시된 키보드의 높이를 픽셀 단위로 반환하는 유틸리티 함수예요.

이 함수는 Visual Viewport API로 키보드 높이를 계산해요. Visual Viewport를 지원하는 최신 환경(Safari / WKWebView 14+, Chrome / Android WebView 80+)을 전제로 해요.

키보드 높이는 다음 식으로 계산해요.

`window.innerHeight - visualViewport.height - visualViewport.offsetTop`

iOS에서는 키보드가 나타날 때 Visual Viewport가 세로로 이동할 수 있어요. 이 동작을 올바르게 처리하려면 `offsetTop`을 빼야 해요.

## 인터페이스

```ts
function getKeyboardHeight(): number;
```

### 파라미터

이 함수는 파라미터를 받지 않아요.

### 반환 값

<Interface
  name=""
  type="number"
  description="픽셀 단위의 키보드 높이예요. 키보드가 보이지 않으면 0을 반환해요."
/>

## 예시

```tsx
const height = getKeyboardHeight();

if (height > 0) {
  footer.style.paddingBottom = `${height}px`;
}
```
