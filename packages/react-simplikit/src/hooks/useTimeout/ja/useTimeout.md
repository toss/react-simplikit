# useTimeout

`useTimeout` は、指定した時間が経過した後にコールバック関数を実行する React フックです。
React のライフサイクルに合わせて `setTimeout` を管理し、アンマウント時や依存関係が変わったときにクリーンアップを行います。

## インターフェース

```ts
function useTimeout(callback: () => void, delay: number = 0): void;
```

### パラメータ

<Interface
  required
  name="callback"
  type="() => void"
  description="指定した時間が経過した後に実行する関数。"
/>

<Interface
  name="delay"
  type="number"
  description="コールバックを実行するまでの待機時間（ミリ秒単位）。"
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

  useTimeout(() => {
    setTitle('Searching for products...');
  }, 2000);

  useTimeout(() => {
    setTitle('Almost done...');
  }, 4000);

  return <div>{title}</div>;
}
```
