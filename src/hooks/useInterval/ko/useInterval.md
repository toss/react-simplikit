# useInterval

`useInterval`은 지정된 간격으로 함수를 실행하는 React 훅이에요. 타이머, 데이터 폴링 및 기타 반복 작업에 유용해요.

## 인터페이스

```ts
function useInterval(
  callback: () => void,
  options: number | { delay: number; enabled?: boolean; immediate?: boolean }
): void;
```

### 파라미터

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">callback</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type">() =&gt; void</span>
    <br />
    <p class="post-parameters--description">
      주기적으로 실행될 함수예요.
    </p>
  </li>
</ul>
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">options</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type"
      >number | { delay: number; enabled?: boolean; immediate?: boolean }</span
    >
    <br />
    <p class="post-parameters--description">
      인터벌 동작을 설정해요.
    </p>
    <ul class="post-parameters-ul">
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.delay</span
        ><span class="post-parameters--required">required</span> ·
        <span class="post-parameters--type">number</span>
        <br />
        <p class="post-parameters--description">
          인터벌 주기(밀리초)예요. <code>null</code>이면 인터벌이 실행되지 않아요.
        </p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.immediate</span
        ><span class="post-parameters--type">boolean</span> ·
        <span class="post-parameters--default">false</span>
        <br />
        <p class="post-parameters--description">
          <code>true</code>이면 인터벌 시작 전에 즉시 실행돼요.
        </p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.enabled</span
        ><span class="post-parameters--type">boolean</span> ·
        <span class="post-parameters--default">true</span>
        <br />
        <p class="post-parameters--description">
          <code>false</code>이면 인터벌이 실행되지 않아요.
        </p>
      </li>
    </ul>
  </li>
</ul>

### 반환 값

이 훅은 아무것도 반환하지 않아요.

## 예시

```tsx
import { useInterval } from 'react-simplikit';

function Timer() {
  const [time, setTime] = useState(0);

  useInterval(() => {
    setTime(prev => prev + 1);
  }, 1000);

  return (
    <div>
      <p>{time} seconds</p>
    </div>
  );
}
```

### 스탑 워치

조건에 따라 실행을 제어하려면 `enabled`를 `false`로 설정할 수 있어요.

```tsx
import { useInterval } from 'react-simplikit';

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
import { useInterval } from 'react-simplikit';

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
