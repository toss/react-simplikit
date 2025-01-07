# useInterval

`useInterval`은 주기적으로 함수를 실행하는 훅이에요.

## 인터페이스

```ts
type IntervalOptions =
  | number
  | {
      delay: number;
      enabled?: boolean;
      immediate?: boolean;
    };

function useInterval(callback: () => void, options: IntervalOptions): void;
```

### 파라미터

- `callback` (`() => void`): 주기적으로 실행할 함수예요.
- `options` (`IntervalOptions`): 실행할 주기와 옵션을 설정할 수 있어요.
  - `delay` (`number`): 실행 간격(밀리초)을 설정해요.
  - `immediate` (`boolean`): true면 즉시 실행하고, false면 delay만큼 기다리고 실행해요.
  - `enabled` (`boolean`): false면 실행되지 않아요.

### 반환 값

이 훅은 아무것도 반환하지 않아요.

### 주의사항

- 컴포넌트가 언마운트되면 타이머는 자동으로 정리돼요.
- `delay` 값이 변경되면 타이머가 다시 시작돼요.
- `enabled`를 통해 실행을 제어할 수 있어요.

## 예시

### 기본 사용법

```tsx
import { useInterval } from 'reactie';

function Timer() {
  const [time, setTime] = useState(0);

  useInterval(() => {
    setTime(prev => prev + 1);
  }, 1000);

  return (
    <div>
      <p>{time}초</p>
    </div>
  );
}
```

### 스탑 워치

조건에 따라 실행을 제어하려면 `enabled`를 `false`로 설정할 수 있어요.

```tsx
import { useInterval } from 'reactie';

function StopWatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => {
      setTime(prev => prev + 1);
    },
    {
      delay: 1000,
      enabled: isRunning,
    }
  );

  return (
    <div>
      <p>{time}초</p>
      <button onClick={() => setIsRunning(prev => !prev)}>{isRunning ? '정지' : '시작'}</button>
    </div>
  );
}
```

### 폴링으로 데이터 업데이트하기

`immediate: true`를 사용하면 컴포넌트가 마운트되자마자 데이터를 가져오고, 이후 지정된 간격으로 데이터를 업데이트해요.

```tsx
import { useInterval } from 'reactie';

function PollingExample() {
  const [data, setData] = useState<string>(null);

  useInterval(
    async () => {
      const data = await getData();
      setData(data);
    },
    {
      delay: 3000,
      immediate: true, // 즉시 콜백을 실행하고 3초마다 콜백을 실행해요.
    }
  );

  return <div>{data}</div>;
}
```
