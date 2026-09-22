# useMap

一个将键值 Map 作为状态进行管理的 React Hook。它提供高效的状态管理和稳定的操作函数。

## 接口

```ts
function useMap<K, V>(initialState: MapOrEntries<K, V>): UseMapReturn<K, V>;
```

### 参数

<Interface
  required
  name="initialState"
  type="MapOrEntries<K, V>"
  description="初始 Map 状态（Map 对象或键值对数组）"
/>

### 返回值

<Interface
  name=""
  type="UseMapReturn<K, V>"
  description="包含 Map 状态及其操作函数 的元组"
/>

## 示例

```tsx
const [userMap, actions] = useMap<string, User>([
  ["user1", { name: "John", age: 30 }],
]);

// Using values from the Map
const user1 = userMap.get("user1");

// Updating the Map
actions.set("user2", { name: "Jane", age: 25 });
```
