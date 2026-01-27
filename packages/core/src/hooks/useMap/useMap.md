# useMap

A React hook that manages a key-value Map as state. Provides efficient state management and stable action functions.

## Interface

```ts
function useMap(initialState: MapOrEntries<K, V>): UseMapReturn<K, V>;
```

### Parameters

<Interface
  required
  name="initialState"
  type="MapOrEntries<K, V>"
  description="Initial Map state (Map object or array of key-value pairs)"
/>

### Return Value

<Interface
  name=""
  type="UseMapReturn<K, V>"
  description="tuple containing the Map state and actions to manipulate it"
/>

## Example

````tsx
```tsx
const [userMap, actions] = useMap<string, User>([
  ['user1', { name: 'John', age: 30 }]
]);

// Using values from the Map
const user1 = userMap.get('user1');

// Updating the Map
actions.set('user2', { name: 'Jane', age: 25 });
````

```

```
