# ImpressionArea

`ImpressionArea` is a component that measures the time a specific DOM element is visible on the screen and executes callbacks when the element enters or exits the viewport. This component uses the `useImpressionRef` hook to track the element's visibility.

## Interface
```ts
function ImpressionArea(props: Object): JSX.Element;

```

### Parameters

<Interface
  required
  name="props"
  type="Object"
  description="The props for the component."
  :nested="[
    {
      name: 'props.as',
      type: 'ElementType',
      defaultValue: '\'div\'',
      description: 'The HTML tag to render. Defaults to <code>div</code>.',
    },
    {
      name: 'props.rootMargin',
      type: 'string',
      description: 'Margin to adjust the detection area.',
    },
    {
      name: 'props.areaThreshold',
      type: 'number',
      description:
        'Minimum ratio of the element that must be visible (0 to 1).',
    },
    {
      name: 'props.timeThreshold',
      type: 'number',
      description:
        'Minimum time the element must be visible (in milliseconds).',
    },
    {
      name: 'props.onImpressionStart',
      type: '() => void',
      description:
        'Callback function executed when the element enters the view.',
    },
    {
      name: 'props.onImpressionEnd',
      type: '() => void',
      description:
        'Callback function executed when the element exits the view.',
    },
    {
      name: 'props.ref',
      type: 'Ref<HTMLElement>',
      description: 'Reference to the element.',
    },
    {
      name: 'props.children',
      type: 'React.ReactNode',
      description: 'Child elements to be rendered inside the component.',
    },
    {
      name: 'props.className',
      type: 'string',
      description: 'Additional class names for styling.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="JSX.Element"
  description="React component that tracks the visibility of its child elements."
/>


## Example

```tsx
import { ImpressionArea } from 'react-simplikit';

function App() {
  return (
    <ImpressionArea
      onImpressionStart={() => console.log('Element entered view')}
      onImpressionEnd={() => console.log('Element exited view')}
      timeThreshold={1000}
      areaThreshold={0.5}
    >
      <div>Track my visibility!</div>
    </ImpressionArea>
  );
}
```
  