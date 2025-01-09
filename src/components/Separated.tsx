import { Children, Fragment, isValidElement, ReactNode } from 'react';

interface Props {
  with: ReactNode;
  children: ReactNode;
}

export function Separated({ children, with: separator }: Props) {
  const childrenArray = Children.toArray(children).filter(isValidElement);
  const childrenLength = childrenArray.length;

  return (
    <>
      {childrenArray.map((child, i) => (
        <Fragment key={i}>
          {child}
          {i + 1 !== childrenLength ? separator : null}
        </Fragment>
      ))}
    </>
  );
}
