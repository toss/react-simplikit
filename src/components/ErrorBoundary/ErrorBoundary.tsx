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

/**
 * @description
 * ErrorBoundary is a component that catches JavaScript errors anywhere in its child component tree
 * and displays a fallback UI instead of crashing the entire application.
 *
 * @component
 * @template ErrorType - The type of error to be caught (defaults to Error)
 *
 * @param {object} props - Component props
 * @param {unknown[]} [props.resetKeys] - Array of dependencies that will reset the error boundary when changed
 * @param {() => void} [props.onReset] - Function called when the error boundary is reset
 * @param {(props: RenderFallbackProps<ErrorType>) => React.ReactNode} props.renderFallback - Function to render fallback UI when an error is caught
 * @param {(error: ErrorType, info: ErrorInfo) => void} [props.onError] - Function called when an error is caught (useful for error logging)
 * @param {(error: ErrorType) => boolean} [props.ignoreError] - Function to determine if an error should be ignored and re-thrown
 * @param {React.ReactNode} props.children - The components that this boundary protects
 *
 * @returns {JSX.Element} The children or fallback UI if an error occurred
 *
 * @example
 * // Basic usage
 * <ErrorBoundary
 *   renderFallback={({ error, reset }) => (
 *     <div>
 *       <p>Something went wrong: {error.message}</p>
 *       <button onClick={reset}>Try again</button>
 *     </div>
 *   )}
 * >
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 */
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

/**
 * @description
 * A hook that returns a function which, when called with an error,
 * will throw that error to be caught by the nearest ErrorBoundary.
 *
 * @template ErrorType - The type of error to be thrown (defaults to Error)
 * @returns {(error: ErrorType) => void} A function that throws the provided error
 *
 * @example
 * const throwError = useErrorBoundary();
 *
 * useEffect(() => {
 *   const fetchData = async () => {
 *     try {
 *       const response = await fetch('/api/data');
 *       if (!response.ok) throw new Error('Failed to fetch data');
 *       // Process data...
 *     } catch (error) {
 *       throwError(error);
 *     }
 *   };
 *
 *   fetchData();
 * }, []);
 */
export const useErrorBoundary = <ErrorType extends Error>() => {
  const [error, setError] = useState<ErrorType | null>(null);

  if (error != null) {
    throw error;
  }

  return setError;
};

/**
 * @description
 * Higher-order component that wraps a component with an ErrorBoundary.
 *
 * @template Props - The props type of the wrapped component
 * @param {React.ComponentType<Props>} Component - The component to wrap
 * @param {Omit<ComponentPropsWithoutRef<typeof ErrorBoundary>, 'children'>} errorBoundaryProps - Props for the ErrorBoundary
 * @returns {(props: Props) => JSX.Element} The wrapped component
 *
 * @example
 * const UserProfileWithErrorHandling = withErrorBoundary(UserProfile, {
 *   renderFallback: ({ error, reset }) => (
 *     <div>
 *       <p>Failed to load user: {error.message}</p>
 *       <button onClick={reset}>Try again</button>
 *     </div>
 *   ),
 *   onError: (error, info) => {
 *     // Log error to an error reporting service
 *     console.error('User profile error:', error, info);
 *   }
 * });
 */
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
