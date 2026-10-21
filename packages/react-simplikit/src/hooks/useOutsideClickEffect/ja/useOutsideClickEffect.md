# useOutsideClickEffect

`useOutsideClickEffect` は、指定したコンテナーの外側でクリックイベントが発生したときにコールバックを実行する React フックです。
外側のクリックでモーダル、ドロップダウン、ツールチップなどの UI コンポーネントを閉じる場合に役立ちます。

## インターフェース

```ts
function useOutsideClickEffect(
  container: HTMLElement | (HTMLElement | null)[] | null,
  callback: () => void
): void;
```

### パラメータ

<Interface
  required
  name="container"
  type="HTMLElement | (HTMLElement | null)[] | null"
  description="単一の HTML 要素、HTML 要素や <code>null</code> を含む配列、または <code>null</code> です。配列内の <code>null</code> は無視されます。HTML 要素が一つも残らない場合、コールバックは実行されません。"
/>

<Interface
  required
  name="callback"
  type="() => void"
  description="指定したコンテナーの外側がクリックされたときに実行する関数です。"
/>

### 戻り値

この関数は値を返しません。

## 使用例

```tsx
import { useOutsideClickEffect } from 'react-simplikit';
import { useState } from 'react';

function Example() {
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);

  useOutsideClickEffect(wrapperEl, () => {
    console.log('Outside clicked!');
  });

  return <div ref={setWrapperEl}>Content</div>;
}
```
