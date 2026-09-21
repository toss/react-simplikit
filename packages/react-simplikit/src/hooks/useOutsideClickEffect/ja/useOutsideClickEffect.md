# useOutsideClickEffect

`useOutsideClickEffect` は、指定したコンテナーの外側でクリックイベントが発生したときにコールバックを実行する React フックです。
外側のクリックでモーダル、ドロップダウン、ツールチップなどの UI コンポーネントを閉じる場合に役立ちます。

## インターフェース

```ts
function useOutsideClickEffect(
  container: HTMLElement | HTMLElement[] | null,
  callback: () => void
): void;
```

### パラメータ

<Interface
  required
  name="container"
  type="HTMLElement | HTMLElement[] | null"
  description="単一の HTML 要素、HTML 要素の配列、または <code>null</code> です。<code>null</code> の場合、コールバックは実行されません。"
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
