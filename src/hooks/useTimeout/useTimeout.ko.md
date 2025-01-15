# useTimeout

`useTimeout`은 지정된 시간이 지난 후에 콜백 함수를 실행하는 React 훅이에요. `window.setTimeout`을 React 생명주기에 맞게 관리해줘요.

## 인터페이스

```typescript
function useTimeout(callback: () => void, delay?: number): void;
```

### 매개변수

- `callback` (`() => void`): 지정된 시간이 지난 후 실행할 함수예요.
- `delay` (`number`, 선택적): 콜백 함수를 실행하기까지 기다릴 시간(밀리초)이에요. 기본값은 0이에요.

### 반환 값

이 훅은 아무것도 반환하지 않아요.

## 예시

### 기본 사용법

```tsx
import { useTimeout } from 'reactive-kit';

function Notification() {
  const [visible, setVisible] = useState(true);

  useTimeout(() => {
    setVisible(false);
  }, 3000); // 3초 후에 알림을 숨김

  if (!visible) return null;
  return <div>3초 후에 이 알림이 사라져요</div>;
}
```

### 조건부로 타이머 설정하기

```tsx
function ConditionalTimer({ shouldStart }: { shouldStart: boolean }) {
  useTimeout(
    () => {
      console.log('타이머 완료!');
    },
    shouldStart ? 2000 : undefined
  );

  return <div>타이머 {shouldStart ? '시작됨' : '중지됨'}</div>;
}
```
