# getSafeAreaInset

`getSafeAreaInset`은 모든 Safe Area Inset을 픽셀 단위의 객체로 반환하는 유틸리티 함수예요. 이 함수는 임시 DOM 요소를 만들고 그 요소의 계산된 스타일에서 CSS `env(safe-area-inset-*)` 값을 읽어요. Safe Area Inset은 기기별 UI 요소를 반영해요.

- **위**: 노치, 다이나믹 아일랜드 또는 상태 표시줄
- **아래**: Face ID 기기의 홈 인디케이터
- **왼쪽/오른쪽**: 가로 모드의 둥근 모서리

Face ID가 있는 iPhone을 세로로 사용할 때의 일반적인 값은 다음과 같아요.

- 위: 47-59px (노치/다이나믹 아일랜드)
- 아래: 34px (홈 인디케이터)
- 왼쪽/오른쪽: 0px

## 인터페이스

```ts
function getSafeAreaInset(): SafeAreaInset;
```

### 파라미터

이 함수는 파라미터를 받지 않아요.

### 반환 값

<Interface
  name=""
  type="SafeAreaInset"
  description="네 면의 Safe Area Inset을 담은 객체예요. 값을 읽을 수 없으면 모두 0이에요."
  :nested="[
    {
      name: 'top',
      type: 'number',
      required: false,
      description: '위쪽 Safe Area Inset (픽셀 단위)'
    },
    {
      name: 'bottom',
      type: 'number',
      required: false,
      description: '아래쪽 Safe Area Inset (픽셀 단위)'
    },
    {
      name: 'left',
      type: 'number',
      required: false,
      description: '왼쪽 Safe Area Inset (픽셀 단위)'
    },
    {
      name: 'right',
      type: 'number',
      required: false,
      description: '오른쪽 Safe Area Inset (픽셀 단위)'
    }
  ]"
/>

## 예시

```tsx
const { top, bottom, left, right } = getSafeAreaInset();

header.style.paddingTop = `${top}px`;
footer.style.paddingBottom = `${bottom}px`;
```
