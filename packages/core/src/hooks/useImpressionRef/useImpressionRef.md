# useImpressionRef

`useImpressionRef` is a React hook that measures the time a specific DOM element is visible on the screen and executes callbacks when the element enters or exits the viewport. It uses `IntersectionObserver` and the `Visibility API` to track the element's visibility.

## Interface

```ts
function useImpressionRef(
  options: UseImpressionRefOptions
): (element: Element | null) => void;
```

### Parameters

<Interface
  required
  name="options"
  type="UseImpressionRefOptions"
  description="Options for tracking the element's visibility."
  :nested="[
    {
      name: 'options.onImpressionStart',
      type: '() => void',
      required: false,
      description:
        'Callback function executed when the element enters the view',
    },
    {
      name: 'options.onImpressionEnd',
      type: '() => void',
      required: false,
      description: 'Callback function executed when the element exits the view',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: 'Minimum time the element must be visible (in milliseconds)',
    },
    {
      name: 'options.areaThreshold',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: 'Minimum ratio of the element that must be visible (0 to 1)',
    },
    {
      name: 'options.rootMargin',
      type: 'string',
      required: true,
      description: 'Margin to adjust the detection area',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="(element: Element | null) => void"
  description="function to set the element. Attach this function to the <code>ref</code> attribute, and the callbacks will be executed whenever the element's visibility changes."
/>

## Example

```tsx
import { useImpressionRef } from 'react-simplikit';

function Component() {
  const ref = useImpressionRef<HTMLDivElement>({
    onImpressionStart: () => console.log('Element entered view'),
    onImpressionEnd: () => console.log('Element exited view'),
    timeThreshold: 1000,
    areaThreshold: 0.5,
  });

  return <div ref={ref}>Track my visibility!</div>;
}
```
