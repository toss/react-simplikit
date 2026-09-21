# useConditionalEffect

`useConditionalEffect` は、条件を判定する関数に基づいてエフェクトを実行する React フックです。
依存関係の変化だけでなく、より細かくエフェクトの実行タイミングを制御できます。

## インターフェース

```ts
function useConditionalEffect<T extends DependencyList>(
  effect: EffectCallback,
  deps: DependencyList,
  condition: (prevDeps: T | undefined, currentDeps: T) => boolean
): void;
```

### パラメータ

<Interface
  required
  name="effect"
  type="EffectCallback"
  description="実行するエフェクトのコールバック。"
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="useEffect と同様の依存配列。"
/>

<Interface
  required
  name="condition"
  type="(prevDeps: T | undefined, currentDeps: T) => boolean"
  description="前回と現在の依存配列に基づいて、エフェクトを実行するかどうかを決める関数です。<br />- 初回レンダリングでは、<code>prevDeps</code> は <code>undefined</code> になります。<code>condition</code> 関数では、この場合を扱う必要があります。<br />- 初回レンダリングでエフェクトを実行するには、<code>prevDeps</code> が <code>undefined</code> のときに <code>true</code> を返します。<br />- 初回レンダリングでエフェクトを実行しない場合は、<code>prevDeps</code> が <code>undefined</code> のときに <code>false</code> を返します。"
/>

### 戻り値

この関数は値を返しません。

## 使用例

```tsx
import { useConditionalEffect } from 'react-simplikit';

function Component() {
  const [count, setCount] = useState(0);

  // count が増えた場合にのみエフェクトを実行します
  useConditionalEffect(
    () => {
      console.log(`Count increased to ${count}`);
    },
    [count],
    (prevDeps, currentDeps) => {
      // count が定義されていて、値が増えた場合にのみ実行します
      return prevDeps && currentDeps[0] > prevDeps[0];
    }
  );

  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Increment: {count}
    </button>
  );
}
```
