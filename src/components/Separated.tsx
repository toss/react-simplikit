import { Children, Fragment, isValidElement, ReactNode } from 'react';

interface Props {
  with: ReactNode;
  children: ReactNode;
}

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
