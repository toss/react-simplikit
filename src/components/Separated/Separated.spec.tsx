import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderSSR } from '../../_internal/test-utils/renderSSR.tsx';

import { Separated } from './Separated.tsx';

describe('Separated', () => {
  it('is safe on server side rendering', () => {
    const CHILDREN_COUNT = 3;
    const separator = <span data-testid="separator">|</span>;
    const children = Array.from({ length: CHILDREN_COUNT }, (_, i) => (
      <div key={i} data-testid={`child-${i}`}>
        Item {i}
      </div>
    ));

    renderSSR.serverOnly(() => <Separated by={separator}>{children}</Separated>);

    for (let i = 0; i < CHILDREN_COUNT; i++) {
      expect(screen.getByTestId(`child-${i}`)).toBeInTheDocument();
    }

    expect(screen.getAllByTestId('separator')).toHaveLength(CHILDREN_COUNT - 1);
  });

  it('should render children by separator', async () => {
    const CHILDREN_COUNT = 3;
    const separator = <span data-testid="separator">|</span>;
    const children = Array.from({ length: CHILDREN_COUNT }, (_, i) => (
      <div key={i} data-testid={`child-${i}`}>
        Item {i}
      </div>
    ));

    await renderSSR(() => <Separated by={separator}>{children}</Separated>);

    for (let i = 0; i < CHILDREN_COUNT; i++) {
      expect(screen.getByTestId(`child-${i}`)).toBeInTheDocument();
    }

    expect(screen.getAllByTestId('separator')).toHaveLength(CHILDREN_COUNT - 1);
  });

  it('should not render separator by single child', async () => {
    const separator = <span data-testid="separator">|</span>;
    const child = <div data-testid="single-child">Single Item</div>;

    await renderSSR(() => <Separated by={separator}>{child}</Separated>);

    expect(screen.getByTestId('single-child')).toBeInTheDocument();
    expect(screen.queryByTestId('separator')).not.toBeInTheDocument();
  });

  it('should not render separator by empty children', async () => {
    const separator = <span data-testid="separator">|</span>;

    await renderSSR(() => (
      <Separated by={separator}>
        <></>
      </Separated>
    ));

    expect(screen.queryByTestId('separator')).not.toBeInTheDocument();
  });

  it('should filter out non-valid elements', async () => {
    const separator = <span data-testid="separator">|</span>;
    const children = [
      <div key="valid" data-testid="valid">
        Valid
      </div>,
      null,
      undefined,
      false,
      'text',
    ];

    await renderSSR(() => <Separated by={separator}>{children}</Separated>);

    expect(screen.getByTestId('valid')).toBeInTheDocument();
    expect(screen.queryByTestId('separator')).not.toBeInTheDocument();
  });
});
