# SwitchCase

`SwitchCase` 是一个让你根据给定值以声明式方式渲染组件的组件，类似 `switch-case` 语句。当你需要根据特定状态条件渲染不同组件时很有用。

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
  description="要比较的值。将渲染 <code>caseBy</code> 中与之匹配的 key 所对应的组件。"
/>

<Interface
  required
  name="caseBy"
  type="Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>"
  description="一个将值映射到待渲染组件的对象。key 表示可能的取值，value 是返回对应组件的函数。"
/>

<Interface
  name="defaultComponent"
  type="() => ReactElement | null"
  description="当 <code>value</code> 不匹配 <code>caseBy</code> 中的任何 key 时渲染的组件。"
/>

### 返回值

<Interface
  name=""
  type="ReactElement | null"
  description="一个根据 case 条件渲染的 React 组件。"
/>

## 示例

```tsx
function App() {
  return (
    <SwitchCase
      value={status}
      // Renders TypeA, TypeB, or TypeC based on the status value.
      caseBy={{
        a: () => <TypeA />,
        b: () => <TypeB />,
        c: () => <TypeC />,
      }}
      // Renders Default when the status value does not match any case.
      defaultComponent={() => <Default />}
    />
  );
}
```
