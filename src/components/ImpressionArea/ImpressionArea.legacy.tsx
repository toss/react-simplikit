import { Ref } from 'react';

import { useImpressionRef, UseImpressionRefOptions } from '../../hooks/useImpressionRef/useImpressionRef.legacy.ts';
import { mergeRefs } from '../../utils/mergeRefs/mergeRefs.ts';

/**
 *
 * @description
 * ImpressionArea 컴포넌트에 전달할 수 있는 props의 타입입니다. `UseImpressionRefOptions`를 상속받습니다.
 */
export type ImpressionAreaProps = UseImpressionRefOptions & {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  role?: string;
  forwardedRef?: Ref<HTMLDivElement>;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'false' | 'true';
};

export const ImpressionArea = ({
  rootMargin,
  areaThreshold,
  timeThreshold,
  className,
  children,
  onImpressionStart,
  onImpressionEnd,
  style,
  forwardedRef,
  ...otherProps
}: ImpressionAreaProps) => {
  const impressionRef = useImpressionRef<HTMLDivElement>({
    onImpressionStart,
    onImpressionEnd,
    areaThreshold,
    timeThreshold,
    rootMargin,
  });

  const ref = mergeRefs(forwardedRef, impressionRef);

  return (
    <div className={className} ref={ref} style={style} {...otherProps}>
      {children}
    </div>
  );
};
