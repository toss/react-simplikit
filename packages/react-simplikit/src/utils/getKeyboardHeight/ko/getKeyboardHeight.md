# getKeyboardHeight

`getKeyboardHeight`은 현재 화면에 표시된 키보드의 높이를 픽셀로 반환하는 유틸리티 함수에요. 이 함수는 Visual Viewport API를 사용하여 키보드 높이를 계산해요. Visual Viewport가 지원되는 현대 환경(사파리 / WKWebView 14+, 크롬 / 안드로이드 WebView 80+)을 가정해요. 키보드 높이는 다음과 같이 계산돼요: `window.innerHeight - visualViewport.height - visualViewport.offsetTop` - `offsetTop`의 차감은 키보드가 나타날 때 iOS 동작을 올바르게 처리하기 위해 필요해요.

## 인터페이스

```ts
function getKeyboardHeight(): number;
```

### 파라미터

### 반환 값

<Interface
  name=""
  type="number"
  description="픽셀 단위의 키보드 높이. 키보드가 보이지 않을 때는 0을 반환해요."
/>

## 예시

```tsx
const height = getKeyboardHeight();

if (height > 0) {
  footer.style.paddingBottom = `${height}px`;
}
```
