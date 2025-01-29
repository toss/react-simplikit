# ImpressionArea

`ImpressionArea` is a component that measures the time a specific DOM element is visible on the screen and executes callbacks when the element enters or exits the viewport. This component uses the [useImpressionRef](../hooks/useImpressionRef) hook to track the element's visibility.

## Props

- `onImpressionStart`: Callback function executed when the element enters the view
- `onImpressionEnd`: Callback function executed when the element exits the view
- `timeThreshold`: Minimum time the element must be visible (in milliseconds)
- `areaThreshold`: Minimum ratio of the element that must be visible (0 to 1)
- `rootMargin`: Margin to adjust the detection area
- `as`: HTML tag to render (default: `div`)
- `children`: Child elements

## Example

```tsx
import { ImpressionArea } from 'reactive-kit';

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

In this example, `ImpressionArea` is used to log a message to the console whenever the `div` element enters or exits the viewport.
