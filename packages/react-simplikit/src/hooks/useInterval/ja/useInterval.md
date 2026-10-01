# useInterval

`useInterval` は、指定した間隔で関数を実行する React フックです。
タイマー、データのポーリング、その他の定期的な処理に役立ちます。

## インターフェース

```ts
function useInterval(
  callback: () => void,
  delayMs: number,
  options?: IntervalOptions
): void;
```

### パラメータ

<Interface
  required
  name="callback"
  type="() => void"
  description="定期的に実行する関数です。"
/>

<Interface
  required
  name="delayMs"
  type="number"
  description="実行間隔をミリ秒で指定します。"
/>

<Interface
  name="options"
  type="IntervalOptions"
  description="追加の動作を設定するオプションです。"
  :nested="[
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '<code>true</code> の場合、定期実行の開始前に即座に実行します。',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description: '<code>false</code> の場合、定期実行は行われません。',
    },
  ]"
/>

### 戻り値

この関数は値を返しません。

## 使用例

```tsx
import { useInterval } from 'react-simplikit';
import { useState } from 'react';

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
