# useMap

키-값 쌍인 맵(Map)을 상태로 관리하는 리액트 훅이에요. 효율적인 상태 관리와 안정적인 액션 함수를 제공해요.

## 인터페이스

```ts
function useMap<K, V>(
  initialValue: MapOrEntries<K, V> = new Map()
): UseMapReturn<K, V>;
```

### 파라미터

<Interface
  name="initialValue"
  type="MapOrEntries<K, V>"
  description="맵의 초기 값이에요. 맵 객체나 키-값 쌍의 배열을 받아요."
/>

### 반환 값

<Interface
  name=""
  type="UseMapReturn<K, V>"
  description="맵 상태와 이를 조작하는 액션을 담은 튜플이에요."
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
