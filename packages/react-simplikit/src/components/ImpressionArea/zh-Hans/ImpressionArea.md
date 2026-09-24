# ImpressionArea

`ImpressionArea` 是一个组件，用于测量特定 DOM 元素在屏幕上的可见时间，并在元素进入或离开视口时执行回调。该组件使用 `useImpressionRef` 钩子来跟踪元素的可见性。

## Interface

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

### Parameters

<Interface
  name="as"
  type="T"
  description="要渲染的 HTML 标签。默认为 <code>div</code>。"
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
  description="元素必须可见的最短时间（以毫秒为单位）。"
/>

<Interface
  name="onImpressionStart"
  type="() => void"
  description="当元素进入视图时执行的回调函数。"
/>

<Interface
  name="onImpressionEnd"
  type="() => void"
  description="当元素离开视图时执行的回调函数。"
/>

<Interface
  name="ref"
  type="Ref<Element<T>>"
  description="元素的引用。"
/>

<Interface
  name="children"
  type="React.ReactNode"
  description="要在组件内部渲染的子元素。"
/>

<Interface
  name="className"
  type="string"
  description="用于样式设置的其他类名。"
/>

### Return Value

<Interface
  name=""
  type="JSX.Element"
  description="一个跟踪其子元素可见性的 React 组件。"
/>

## Example

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
