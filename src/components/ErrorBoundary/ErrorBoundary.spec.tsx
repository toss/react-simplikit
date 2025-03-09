import { ComponentRef, createRef } from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ErrorBoundary, useErrorBoundary, withErrorBoundary } from './ErrorBoundary.tsx';

const TEXT_ERROR = 'This is an error';
const TEXT_NO_ERROR = 'This is no error';

const TestError = new Error(TEXT_ERROR);

const ErrorComponent = () => {
  throw TestError;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // @ts-expect-error React environment variable
    global.IS_REACT_ACT_ENVIRONMENT = true;

    // Suppress console error output
    vi.spyOn(console, 'error').mockImplementation(() => {
      // Do nothing
    });
  });

  it('can catch errors in child components', () => {
    render(
      <ErrorBoundary renderFallback={({ error }) => <div>{error.message}</div>}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(`${TEXT_ERROR}`)).toBeInTheDocument();
  });

  it('can be reset via ref.current.reset', () => {
    let isError = true;
    const ref = createRef<ComponentRef<typeof ErrorBoundary>>();

    const ErrorComponent = () => {
      if (isError) {
        throw new Error(TEXT_ERROR);
      }

      return <>{TEXT_NO_ERROR}</>;
    };

    render(
      <ErrorBoundary ref={ref} renderFallback={({ error }) => <div>Error occurred: {error.message}</div>}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    act(() => {
      isError = false;
      ref.current?.reset();
    });

    expect(screen.getByText(TEXT_NO_ERROR)).toBeInTheDocument();
  });

  it('automatically resets when resetKeys change', () => {
    let resetKeys = [1];
    let isError = true;

    const ErrorComponent = () => {
      if (isError) {
        throw new Error(TEXT_ERROR);
      }
      return <>{TEXT_NO_ERROR}</>;
    };

    const { rerender } = render(
      <ErrorBoundary resetKeys={resetKeys} renderFallback={({ error }) => <div>{error.message}</div>}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(TEXT_ERROR)).toBeInTheDocument();

    act(() => {
      isError = false;
      resetKeys = [2];
      rerender(
        <ErrorBoundary resetKeys={resetKeys} renderFallback={({ error }) => <div>{error.message}</div>}>
          <ErrorComponent />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText(TEXT_NO_ERROR)).toBeInTheDocument();
  });

  it('calls onReset callback when reset', () => {
    const onReset = vi.fn();
    let isError = true;
    const ref = createRef<ComponentRef<typeof ErrorBoundary>>();

    const ConditionalErrorComponent = () => {
      if (isError) {
        throw new Error(TEXT_ERROR);
      }
      return <>{TEXT_NO_ERROR}</>;
    };

    render(
      <ErrorBoundary ref={ref} onReset={onReset} renderFallback={({ error }) => <div>{error.message}</div>}>
        <ConditionalErrorComponent />
      </ErrorBoundary>
    );

    act(() => {
      isError = false;
      ref.current?.reset();
    });

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.getByText(TEXT_NO_ERROR)).toBeInTheDocument();
  });

  it('can ignore specific errors via ignoreError function', () => {
    const ignoreError = vi.fn((error: Error) => error.message === TEXT_ERROR);

    try {
      render(
        <ErrorBoundary renderFallback={({ error }) => <div>Outer error: {error.message}</div>}>
          <ErrorBoundary
            ignoreError={ignoreError}
            renderFallback={({ error }) => <div>Inner error: {error.message}</div>}
          >
            <ErrorComponent />
          </ErrorBoundary>
        </ErrorBoundary>
      );
    } catch {
      /* empty */
    }

    expect(ignoreError).toHaveBeenCalledTimes(1);
    expect(screen.getByText(`Outer error: ${TEXT_ERROR}`)).toBeInTheDocument();
  });

  it('calls onError callback with error and info when error occurs', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError} renderFallback={({ error }) => <div>{error.message}</div>}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledTimes(1);
  });
});

describe('useErrorBoundary', () => {
  it('throws Error when function returned by this hook is called with Error argument', async () => {
    const { result } = renderHook(useErrorBoundary, {
      wrapper: ({ children }) => (
        <ErrorBoundary renderFallback={({ error }) => <>{error.message}</>}>{children}</ErrorBoundary>
      ),
    });

    act(() => {
      result.current(TestError);
    });

    expect(await screen.findByText(TEXT_ERROR)).toBeInTheDocument();
  });
});

describe('withErrorBoundary', () => {
  it('wraps component with ErrorBoundary', () => {
    const WrappedComponent = withErrorBoundary(ErrorComponent, {
      renderFallback: ({ error }) => <div>HOC error: {error.message}</div>,
    });

    render(<WrappedComponent />);

    expect(screen.getByText(`HOC error: ${TEXT_ERROR}`)).toBeInTheDocument();
  });

  it('passes props to the wrapped component', () => {
    const TestComponent = ({ message }: { message: string }) => <div>{message}</div>;

    const WrappedComponent = withErrorBoundary(TestComponent, {
      renderFallback: ({ error }) => <div>Error: {error.message}</div>,
    });

    render(<WrappedComponent message="Props passed" />);

    expect(screen.getByText('Props passed')).toBeInTheDocument();
  });
});
