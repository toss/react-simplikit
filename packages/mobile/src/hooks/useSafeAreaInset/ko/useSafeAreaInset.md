# useSafeAreaInset

디바이스의 Safe Area Inset을 실시간으로 추적하는 리액트 훅이에요. 화면 방향이 변경될 때(세로 ↔ 가로) 자동으로 업데이트돼요.

Safe Area Inset은 디바이스별 UI 요소를 고려해요:

- **top**: 노치, Dynamic Island, 또는 상태 바
- **bottom**: Face ID 디바이스의 홈 인디케이터
- **left/right**: 가로 모드에서의 둥근 모서리

## Interface

```ts
function useSafeAreaInset(): SafeAreaInset;
```

### 파라미터

이 훅은 파라미터를 받지 않아요.

### 반환 값

<Interface
  name=""
  type="SafeAreaInset"
  description="네 방향의 Safe Area Inset을 담은 객체예요."
  :nested="[
    {
      name: 'top',
      type: 'number',
      description:
        '상단 Safe Area Inset(px)이에요. 노치, Dynamic Island, 또는 상태 바 영역이에요.',
    },
    {
      name: 'bottom',
      type: 'number',
      description:
        '하단 Safe Area Inset(px)이에요. Face ID 디바이스의 홈 인디케이터 영역이에요.',
    },
    {
      name: 'left',
      type: 'number',
      description:
        '좌측 Safe Area Inset(px)이에요. 가로 모드에서의 둥근 모서리 영역이에요.',
    },
    {
      name: 'right',
      type: 'number',
      description:
        '우측 Safe Area Inset(px)이에요. 가로 모드에서의 둥근 모서리 영역이에요.',
    },
  ]"
/>

## 예시

```tsx
function SafeLayout() {
  const safeArea = useSafeAreaInset();

  return (
    <div
      style={{
        paddingTop: safeArea.top,
        paddingBottom: safeArea.bottom,
        paddingLeft: safeArea.left,
        paddingRight: safeArea.right,
      }}
    >
      Safe Area를 고려한 콘텐츠
    </div>
  );
}
```

```tsx
// 화면 회전 시 자동으로 업데이트
function RotationAwareHeader() {
  const { top, left, right } = useSafeAreaInset();

  return (
    <header
      style={{
        paddingTop: top,
        paddingLeft: left,
        paddingRight: right,
      }}
    >
      헤더 콘텐츠
    </header>
  );
}
```
