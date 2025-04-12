import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderSSR } from '../../_internal/test-utils/renderSSR.tsx';

import { SwitchCase } from './SwitchCase.tsx';

describe('SwitchCase', () => {
  it('is safe on server side rendering', () => {
    const caseBy = { a: () => <div>A Component</div>, b: () => <div>B Component</div> };
    renderSSR.serverOnly(() => <SwitchCase value="a" caseBy={caseBy} />);

    expect(screen.getByText('A Component')).toBeInTheDocument();

    renderSSR.serverOnly(() => <SwitchCase value="b" caseBy={caseBy} />);

    expect(screen.getByText('B Component')).toBeInTheDocument();
  });

  it('should render correct component for string value', () => {
    const getStringValue = () => {
      const value = 'a';
      return value as 'a' | 'b';
    };

    const value = getStringValue();
    render(
      <SwitchCase
        value={value}
        caseBy={{
          a: () => <div>A Component</div>,
          b: () => <div>B Component</div>,
        }}
      />
    );

    expect(screen.getByText('A Component')).toBeInTheDocument();
  });

  it('should render correct component for number value', () => {
    const getNumberValue = () => {
      const value = 1;

      return value as 1 | 2;
    };

    const value = getNumberValue();

    render(
      <SwitchCase
        value={value}
        caseBy={{
          1: () => <div>One</div>,
          2: () => <div>Two</div>,
        }}
      />
    );

    expect(screen.getByText('One')).toBeInTheDocument();
  });

  it('should render default component when case not found', () => {
    const getStringValue = () => {
      const value = 'c';
      return value as 'a' | 'b' | 'c';
    };

    const value = getStringValue();
    render(
      <SwitchCase
        value={value}
        caseBy={{
          a: () => <div>A Component</div>,
          b: () => <div>B Component</div>,
        }}
        defaultComponent={() => <div>Default</div>}
      />
    );

    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('should render default component when value is null', () => {
    render(
      <SwitchCase
        value={null}
        caseBy={{
          a: () => <div>A Component</div>,
        }}
        defaultComponent={() => <div>Default</div>}
      />
    );

    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('should handle boolean values converted to string', () => {
    const value = true;

    render(
      <SwitchCase
        value={value}
        caseBy={{
          true: () => <div>True Case</div>,
          false: () => <div>False Case</div>,
        }}
      />
    );

    expect(screen.getByText('True Case')).toBeInTheDocument();
  });

  it('should render nothing when no matching case and default is null', () => {
    const getValue = () => {
      const value = undefined;
      return value as 'a' | 'b' | undefined;
    };

    const value = getValue();
    const { container } = render(
      <SwitchCase
        value={value}
        caseBy={{
          a: () => <div>A Component</div>,
          b: () => <div>B Component</div>,
        }}
        defaultComponent={() => null}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render only target component', () => {
    const check = vi.fn();

    const NotRender = () => {
      useEffect(() => {
        check();
      }, []);

      return null;
    };

    render(
      <SwitchCase<'a' | 'b'>
        value="a"
        caseBy={{ a: () => <div>A Component</div>, b: () => <NotRender /> }}
        defaultComponent={() => <div>Default</div>}
      />
    );

    expect(check).not.toHaveBeenCalled();
  });

  it('should use default null component when defaultComponent is not provided', () => {
    const { container } = render(
      <SwitchCase
        value="nonexistent"
        caseBy={{
          a: () => <div>A Component</div>,
        }}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
