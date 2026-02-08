# useSafeAreaInset

Safe area inset 변경사항을 추적하는 React 훅이에요.

화면 방향이 변경될 때(예: 세로에서 가로로) 자동으로 업데이트되는 safe area inset을 반환해요.

Safe area inset은 기기별 UI 요소를 고려해요:

- **top**: 노치, Dynamic Island, 또는 상태 바
- **bottom**: Face ID 기기의 홈 인디케이터
- **left/right**: 가로 모드에서의 둥근 모서리

## 인터페이스

### 매개변수

이 훅은 매개변수를 받지 않아요.

### 반환값

다음 속성을 가진 객체를 반환해요:

| 속성     | 타입     | 설명                                                             |
| -------- | -------- | ---------------------------------------------------------------- |
| `top`    | `number` | 상단 safe area inset (픽셀) - 노치, Dynamic Island, 또는 상태 바 |
| `bottom` | `number` | 하단 safe area inset (픽셀) - Face ID 기기의 홈 인디케이터       |
| `left`   | `number` | 좌측 safe area inset (픽셀) - 가로 모드에서의 둥근 모서리        |
| `right`  | `number` | 우측 safe area inset (픽셀) - 가로 모드에서의 둥근 모서리        |

#### 일반적인 값 (Face ID가 있는 iPhone, 세로 모드)

| 속성     | 일반적인 값 | 설명                        |
| -------- | ----------- | --------------------------- |
| `top`    | 47-59px     | 노치 또는 Dynamic Island    |
| `bottom` | 34px        | 홈 인디케이터               |
| `left`   | 0px         | 세로 모드에서는 장애물 없음 |
| `right`  | 0px         | 세로 모드에서는 장애물 없음 |

## 예제

### 기본 사용법

```tsx
function MyComponent() {
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
      Safe area를 존중하는 콘텐츠
    </div>
  );
}
```

### 회전을 인식하는 헤더

```tsx
// 화면이 회전하면 자동으로 업데이트돼요
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

### 고정 하단 내비게이션

```tsx
function BottomNavigation() {
  const { bottom } = useSafeAreaInset();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: bottom,
      }}
    >
      <NavItem icon="home" />
      <NavItem icon="search" />
      <NavItem icon="profile" />
    </nav>
  );
}
```

## 주의사항

- **SSR 안전성**: SSR 환경에서는 `{ top: 0, bottom: 0, left: 0, right: 0 }`을 반환해요. null 체크가 필요 없어요.
- **자동 업데이트**: `resize`와 `orientationchange` 이벤트를 통해 방향 변경 시 inset이 자동으로 업데이트돼요.
- **성능**: 방향 변경 중 블로킹 업데이트를 방지하기 위해 React의 `startTransition`을 사용해요.
- **CSS 대안**: 정적 레이아웃의 경우 CSS `env(safe-area-inset-*)`을 직접 사용하는 것도 고려해보세요.
- **사용 사례**:
  - 기기 노치를 존중하는 전체 화면 레이아웃 생성
  - 고정 헤더와 푸터 구축
  - 적절한 패딩으로 가로 모드 처리
  - Dynamic Island가 있는 기기 지원
