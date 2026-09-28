# Separated

`Separated` 是一个在各个子元素之间插入指定组件的组件。适合用于在列表中添加分隔符、间距或其他重复出现的元素。

## 接口

```ts
function Separated(children: React.ReactNode, by: React.ReactNode): JSX.Element;
```

### 参数

<Interface
  required
  name="children"
  type="React.ReactNode"
  description="要渲染的子元素。只有有效的 React 元素（<code>React.isValidElement</code>）才会被渲染。"
/>

<Interface
  required
  name="by"
  type="React.ReactNode"
  description="要插入到子元素之间的组件。"
/>

### 返回值

<Interface
  name=""
  type="JSX.Element"
  description="一个用指定分隔组件分隔子元素的 React 组件。"
/>

## 示例

```tsx
function App() {
  return (
    <Separated by={<Border type="padding24" />}>
      {['hello', 'react', 'world'].map(item => (
        <div key={item}>{item}</div>
      ))}
    </Separated>
  );
  // Expected output:
  // <div>hello</div>
  // <Border type="padding24" />
  // <div>react</div>
  // <Border type="padding24" />
  // <div>world</div>
}
```
