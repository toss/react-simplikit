# なぜ react-simplikit なのか

数多くの React ベースのライブラリの中で、なぜ `react-simplikit` を選ぶべきなのでしょうか。私たちが大切にしているコアバリューを見ながら、`react-simplikit` を使うことがなぜ「React を React らしく書くこと」と同じなのかを理解していきましょう。

## 宣言的インターフェース

タイマーを自分で管理する代わりに、繰り返し処理をいつ実行するかを宣言できます。たとえばカウントダウンでは、実行中で残り時間がある間だけ、1 秒ごとに値を減らします。一時停止したときや 0 になったときは、タイマーも停止します。

どちらの例も同じカウントダウンを実装しています。React アプリで `<Countdown />` をレンダリングし、Pause と Resume ボタンで操作してください。Server Components を使うフレームワークでは、例を Client Component（`'use client'`）に配置してください。

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

[useInterval](/ja/hooks/useInterval) の `enabled` は実行条件を、`delay` は実行間隔を表します。フックはオプションの変更に応じてタイマーを管理し、コンポーネントのアンマウント時にタイマーを解除します。コンポーネントでは必要な動作を宣言するだけです。

## 小さいバンドルサイズ

Web サービスにとって、応答速度の速さは非常に重要です。だからこそ、Web サービスを構成するライブラリである `react-simplikit` にとって、小さいバンドルサイズは非常に重要です。`react-simplikit` は、今もこれからも、できる限り小さいバンドルサイズを提供できるよう努めています。

`react-simplikit` は `react-use` と比較して、以下のように最大で約 89% 小さいサイズを実現しています。

|                                                      | react-simplikit                                                   | react-use                                                    | 差分   |
| ---------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| Unpacked Size                                        | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8% |
| Minified Size                                        | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9% |
| Gzipped Size                                         | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9% |
| 関数 1 つあたりの平均サイズ<br/>(Minified Size 基準) | 318.2 byte                                                        | 696.3 byte                                                   | -54.3% |
