# useOutsideClickRef

`useOutsideClickRef` は、コールバック ref を返し、その ref を接続したすべての要素の外側でクリックが発生したときに `onOutsideClick` を実行する React フックです。
トリガー、そのメニュー、ポータル内のコンテンツに同じ ref を接続してください。内側で押し始めて外側で離した操作は、外側のクリックとして扱われません。

## インターフェース

```ts
function useOutsideClickRef(options: Object): (element: Element | null) => void;
```

### パラメータ

<Interface
  required
  name="options"
  type="Object"
  description="外側のクリックを検出するためのオプション。"
  :nested="[
    {
      name: 'options.onOutsideClick',
      type: '() => void',
      required: true,
      description:
        '接続したすべての要素の外側でクリックが発生したときに実行する関数です。クリックされた要素自身の <code>onClick</code> より先に実行されます。',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '外側のクリックを検出するかどうかです。<code>false</code> の間は <code>onOutsideClick</code> を呼び出しません。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="(element: Element | null) => void"
  description="内側として扱う各要素の <code>ref</code> 属性に渡すコールバック ref です。レンダリングをまたいで同じ参照を保ちます。"
/>

## 使用例

```tsx
import { useOutsideClickRef } from 'react-simplikit';
import { useState } from 'react';

function Dropdown({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClickRef({
    enabled: open,
    onOutsideClick: () => {
      setOpen(false);
      onClose();
    },
  });

  return (
    <>
      <button ref={ref} onClick={() => setOpen(prev => !prev)}>
        Menu
      </button>
      {open && <ul ref={ref}>...</ul>}
    </>
  );
}
```
