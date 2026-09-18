# usePrevious

`usePrevious` は、渡された状態の前の値を返す React フックです。
状態が変わらずに再レンダリングされた場合、前の値をそのまま保持します。
状態がオブジェクトの場合や、変更の検出方法をカスタマイズしたい場合は、`compare` 関数を指定できます。
デフォルトでは、`prev === next` を使って状態の変化を検出します。

## インターフェース

```ts
function usePrevious<T>(state: T, compare?: (prev: T, next: T) => boolean): T;
```

### パラメータ

<Interface
  required
  name="state"
  type="T"
  description="前の値を追跡する状態。"
/>

<Interface
  name="compare"
  type="(prev: T, next: T) => boolean"
  description="状態が変わったかを判定する省略可能な比較関数。"
/>

### 戻り値

<Interface name="" type="T" description="状態の前の値。" />

## 使用例

```tsx
const [count, setCount] = useState(0);
// previousCount の初期値は `0`
const previousCount = usePrevious(count);
```
