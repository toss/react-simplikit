# useVisibilityEvent

`useVisibilityEvent` は、ドキュメントの表示状態の変化を監視し、コールバックを呼び出す React フックです。

## インターフェース

```ts
function useVisibilityEvent(
  callback: (visibilityState: 'visible' | 'hidden') => void,
  options?: object
): void;
```

### パラメータ

<Interface
  required
  name="callback"
  type="(visibilityState: 'visible' | 'hidden') => void"
  description="表示状態が変わったときに呼び出す関数。現在の表示状態（'visible' または 'hidden'）を引数として受け取ります。"
/>

<Interface
  name="options"
  type="object"
  description="フックの省略可能な設定。"
  :nested="[
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'true の場合、マウント時に現在の表示状態を渡してコールバックをすぐに呼び出します。',
    },
  ]"
/>

### 戻り値

この関数は値を返しません。

## 使用例

```tsx
import { useVisibilityEvent } from 'react-simplikit';

function Component() {
  useVisibilityEvent(visibilityState => {
    console.log(`Document is now ${visibilityState}`);
  });

  return <p>Check the console for visibility changes.</p>;
}
```
