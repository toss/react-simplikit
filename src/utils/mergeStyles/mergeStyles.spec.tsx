import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mergeStyles } from './mergeStyles.ts';

describe('mergeStyles (logic only)', () => {
  it('returns undefined when no styles are provided', () => {
    expect(mergeStyles()).toBeUndefined();
  });

  it('returns undefined when all styles are undefined', () => {
    expect(mergeStyles(undefined)).toBeUndefined();
  });

  it('merges single style correctly', () => {
    const style = { color: 'blue' };

    expect(mergeStyles(style)).toEqual({ color: 'blue' });
  });

  it('merges multiple styles with override', () => {
    const style1 = { fontSize: '14px', color: 'blue' };
    const style2 = { fontSize: '16px' };
    const style3 = { color: 'red' };

    expect(mergeStyles(style1, style2, style3)).toEqual({
      fontSize: '16px',
      color: 'red',
    });
  });

  it('includes properties with undefined values', () => {
    const style = { visibility: undefined, margin: 0 };

    expect(mergeStyles(style)).toEqual(style);
  });

  it('handles plain object with numeric values', () => {
    const style1 = { zIndex: 10 };
    const style2 = { opacity: 0.5 };

    expect(mergeStyles(style1, style2)).toEqual({
      zIndex: 10,
      opacity: 0.5,
    });
  });
});

describe('mergeStyles (rendering)', () => {
  it('applies merged styles to a DOM element', () => {
    const style1 = { color: 'red', fontSize: '14px' };
    const style2 = { fontWeight: 'bold', fontSize: '16px' };
    const merged = mergeStyles(style1, style2);

    const { getByText } = render(
      <div data-testid="styled" style={merged}>
        Styled Text
      </div>
    );

    const el = getByText('Styled Text');

    expect(el).toHaveStyle({
      color: 'rgb(255, 0, 0)', // 'red' is rendered as rgb(255, 0, 0)
      fontSize: '16px',
      fontWeight: 'bold',
    });
  });

  it('renders element without style if merge result is undefined', () => {
    const merged = mergeStyles(undefined);

    const { getByTestId } = render(
      <div data-testid="unstyled" style={merged}>
        Plain
      </div>
    );

    const el = getByTestId('unstyled');

    expect(el.getAttribute('style')).toBeNull();
  });
});
