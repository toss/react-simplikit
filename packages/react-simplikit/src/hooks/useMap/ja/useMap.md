# useMap

キーと値のペアを格納する Map を状態として管理する React フックです。
効率的な状態管理と、参照が安定したアクション関数を提供します。

## インターフェース

```ts
function useMap<K, V>(initialState: MapOrEntries<K, V>): UseMapReturn<K, V>;
```

### パラメータ

<Interface
  required
  name="initialState"
  type="MapOrEntries<K, V>"
  description="Map の初期状態（Map オブジェクトまたはキーと値のペアの配列）です。"
/>

### 戻り値

<Interface
  name=""
  type="UseMapReturn<K, V>"
  description="Map の状態と、それを操作するアクションを含むタプルです。"
/>

## 使用例

```tsx
const [userMap, actions] = useMap<string, User>([
  ['user1', { name: 'John', age: 30 }],
]);

// Map の値を使用します
const user1 = userMap.get('user1');

// Map を更新します
actions.set('user2', { name: 'Jane', age: 25 });
```
