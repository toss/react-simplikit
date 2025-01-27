import { Children, Fragment, isValidElement, ReactNode } from 'react';

type Props = {
  with: ReactNode;
  children: ReactNode;
};

/**
 * @description
 * `Separated` is a component that can be used when you want to insert a component that repeats between each element.
 *
 * @param children - The component to insert between each element.
 * @param with - The child elements to render.Each child will be filtered using `React.isValidElement` function.
 * @returns A React component that separates children with a separator
 *
 * @example
 * function App() {
 *   return (
 *     <Separated with={<Border type="padding24" />}>
 *       {['hello', 'react', 'world'].map(item => (
 *         <div>{item}</div>
 *       ))}
 *     </Separated>
 *   );
 *   // expected output:
 *   // <div>hello</div>
 *   // <Border type="padding24" />
 *   // <div>react</div>
 *   // <Border type="padding24" />
 *   // <div>world</div>
 * }
 */
export function Separated({ children, with: separator }: Props) {
  const childrenArray = Children.toArray(children).filter(isValidElement);

  return (
    <>
      {childrenArray.map((child, i, { length }) => (
        <Fragment key={i}>
          {child}
          {i + 1 !== length ? separator : null}
        </Fragment>
      ))}
    </>
  );
}
