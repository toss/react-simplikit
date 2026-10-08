# useTimeout

`useTimeout` は、指定した時間が経過した後にコールバック関数を実行する React フックです。
React のライフサイクルに合わせて `setTimeout` を管理し、アンマウント時や依存関係が変わったときにクリーンアップを行います。

## インターフェース

```ts
function useTimeout(options: Object): void;
```

### パラメータ

<Interface
  required
  name="options"
  type="Object"
  description="タイムアウトの動作を設定します。"
  :nested="[
    {
      name: 'options.onTimeout',
      type: '() => void',
      required: true,
      description: '指定した時間が経過した後に実行する関数です。',
    },
    {
      name: 'options.delayMs',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: '<code>onTimeout</code> を実行するまでの待機時間（ミリ秒）です。',
    },
  ]"
/>

### 戻り値

この関数は値を返しません。

## 使用例

```tsx
// 指定した時間が経過した後にタイトルを更新します
import { useTimeout } from 'react-simplikit';
import { useState } from 'react';

function Example() {
  const [title, setTitle] = useState('');

  useTimeout({
    onTimeout: () => setTitle('Searching for products...'),
    delayMs: 2000,
  });

  useTimeout({
    onTimeout: () => setTitle('Almost done...'),
    delayMs: 4000,
  });

  return <div>{title}</div>;
}
```
