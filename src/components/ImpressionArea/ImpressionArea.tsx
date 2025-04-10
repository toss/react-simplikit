import React, { ElementType, Ref } from 'react';

import { useImpressionRef, UseImpressionRefOptions } from '../../hooks/useImpressionRef/index.ts';
import { mergeRefs } from '../../utils/mergeRefs/mergeRefs.ts';

type Props<Tag extends ElementType> = React.ComponentPropsWithoutRef<Tag> &
  UseImpressionRefOptions & {
    as?: Tag;
    ref?: Ref<HTMLElement>;
    children?: React.ReactNode;
    className?: string;
  };

/**
 * @description
 * `ImpressionArea` is a component that measures the time a specific DOM element is visible on the screen
 * and executes callbacks when the element enters or exits the viewport. This component uses the `useImpressionRef`
 * hook to track the element's visibility.
 *
 * @param {Object} props - The props for the component.
 * @param {ElementType} [props.as='div'] - The HTML tag to render. Defaults to `div`.
 * @param {string} [props.rootMargin] - Margin to adjust the detection area.
 * @param {number} [props.areaThreshold] - Minimum ratio of the element that must be visible (0 to 1).
 * @param {number} [props.timeThreshold] - Minimum time the element must be visible (in milliseconds).
 * @param {() => void} [props.onImpressionStart] - Callback function executed when the element enters the view.
 * @param {() => void} [props.onImpressionEnd] - Callback function executed when the element exits the view.
 * @param {Ref<HTMLElement>} [props.ref] - Reference to the element.
 * @param {React.ReactNode} [props.children] - Child elements to be rendered inside the component.
 * @param {string} [props.className] - Additional class names for styling.
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
 *       <div>Track me!!</div>
 *     </ImpressionArea>
 *   );
 * }
 */
export function ImpressionArea<T extends ElementType = 'div'>({
  as,
  rootMargin,
  areaThreshold,
  timeThreshold,
  onImpressionStart,
  onImpressionEnd,
  ref,
  ...props
}: Props<T>) {
  const Component = as ?? 'div';
  const impressionRef = useImpressionRef<HTMLElement>({
    onImpressionStart,
    onImpressionEnd,
    areaThreshold,
    timeThreshold,
    rootMargin,
  });

  return <Component ref={mergeRefs(ref, impressionRef)} {...props} />;
}
