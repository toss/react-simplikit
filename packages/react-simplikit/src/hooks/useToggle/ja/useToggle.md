# useToggle

`useToggle` は、真偽値の状態管理を簡単にする React フックです。
状態を `true` と `false` の間で切り替える関数を提供します。

## インターフェース

```ts
function useToggle(
  initialValue: boolean = false
): [state: boolean, toggle: () => void];
```

### パラメータ

<Interface
  name="initialValue"
  type="boolean"
  description="状態の初期値。デフォルトは <code>false</code> です。"
/>

### 戻り値

<Interface
  name=""
  type="[state: boolean, toggle: () => void]"
  description="次の要素を含むタプル。"
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      required: false,
      description: '現在の状態の値。',
    },
    {
      name: 'toggle',
      type: '() => void',
      required: false,
      description: '状態を切り替える関数。',
    },
  ]"
/>

## 使用例

```tsx
import { useToggle } from 'react-simplikit';

function Component() {
  const [open, toggle] = useToggle(false);

  return (
    <div>
      <p>Bottom Sheet state: {open ? 'opened' : 'closed'}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```
