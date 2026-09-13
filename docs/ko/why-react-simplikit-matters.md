# react-simplikit, 선택의 이유

왜 많은 리액트 기반 라이브러리 중 `react-simplikit`을 선택해야 할까요? 우리가 중요하게 생각하는 가치에 대해 알아보면서, 왜 `react-simplikit`을 사용하는 것이 리액트를 리액트답게 작성하는 것과 같은지 알아볼게요.

## 선언적 인터페이스

타이머를 직접 관리하는 대신 반복 작업을 언제 실행할지 선언할 수 있어요. 예를 들어 카운트다운은 실행 중이고 남은 시간이 있을 때만 1초마다 값을 줄여야 해요. 일시정지하거나 0에 도달하면 타이머도 멈춰야 해요.

두 예제는 같은 카운트다운을 구현해요. React 앱에서 `<Countdown />`을 렌더링하고 Pause와 Resume 버튼으로 제어해 보세요. Server Components를 사용하는 프레임워크에서는 예제를 Client Component(`'use client'`)에 넣으세요.

::: code-group

```tsx [without-react-simplikit.tsx]
import { useEffect, useState } from 'react';

function Countdown() {
  const [remainingSeconds, setRemainingSeconds] = useState(10);
  const [isRunning, setIsRunning] = useState(true);
  const enabled = isRunning && remainingSeconds > 0;

  useEffect(
    function startCountdown() {
      if (!enabled) {
        return;
      }

      const intervalId = setInterval(() => {
        setRemainingSeconds(seconds => Math.max(0, seconds - 1));
      }, 1000);

      return () => clearInterval(intervalId);
    },
    [enabled]
  );

  return (
    <div>
      <p>{remainingSeconds} seconds</p>
      <button
        type="button"
        disabled={remainingSeconds === 0}
        onClick={() => setIsRunning(running => !running)}
      >
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
}
```

```tsx [with-react-simplikit.tsx]
import { useState } from 'react';
import { useInterval } from 'react-simplikit';

function Countdown() {
  const [remainingSeconds, setRemainingSeconds] = useState(10);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(
    () => {
      setRemainingSeconds(seconds => Math.max(0, seconds - 1));
    },
    {
      delay: 1000,
      enabled: isRunning && remainingSeconds > 0,
    }
  );

  return (
    <div>
      <p>{remainingSeconds} seconds</p>
      <button
        type="button"
        disabled={remainingSeconds === 0}
        onClick={() => setIsRunning(running => !running)}
      >
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
}
```

:::

[useInterval](/ko/hooks/useInterval)의 `enabled`는 실행 조건을, `delay`는 실행 주기를 나타내요. 훅은 옵션 변경에 따라 타이머를 관리하고, 컴포넌트가 언마운트되면 타이머를 정리해요. 컴포넌트에는 필요한 동작만 선언하면 돼요.

## 작은 번들 사이즈

웹 서비스 입장에서 빠른 응답속도는 매우 중요해요. 그렇기에 웹 서비스를 구성하기 위한 라이브러리인 `react-simplikit`에게 작은 번들 사이즈는 매우 중요해요. `react-simplikit`은 지금도, 앞으로도 최대한 작은 번들 사이즈를 제공하기 위해 노력하고자 해요.

`react-simplikit`은 `react-use`에 대비하여, 아래와 같이 최대 약 89% 작은 크기를 가져요.

|                                            | react-simplikit                                                   | react-use                                                    | 차이   |
| ------------------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| Unpacked Size                              | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8% |
| Minified Size                              | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9% |
| Gzipped Size                               | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9% |
| 평균 함수 당 크기<br/>(Minified Size 기준) | 318.2 byte                                                        | 696.3 byte                                                   | -54.3% |
