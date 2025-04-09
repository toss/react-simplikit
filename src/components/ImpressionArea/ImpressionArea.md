# ImpressionArea

`ImpressionArea` is a component that measures the time a specific DOM element is visible on the screen and executes callbacks when the element enters or exits the viewport. This component uses the [useImpressionRef](../hooks/useImpressionRef) hook to track the element's visibility.

## Interface

```tsx
function ImpressionArea<T extends ElementType = 'div'>({
  as,
  rootMargin,
  areaThreshold,
  timeThreshold,
  onImpressionStart,
  onImpressionEnd,
  ref,
  ...props
}: Props<T>): JSX.Element;
```

### Parameters

- `as` (`ElementType`): The HTML tag to render (default: `div`).
- `rootMargin` (`string`): Margin to adjust the detection area.
- `areaThreshold` (`number`): Minimum ratio of the element that must be visible (0 to 1).
- `timeThreshold` (`number`): Minimum time the element must be visible (in milliseconds).
- `onImpressionStart` (`() => void`): Callback function executed when the element enters the view.
- `onImpressionEnd` (`() => void`): Callback function executed when the element exits the view.
- `ref` (`Ref<HTMLElement>`): Reference to the element.
- `props` (`Props<T>`): Additional props for the tag specified by `as`.

### Return value

This component returns a JSX element.

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

In this example, `ImpressionArea` is used to log a message to the console whenever the `div` element enters or exits the viewport.
