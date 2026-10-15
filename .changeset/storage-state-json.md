---
'react-simplikit': major
---

`useStorageState` now types its state as `T` instead of `Serializable<T>`, so `null` in a union and `interface` types are kept. With `<string | null>`, the state was typed `string` and is now `string | null`.

Without `serializer` and `deserializer`, the value is stored as JSON and is now checked all the way down. Setting a value with a `Date`, `Map`, class instance, function, `NaN` or `Infinity` anywhere in it throws with its path. Before, such a nested value was silently changed or dropped: a `Date` became a string, a `Map` became `{}`, `NaN` became `null`, and a function disappeared. `defaultValue` is checked on mount, even when storage already holds a value.

`serializer` and `deserializer` must be passed together. A lone one is a type error and is ignored at runtime. When both are passed, the value is not checked, so a `Date` default works, and the callback parameters are typed from `defaultValue`.

```ts
// before: the state was typed `string`, though it can be `null`
const [token] = useStorageState<string | null>('token', { defaultValue: null });

// after: the state is typed `string | null`
const [token] = useStorageState<string | null>('token', { defaultValue: null });

// before: stored as `{"at":"2026-01-01T00:00:00.000Z"}` and read back as a string
setValue({ at: new Date() });

// after: throws "value.at is not JSON-serializable", so store a Date with both functions
useStorageState('at', {
  defaultValue: new Date(),
  serializer: date => date.toISOString(),
  deserializer: text => new Date(text),
});
```
