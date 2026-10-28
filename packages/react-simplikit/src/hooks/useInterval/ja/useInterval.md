# useInterval

`useInterval` は、指定した間隔で関数を実行する React フックです。
タイマー、データのポーリング、その他の定期的な処理に役立ちます。

## インターフェース

```ts
function useInterval(options: Object): void;
```

### パラメータ

<Interface
  required
  name="options"
  type="Object"
  description="定期実行の動作を設定します。"
  :nested="[
    {
      name: 'options.onTick',
      type: '() => void',
      required: true,
      description: '定期的に実行する関数です。',
    },
    {
      name: 'options.delayMs',
      type: 'number',
      required: true,
      description: '実行間隔（ミリ秒）です。',
    },
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

  useInterval({
    onTick: () => setTime(prev => prev + 1),
    delayMs: 1000,
  });

  return (
    <div>
      <p>{time} seconds</p>
    </div>
  );
}
```
