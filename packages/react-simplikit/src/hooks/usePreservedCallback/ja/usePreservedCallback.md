# usePreservedCallback

`usePreservedCallback` は、コールバック関数の参照を安定させながら、
常に最新の状態や props にアクセスできるようにする React フックです。不要な再レンダリングを防ぎ、
子コンポーネントにコールバックを渡す場合やイベントリスナーを扱う場合の依存関係の管理を簡単にします。

## インターフェース

```ts
function usePreservedCallback<
  Arguments extends any[] = any[],
  ReturnValue = unknown,
>(callback: (...args: any[]) => any): (...args: any[]) => any;
```

### パラメータ

<Interface
  required
  name="callback"
  type="(...args: any[]) => any"
  description="参照を維持する関数です。コンポーネントが再レンダリングされても、常に最新の状態や props を参照します。"
/>

### 戻り値

<Interface
  name=""
  type="(...args: any[]) => any"
  description="渡されたコールバックと同じシグネチャを持つ関数です。返される関数は参照を安定させながら、最新の状態や props にアクセスします。"
/>

## 使用例

```tsx
import { usePreservedCallback } from 'react-simplikit';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = usePreservedCallback(() => {
    console.log(`Current count: ${count}`);
    setCount(prev => prev + 1);
  });

  return <button onClick={handleClick}>Click me</button>;
}
```
