# useBooleanState

`useBooleanState` 是一个简化布尔状态管理的 React Hook。它提供函数来将状态设置为 `true`、设置为 `false` 以及切换其值。

## 接口

```ts
function useBooleanState(
  initialValue: boolean | (() => boolean) = false
): readonly [state: boolean, actions: BooleanStateActions];
```

### 参数

<Interface
  name="initialValue"
  type="boolean | (() => boolean)"
  description="状态的初始值。默认值为 <code>false</code>。"
/>

### 返回值

<Interface
  name=""
  type="readonly [state: boolean, actions: BooleanStateActions]"
  description="包含状态和状态修改操作的元组。"
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      required: false,
      description: '当前的状态值。',
    },
    {
      name: 'actions.setTrue',
      type: '() => void',
      required: false,
      description: '将状态设置为 <code>true</code> 的函数。',
    },
    {
      name: 'actions.setFalse',
      type: '() => void',
      required: false,
      description: '将状态设置为 <code>false</code> 的函数。',
    },
    {
      name: 'actions.toggle',
      type: '() => void',
      required: false,
      description: '切换状态的函数。',
    },
  ]"
/>

## 示例

```tsx
const [open, { setTrue: openBottomSheet, setFalse: closeBottomSheet }] =
  useBooleanState(false);
```
