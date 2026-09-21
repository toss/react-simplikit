# useRefEffect

`useRefEffect` は、特定の DOM 要素への参照を設定し、その要素が変わるたびにコールバックを実行する React フックです。
要素が変わるたびにクリーンアップ関数を呼び出し、メモリリークを防ぎます。

## インターフェース

```ts
function useRefEffect<RefElement extends HTMLElement = HTMLElement>(
  callback: (element: RefElement) => CleanupCallback | void,
  deps: DependencyList
): (element: RefElement | null) => void;
```

### パラメータ

<Interface
  required
  name="callback"
  type="(element: RefElement) => CleanupCallback | void"
  description="要素が設定されたときに実行するコールバック関数。クリーンアップ関数を返せます。"
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="コールバックを再実行するタイミングを定義する依存関係の配列。<code>deps</code> が変わるたびに <code>callback</code> を再実行します。"
/>

### 戻り値

<Interface
  name=""
  type="(element: RefElement | null) => void"
  description="要素を設定する関数。この関数を <code>ref</code> 属性に渡すと、要素が変わるたびに <code>callback</code> を呼び出します。"
/>

## 使用例

```tsx
import { useRefEffect } from 'react-simplikit';

function Component() {
  const ref = useRefEffect<HTMLDivElement>(element => {
    console.log('Element mounted:', element);

    return () => {
      console.log('Element unmounted:', element);
    };
  }, []);

  return <div ref={ref}>Basic Example</div>;
}
```
