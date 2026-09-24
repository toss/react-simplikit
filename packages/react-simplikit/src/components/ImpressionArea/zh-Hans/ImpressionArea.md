# ImpressionArea

`ImpressionArea` 是一个测量特定 DOM 元素在屏幕上可见时长、并在元素进入或离开视口时执行回调的组件。该组件使用 `useImpressionRef` Hook 来跟踪元素的可见性。

## 接口

```ts
function ImpressionArea<T extends ElementType>(
  as: T = 'div',
  rootMargin?: string,
  areaThreshold?: number,
  timeThreshold?: number,
  onImpressionStart?: () => void,
  onImpressionEnd?: () => void,
  ref?: Ref<Element<T>>,
  children?: React.ReactNode,
  className?: string
): JSX.Element;
```

### 参数

<Interface
  name="as"
  type="T"
  description="要渲染的 HTML 标签。默认值为 <code>div</code>。"
/>

<Interface
  name="rootMargin"
  type="string"
  description="用于调整检测区域的边距。"
/>

<Interface
  name="areaThreshold"
  type="number"
  description="元素必须可见的最小比例（0 到 1）。"
/>

<Interface
  name="timeThreshold"
  type="number"
  description="元素必须可见的最短时间（毫秒）。"
/>

<Interface
  name="onImpressionStart"
  type="() => void"
  description="元素进入视野时执行的回调函数。"
/>

<Interface
  name="onImpressionEnd"
  type="() => void"
  description="元素离开视野时执行的回调函数。"
/>

<Interface
  name="ref"
  type="Ref<Element<T>>"
  description="对元素的引用。"
/>

<Interface
  name="children"
  type="React.ReactNode"
  description="渲染在组件内部的子元素。"
/>

<Interface
  name="className"
  type="string"
  description="用于附加样式的 class 名。"
/>

### 返回值

<Interface
  name=""
  type="JSX.Element"
  description="一个跟踪其子元素可见性的 React 组件。"
/>

## 示例

```tsx
function App() {
  return (
    <ImpressionArea
      onImpressionStart={() => console.log('Element entered view')}
      onImpressionEnd={() => console.log('Element exited view')}
      timeThreshold={1000}
      areaThreshold={0.5}
    >
      <div>Track me!</div>
    </ImpressionArea>
  );
}
```
