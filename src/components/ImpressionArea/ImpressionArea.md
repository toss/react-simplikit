# ImpressionArea

`ImpressionArea` is a component that measures the time a specific DOM element is visible on the screen and executes callbacks when the element enters or exits the viewport. This component uses the `useImpressionRef` hook to track the element's visibility.

## Interface

```ts
function ImpressionArea(
  as: ElementType = 'div',
  rootMargin: string,
  areaThreshold: number,
  timeThreshold: number,
  onImpressionStart: () => void,
  onImpressionEnd: () => void,
  ref: Ref<HTMLElement>,
  children: React.ReactNode,
  className: string
): JSX.Element;
```

### Parameters

<Interface
  name="as"
  type="ElementType"
  description="The HTML tag to render. Defaults to <code>div</code>."
/>

<Interface
  name="rootMargin"
  type="string"
  description="Margin to adjust the detection area."
/>

<Interface
  name="areaThreshold"
  type="number"
  description="Minimum ratio of the element that must be visible (0 to 1)."
/>

<Interface
  name="timeThreshold"
  type="number"
  description="Minimum time the element must be visible (in milliseconds)."
/>

<Interface
  name="onImpressionStart"
  type="() => void"
  description="Callback function executed when the element enters the view."
/>

<Interface
  name="onImpressionEnd"
  type="() => void"
  description="Callback function executed when the element exits the view."
/>

<Interface
  name="ref"
  type="Ref<HTMLElement>"
  description="Reference to the element."
/>

<Interface
  name="children"
  type="React.ReactNode"
  description="Child elements to be rendered inside the component."
/>

<Interface
  name="className"
  type="string"
  description="Additional class names for styling."
/>

### Return Value

<Interface
  name=""
  type="JSX.Element"
  description="React component that tracks the visibility of its child elements."
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
