# usePreservedReference

`usePreservedReference` 是一个在值未变化时帮助维持其引用、同时确保你始终能安全使用最新状态的 React Hook。它在避免不必要的重复渲染的同时，始终允许访问最新数据。

## 接口

```ts
function usePreservedReference<T extends NotNullishValue>(
  value: T,
  areValuesEqual?: (a: T, b: T) => boolean
): T;
```

### 参数

<Interface
  required
  name="value"
  type="T"
  description="要维持引用的值。如果状态值在比较后发生了变化，它返回一个新的引用。"
/>

<Interface
  name="areValuesEqual"
  type="(a: T, b: T) => boolean"
  description="一个用于判断两个值是否相等的可选函数。默认情况下，它使用 <code>JSON.stringify</code> 进行比较。"
/>

### 返回值

<Interface
  name=""
  type="T"
  description="如果该值与之前的值被认为是相等的，则返回相同的引用，否则返回一个新的引用。"
/>

## 示例

```tsx
import { usePreservedReference } from 'react-simplikit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(state);

  return <div>{preservedState.key}</div>;
}
```

```tsx
import { usePreservedReference } from 'react-simplikit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(
    state,
    (a, b) => a.key === b.key
  );

  return <div>{preservedState.key}</div>;
}
```
