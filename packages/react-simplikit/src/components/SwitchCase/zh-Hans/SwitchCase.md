# SwitchCase

`SwitchCase` 是一个可以根据给定值以声明式方式渲染组件的组件。它类似于 `switch-case` 语句。当需要根据特定状态条件性地渲染不同组件时非常有用。

## 接口

```ts
function SwitchCase<Case>(
  value: Case,
  caseBy: Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>,
  defaultComponent?: () => ReactElement | null
): ReactElement | null;
```

### 参数

<Interface
  required
  name="value"
  type="Case"
  description="要比较的值。会渲染 <code>caseBy</code> 中与匹配的键相关联的组件。"
/>

<Interface
  required
  name="caseBy"
  type="Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>"
  description="将值映射到要渲染的组件的对象。键表示可能的值，值是返回相应组件的函数。"
/>

<Interface
  name="defaultComponent"
  type="() => ReactElement | null"
  description="当 <code>value</code> 与 <code>caseBy</code> 中的任何键都不匹配时渲染的组件。"
/>

### 返回值

<Interface
  name=""
  type="ReactElement | null"
  description="根据不同情况条件性渲染的 React 组件。"
/>

## 示例

```tsx
function App() {
  return (
    <SwitchCase
      value={status}
      // 根据 status 的值渲染 TypeA、TypeB 或 TypeC。
      caseBy={{
        a: () => <TypeA />,
        b: () => <TypeB />,
        c: () => <TypeC />,
      }}
      // 当 status 的值与任何情况都不匹配时渲染 Default。
      defaultComponent={() => <Default />}
    />
  );
}
```
