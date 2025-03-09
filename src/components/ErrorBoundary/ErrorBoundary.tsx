import {
  Component,
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentType,
  ErrorInfo,
  forwardRef,
  JSX,
  JSXElementConstructor,
  PropsWithChildren,
  PropsWithRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { isDifferentArray } from './isDifferentArray.ts';

type ComponentPropsWithoutChildren<Component extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = Omit<
  ComponentProps<Component>,
  'children'
>;

type RenderFallbackProps<ErrorType extends Error = Error> = {
  error: ErrorType;
  reset: () => void;
};

type RenderFallbackType = <ErrorType extends Error>(props: RenderFallbackProps<ErrorType>) => ReactNode;
type IgnoreErrorType = <ErrorType extends Error = Error>(error: ErrorType) => boolean;

type Props<ErrorType extends Error = Error> = {
  resetKeys?: unknown[];
  onReset?(): void;
  renderFallback: RenderFallbackType;
  onError?(error: ErrorType, info: ErrorInfo): void;
  ignoreError?: IgnoreErrorType;
};

type State<ErrorType extends Error = Error> = {
  error: ErrorType | null;
};

const initialState: State = {
  error: null,
};

class BaseErrorBoundary extends Component<PropsWithRef<PropsWithChildren<Props>>, State> {
  state = initialState;

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { onError, ignoreError } = this.props;

    if (ignoreError != null && ignoreError(error)) {
      throw error;
    }

    onError?.(error, info);
  }

  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState(initialState);
  };

  componentDidUpdate(prevProps: Props) {
    if (this.state.error == null) {
      return;
    }

    if (isDifferentArray(prevProps.resetKeys, this.props.resetKeys)) {
      this.resetErrorBoundary();
    }
  }

  render() {
    const { children, renderFallback } = this.props;
    const { error } = this.state;

    if (error != null) {
      return renderFallback({
        error,
        reset: this.resetErrorBoundary,
      });
    }

    return children;
  }
}

export const ErrorBoundary = forwardRef<{ reset(): void }, ComponentPropsWithoutRef<typeof BaseErrorBoundary>>(
  (props, resetRef) => {
    const resetKeys = [...(props.resetKeys || [])];

    const ref = useRef<BaseErrorBoundary>(null);
    useImperativeHandle(resetRef, () => ({
      reset: () => ref.current?.resetErrorBoundary(),
    }));

    return <BaseErrorBoundary {...props} resetKeys={resetKeys} ref={ref} />;
  }
);

ErrorBoundary.displayName = 'ErrorBoundary';

export const useErrorBoundary = <ErrorType extends Error>() => {
  const [error, setError] = useState<ErrorType | null>(null);

  if (error != null) {
    throw error;
  }

  return setError;
};

export const withErrorBoundary = <Props extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<Props>,
  errorBoundaryProps: ComponentPropsWithoutChildren<typeof ErrorBoundary>
) => {
  const Wrapped = (props: Props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  return Wrapped;
};
