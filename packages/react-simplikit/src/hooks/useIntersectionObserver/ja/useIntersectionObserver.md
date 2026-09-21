# useIntersectionObserver

`useIntersectionObserver` は、指定した DOM 要素が画面に表示されているかどうかを検出する React フックです。
`IntersectionObserver` API を使用して、要素がビューポートに入ったときや出たときにコールバックを実行します。

## インターフェース

```ts
function useIntersectionObserver<Element extends HTMLElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit
): (element: Element | null) => void;
```

### パラメータ

<Interface
  required
  name="callback"
  type="(entry: IntersectionObserverEntry) => void"
  description="要素の表示状態が変わったときに実行されるコールバック関数です。<code>entry.isIntersecting</code> で、要素が表示範囲内にあるかどうかを確認できます。"
/>

<Interface
  required
  name="options"
  type="IntersectionObserverInit"
  description="<code>IntersectionObserver</code> のオプションです。"
  :nested="[
    {
      name: 'options.root',
      type: 'Element | Document | null',
      required: false,
      description:
        '対象要素の表示状態を確認する際に、ビューポートとして使用する要素です。',
    },
    {
      name: 'options.rootMargin',
      type: 'string',
      required: false,
      description: 'ルートの周囲のマージンです。',
    },
    {
      name: 'options.threshold',
      type: 'number | number[]',
      required: false,
      description:
        '対象要素がどの割合まで表示されたときにオブザーバーのコールバックを実行するかを示す、単一の数値または数値の配列です。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="(element: Element | null) => void"
  description="要素を設定する関数です。この関数を <code>ref</code> 属性に指定すると、要素の表示状態が変わるたびに <code>callback</code> が実行されます。"
/>

## 使用例

```tsx
import { useIntersectionObserver } from 'react-simplikit';

function Component() {
  const ref = useIntersectionObserver<HTMLDivElement>(
    entry => {
      if (entry.isIntersecting) {
        console.log('Element is in view:', entry.target);
      } else {
        console.log('Element is out of view:', entry.target);
      }
    },
    { threshold: 0.5 }
  );

  return <div ref={ref}>Observe me!</div>;
}
```
