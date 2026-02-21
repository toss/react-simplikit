import { ElementType, forwardRef, ReactNode, Ref, RefCallback } from 'react';

import { useImpressionRef, UseImpressionRefOptions } from '../../hooks/useImpressionRef/index.ts';
import { mergeRefs } from '../../utils/mergeRefs/mergeRefs.ts';

type Element<
  T extends ElementType,
  InstrinsicElements = T extends keyof React.JSX.IntrinsicElements ? React.JSX.IntrinsicElements[T] : HTMLElement,
> = InstrinsicElements extends React.ClassAttributes<infer E extends HTMLElement> ? E : HTMLElement;

type Props<Tag extends ElementType> = React.ComponentPropsWithoutRef<Tag> &
  UseImpressionRefOptions & {
    as?: Tag;
    children?: ReactNode;
    className?: string;
  };

/**
 * @description
 * `ImpressionArea` is a component that measures the time a specific DOM element is visible on the screen
 * and executes callbacks when the element enters or exits the viewport. This component uses the `useImpressionRef`
 * hook to track the element's visibility.
 *
 * @template {ElementType} T - The HTML tag to render. Defaults to `div`.
 * @param {T} [as='div'] - The HTML tag to render. Defaults to `div`.
 * @param {string} [rootMargin] - Margin to adjust the detection area.
 * @param {number} [areaThreshold] - Minimum ratio of the element that must be visible (0 to 1).
 * @param {number} [timeThreshold] - Minimum time the element must be visible (in milliseconds).
 * @param {() => void} [onImpressionStart] - Callback function executed when the element enters the view.
 * @param {() => void} [onImpressionEnd] - Callback function executed when the element exits the view.
 * @param {Ref<Element<T>>} [ref] - Reference to the element.
 * @param {React.ReactNode} [children] - Child elements to be rendered inside the component.
 * @param {string} [className] - Additional class names for styling.
 *
 * @returns {JSX.Element} A React component that tracks the visibility of its child elements.
 *
 * @example
 * function App() {
 *   return (
 *     <ImpressionArea
 *       onImpressionStart={() => console.log('Element entered view')}
 *       onImpressionEnd={() => console.log('Element exited view')}
 *       timeThreshold={1000}
 *       areaThreshold={0.5}
 *     >
 *       <div>Track me!</div>
 *     </ImpressionArea>
 *   );
 * }
 */
export const ImpressionArea = forwardRef(ImpressionAreaImpl) as <T extends ElementType = 'div'>(
  props: Props<T> & { ref?: Ref<Element<T>> }
) => React.ReactElement;

function ImpressionAreaImpl<T extends ElementType = 'div'>(
  { as, rootMargin, areaThreshold, timeThreshold, onImpressionStart, onImpressionEnd, ...props }: Props<T>,
  ref: Ref<unknown>
) {
  const Component = as ?? 'div';
  const impressionRef = useImpressionRef<Element<T>>({
    onImpressionStart,
    onImpressionEnd,
    areaThreshold,
    timeThreshold,
    rootMargin,
  });

  return <Component ref={mergeRefs(ref, impressionRef) as RefCallback<HTMLElement>} {...props} />;
}

Object.assign(ImpressionArea, {
  displayName: 'ImpressionArea',
});
