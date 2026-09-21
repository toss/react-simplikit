# usePreservedReference

`usePreservedReference` は、値が変わっていない場合にその参照を維持しながら、最新の状態を安全に使えるようにする React フックです。
不要な再レンダリングを防ぎ、常に最新のデータにアクセスできます。

## インターフェース

```ts
function usePreservedReference<T extends NotNullishValue>(
  value: T,
  areValuesEqual?: (a: T, b: T) => boolean
): T;
```

### パラメータ

<Interface
  required
  name="value"
  type="T"
  description="参照を維持する値。比較の結果、状態の値が変わっていれば、新しい参照を返します。"
/>

<Interface
  name="areValuesEqual"
  type="(a: T, b: T) => boolean"
  description="2 つの値が等しいかを判定する省略可能な関数。デフォルトでは <code>JSON.stringify</code> で比較します。"
/>

### 戻り値

<Interface
  name=""
  type="T"
  description="値が前の値と等しいと判定された場合は同じ参照を返し、それ以外の場合は新しい参照を返します。"
/>

## 使用例

```tsx
import { usePreservedReference } from 'react-simplikit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(state);

  return <div>{preservedState.key}</div>;
}
```

```tsx
import { usePreservedReference } from 'react-simplikit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(
    state,
    (a, b) => a.key === b.key
  );

  return <div>{preservedState.key}</div>;
}
```
