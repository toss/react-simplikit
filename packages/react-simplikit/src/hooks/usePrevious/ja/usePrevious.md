# usePrevious

`usePrevious` は、渡された状態の前の値を返す React フックです。
状態が変わらずに再レンダリングされた場合、前の値をそのまま保持します。
状態がオブジェクトの場合や、変更の検出方法をカスタマイズしたい場合は、`equalityFn` 関数を指定できます。
デフォルトでは、`Object.is(prev, next)` を使って状態の変化を検出します。

## インターフェース

```ts
function usePrevious<T>(
  state: T,
  equalityFn?: (prev: T, next: T) => boolean
): T;
```

### パラメータ

<Interface
  required
  name="state"
  type="T"
  description="前の値を追跡する状態。"
/>

<Interface
  name="equalityFn"
  type="(prev: T, next: T) => boolean"
  description="2 つの状態が等しいかを判定する省略可能な関数。デフォルトでは <code>Object.is</code> で比較します。"
/>

### 戻り値

<Interface name="" type="T" description="状態の前の値。" />

## 使用例

```tsx
const [count, setCount] = useState(0);
// previousCount の初期値は `0`
const previousCount = usePrevious(count);
```
