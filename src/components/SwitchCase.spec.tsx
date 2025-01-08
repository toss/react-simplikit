import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SwitchCase } from './SwitchCase.tsx';

describe('SwitchCase', () => {
  it('should render correct component for string value', () => {
    render(
      <SwitchCase<'a' | 'b'>
        value="a"
        caseBy={{
          a: <div>A Component</div>,
          b: <div>B Component</div>,
        }}
      />
    );

    expect(screen.getByText('A Component')).toBeInTheDocument();
  });

  it('should render correct component for number value', () => {
    const value = 1;

    render(
      <SwitchCase<1 | 2>
        value={value}
        caseBy={{
          1: <div>One</div>,
          2: <div>Two</div>,
        }}
      />
    );

    expect(screen.getByText('One')).toBeInTheDocument();
  });

  it('should render default component when case not found', () => {
    render(
      <SwitchCase<'a' | 'b'>
        value={'c' as 'a'}
        caseBy={{
          a: <div>A Component</div>,
          b: <div>B Component</div>,
        }}
        defaultComponent={<div>Default</div>}
      />
    );

    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('should render default component when value is null', () => {
    render(
      <SwitchCase
        value={null as unknown as 'a'}
        caseBy={{
          a: <div>A Component</div>,
        }}
        defaultComponent={<div>Default</div>}
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
          true: <div>True Case</div>,
          false: <div>False Case</div>,
        }}
      />
    );

    expect(screen.getByText('True Case')).toBeInTheDocument();
  });

  it('should render nothing when no matching case and default is null', () => {
    const { container } = render(
      <SwitchCase
        value={'non-existent' as 'a'}
        caseBy={{
          a: <div>A Component</div>,
        }}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render default component with empty caseBy', () => {
    render(
      <SwitchCase
        value="any"
        caseBy={{} as unknown as { any: React.ReactNode }}
        defaultComponent={<div>Default</div>}
      />
    );

    expect(screen.getByText('Default')).toBeInTheDocument();
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
        caseBy={{ a: <div>A Component</div>, b: <NotRender /> }}
        defaultComponent={<div>Default</div>}
      />
    );

    expect(check).not.toHaveBeenCalled();
  });
});
