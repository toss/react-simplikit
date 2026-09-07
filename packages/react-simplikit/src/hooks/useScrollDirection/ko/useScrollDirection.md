# useScrollDirection

스크롤 방향을 감지하는 React 훅이에요.

스크롤 방향(위/아래)과 현재 스크롤 위치를 반환해요. 성능 최적화를 위해 기본적으로 50ms 쓰로틀이 적용되어 있어요.

## 인터페이스

```ts
function useScrollDirection(
  options?: UseScrollDirectionOptions
): ScrollDirectionState;
```

### 매개변수

<Interface
  name="options"
  type="UseScrollDirectionOptions"
  description="스크롤 방향 감지를 위한 설정 옵션이에요."
  :nested="[
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '50',
      description: '스크롤 이벤트 처리 빈도를 제한하는 쓰로틀 간격 (밀리초)',
    },
  ]"
/>

### 반환값

<Interface
name=""
type="ScrollDirectionState"
description="스크롤 방향과 위치를 담은 객체예요."
:nested="[
{
name: 'direction',
type: &quot;'up' | 'down' | null&quot;,
required: false,
description: '현재 스크롤 방향. 초기 렌더링 시에는 <code>null</code>',
},
{
name: 'position',
type: 'number',
required: false,
description: '현재 세로 스크롤 위치 (픽셀 단위)',
},
]"
/>

## 예제

```tsx
function Header() {
  const { direction, position } = useScrollDirection();

  // Hide header on scroll down
  const isHidden = direction === 'down' && position > 100;

  return <header className={isHidden ? 'hidden' : 'visible'}>My Header</header>;
}
```

### 커스텀 쓰로틀 간격

```tsx
function MyComponent() {
  // Update every 100ms instead of default 50ms
  const { direction, position } = useScrollDirection({ throttleMs: 100 });

  return (
    <div>
      Scrolling {direction}! Position: {position}px
    </div>
  );
}
```

## 참고사항

- **SSR 안전성**: `window.scrollY`에 접근하기 전에 `isServer()`를 확인하여 서버 사이드 렌더링을 안전하게 처리해요
- **성능**: 쓰로틀을 사용하여 스크롤 이벤트 처리 빈도를 제한해요 (기본값: 50ms)
- **Passive 리스너**: 더 나은 스크롤 성능을 위해 `{ passive: true }` 옵션으로 스크롤 이벤트 리스너를 등록해요
- **정리(Cleanup)**: 컴포넌트 언마운트 시 이벤트 리스너와 타이머를 자동으로 제거해요
- **브라우저 지원**: `window`와 `scrollY`를 지원하는 브라우저 환경이 필요해요
