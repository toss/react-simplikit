import { Children, Fragment, isValidElement, ReactNode } from 'react';

type Props = {
  by: ReactNode;
  children: ReactNode;
};

/**
 * @description
 * `Separated` is a component that inserts a specified component between each child element.
 * It is useful for adding separators, spacing, or other repeating elements in lists.
 *
 * @param {React.ReactNode} children - The child elements to render.
 *   Only valid React elements (`React.isValidElement`) will be rendered.
 * @param {React.ReactNode} by - The component to insert between child elements.
 *
 * @returns {JSX.Element} A React component that separates children with a specified separator.
 *
 * @example
 * function App() {
 *   return (
 *     <Separated by={<Border type="padding24" />}>
 *       {['hello', 'react', 'world'].map(item => (
 *         <div key={item}>{item}</div>
 *       ))}
 *     </Separated>
 *   );
 *   // Expected output:
 *   // <div>hello</div>
 *   // <Border type="padding24" />
 *   // <div>react</div>
 *   // <Border type="padding24" />
 *   // <div>world</div>
 * }
 */
export function Separated({ children, by: separator }: Props) {
  const childrenArray = Children.toArray(children).filter(isValidElement);

  return (
    <>
      {childrenArray.map((child, i, { length }) => (
        <Fragment key={i}>
          {child}
          {i + 1 !== length && separator}
        </Fragment>
      ))}
    </>
  );
}
