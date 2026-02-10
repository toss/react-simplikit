# getSafeAreaInset

`getSafeAreaInset`은 모든 안전 영역 간격을 픽셀 단위로 반환하는 유틸리티 함수에요. 이 함수는 임시 DOM 요소를 만들어서 CSS `env(safe-area-inset-*)` 값을 읽어와 계산된 스타일을 확인합니다. 안전 영역 간격은 기기별 UI 요소를 고려해요:

- **위**: 노치, 다이나믹 아일랜드 또는 상태 표시줄
- **아래**: Face ID 장치의 홈 인디케이터
- **왼쪽/오른쪽**: 가로 모드에서 라운드된 코너
  전형적인 값 (Face ID가 있는 iPhone, 세로 모드):
- 위: 47-59px (노치/다이나믹 아일랜드)
- 아래: 34px (홈 인디케이터)
- 왼쪽/오른쪽: 0px

## 인터페이스

```ts
function getSafeAreaInset(): SafeAreaInset;
```

### 파라미터

### 반환 값

<Interface
  name=""
  type="SafeAreaInset"
  description="네 면의 모든 안전 영역 간격을 포함하며, 사용 불가 시 모두 0으로 표시돼요."
  :nested="[
    {
      name: 'top',
      type: 'number',
      required: false,
      description: '위쪽 안전 영역 간격 (픽셀 단위)'
    },
    {
      name: 'bottom',
      type: 'number',
      required: false,
      description: '아래쪽 안전 영역 간격 (픽셀 단위)'
    },
    {
      name: 'left',
      type: 'number',
      required: false,
      description: '왼쪽 안전 영역 간격 (픽셀 단위)'
    },
    {
      name: 'right',
      type: 'number',
      required: false,
      description: '오른쪽 안전 영역 간격 (픽셀 단위)'
    }
  ]"
/>

## 예시

```tsx
const { top, bottom, left, right } = getSafeAreaInset();

header.style.paddingTop = `${top}px`;
footer.style.paddingBottom = `${bottom}px`;
```
