# useMap

리액트 훅으로, 상태로 키-값 쌍인 맵(Map)을 관리해요. 효율적인 상태 관리를 제공하고 안정적인 액션 함수를 제공해요.

## 인터페이스

```ts
function useMap(initialState: MapOrEntries<K, V>): UseMapReturn<K, V>;
```

### 파라미터

<Interface
  required
  name="initialState"
  type="MapOrEntries<K, V>"
  description="초기 맵 상태 (맵 객체 또는 키-값 쌍의 배열)"
/>

### 반환 값

<Interface
  name=""
  type="UseMapReturn<K, V>"
  description="맵 상태와 이를 조작하는 액션을 포함한 튜플이에요"
/>

## 예시

```tsx
const [userMap, actions] = useMap<string, User>([
  ['user1', { name: 'John', age: 30 }],
]);

// 맵에서 값 사용하기
const user1 = userMap.get('user1');

// 맵 업데이트하기
actions.set('user2', { name: 'Jane', age: 25 });
```
