import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderSSR } from '../../_internal/test-utils/renderSSR.tsx';

import { buildContext } from './buildContext.tsx';

describe('buildContext', () => {
  type TestContextType = {
    title: string;
  };

  const defaultValues: TestContextType = {
    title: 'default title',
  };

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should create context with provider and hook', () => {
    const [Provider, useContext] = buildContext<TestContextType>('Test');
    expect(Provider).toBeDefined();
    expect(useContext).toBeDefined();
  });

  it('should provide and consume context values', async () => {
    const [Provider, useContext] = buildContext<TestContextType>('Test');

    function TestComponent() {
      const context = useContext();
      return <h1>{context.title}</h1>;
    }

    await renderSSR(() => (
      <Provider title="test title">
        <TestComponent />
      </Provider>
    ));

    expect(await screen.findByText('test title')).toBeInTheDocument();
  });

  it('should provide and consume default values', async () => {
    const [Provider, useContext] = buildContext<TestContextType>('Test', defaultValues);

    function TestComponent() {
      const context = useContext();
      return <h1>{context.title}</h1>;
    }

    await renderSSR(() => (
      <Provider>
        <TestComponent />
      </Provider>
    ));

    expect(await screen.findByText('default title')).toBeInTheDocument();
  });

  it('should use the closest context provider', async () => {
    const [Provider, useContext] = buildContext<TestContextType>('Test', defaultValues);

    function TestComponent({ testId }: { testId: string }) {
      const context = useContext();
      return <h1 data-testid={testId}>{context.title}</h1>;
    }

    await renderSSR(() => (
      <Provider title="outer title">
        <div data-testid="outer-scope">
          <TestComponent testId="outer-component" />
          <Provider title="inner title">
            <div data-testid="inner-scope">
              <TestComponent testId="inner-component" />
            </div>
          </Provider>
        </div>
      </Provider>
    ));

    const outerComponent = screen.getByTestId('outer-component');
    const innerComponent = screen.getByTestId('inner-component');

    expect(outerComponent).toHaveTextContent('outer title');
    expect(innerComponent).toHaveTextContent('inner title');

    const outerScope = screen.getByTestId('outer-scope');
    const innerScope = screen.getByTestId('inner-scope');

    expect(outerScope).toContainElement(innerScope);
    expect(innerScope).toContainElement(innerComponent);
    expect(outerScope).toContainElement(outerComponent);
  });

  it('should throw error when used outside provider', async () => {
    const [, useContext] = buildContext<TestContextType>('Test');

    function TestComponent() {
      const context = useContext();
      return <h1>{context.title}</h1>;
    }

    await expect(async () => await renderSSR(() => <TestComponent />)).rejects.toThrow(
      '`TestContext` must be used within `TestProvider`'
    );
  });

  it('should throw error when no values available', async () => {
    const [Provider, useContext] = buildContext<TestContextType>('Test');

    function TestComponent() {
      const context = useContext();
      return <h1>{context.title}</h1>;
    }

    await expect(
      async () =>
        await renderSSR(() => (
          <Provider>
            <TestComponent />
          </Provider>
        ))
    ).rejects.toThrow();
  });
});
