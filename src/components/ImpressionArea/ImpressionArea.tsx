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
