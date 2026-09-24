# buildContext

`buildContext` 是一个辅助函数，用于在定义 React Context 时减少重复代码。

## 接口

```ts
function buildContext<ContextValuesType extends object>(
  contextName: string,
  defaultContextValues?: ContextValuesType
): [
  Provider: (props: ProviderProps<ContextValuesType>) => JSX.Element,
  useContext: () => ContextValuesType,
];
```

### 参数

<Interface
  required
  name="contextName"
  type="string"
  description="Context 的名称。"
/>

<Interface
  name="defaultContextValues"
  type="ContextValuesType"
  description="传递给 Context 的默认值。"
/>

### 返回值

<Interface
  name=""
  type="[Provider: (props: ProviderProps<ContextValuesType>) => JSX.Element, useContext: () => ContextValuesType]"
  description="如下形式的元组："
  :nested="[
    {
      name: 'Provider',
      type: '(props: ProviderProps<ContextValuesType>) => JSX.Element',
      description: '提供 Context 的组件。',
    },
    {
      name: 'useContext',
      type: '() => ContextValuesType',
      description: '使用 Context 的 Hook。',
    },
  ]"
/>

## 示例

```tsx
const [Provider, useContext] = buildContext<{ title: string }>('TestContext', {
  title: 'Default title',
});

function Inner() {
  const { title } = useContext();
  return <div>{title}</div>;
}

function Page() {
  return (
    <Provider title="Hello">
      <Inner />
    </Provider>
  );
}
```
