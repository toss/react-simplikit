# buildContext

`buildContext` 是一个减少定义 React Context 时重复代码的辅助函数。

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
  description="具有以下形式的元组："
  :nested="[
    {
      name: 'Provider',
      type: '(props: ProviderProps<ContextValuesType>) => JSX.Element',
      required: false,
      description: '提供 Context 的组件。',
    },
    {
      name: 'useContext',
      type: '() => ContextValuesType',
      required: false,
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
