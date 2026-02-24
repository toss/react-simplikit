/* eslint-disable @typescript-eslint/no-explicit-any */
import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderSSR } from '../../_internal/test-utils/renderSSR.tsx';

import { ImpressionArea } from './ImpressionArea.tsx';

const mockInstances: any[] = [];

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {
    mockInstances.push(this);
  }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

describe('ImpressionArea', () => {
  const mockOnImpressionStart = vi.fn();
  const mockOnImpressionEnd = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is safe on server side rendering', () => {
    renderSSR.serverOnly(() => (
      <ImpressionArea onImpressionStart={mockOnImpressionStart} onImpressionEnd={mockOnImpressionEnd}>
        <span>Test Content</span>
      </ImpressionArea>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders children correctly', async () => {
    await renderSSR(() => (
      <ImpressionArea onImpressionStart={mockOnImpressionStart} onImpressionEnd={mockOnImpressionEnd}>
        <span>Test Content</span>
      </ImpressionArea>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('calls onImpressionStart when the element becomes visible', async () => {
    await renderSSR(() => (
      <ImpressionArea onImpressionStart={mockOnImpressionStart} onImpressionEnd={mockOnImpressionEnd}>
        <div>Visible Content</div>
      </ImpressionArea>
    ));

    const observerCallback = mockInstances[0].callback;
    observerCallback([{ isIntersecting: true, intersectionRatio: 0.6 }], null);
    vi.runAllTimers();

    expect(mockOnImpressionStart).toHaveBeenCalledTimes(1);
  });

  it('calls onImpressionEnd when the element goes out of view', async () => {
    await renderSSR(() => (
      <ImpressionArea onImpressionStart={mockOnImpressionStart} onImpressionEnd={mockOnImpressionEnd}>
        <div>Visible Content</div>
      </ImpressionArea>
    ));

    const observerCallback = mockInstances[0].callback;
    observerCallback([{ isIntersecting: true, intersectionRatio: 0.6 }], null);
    // vi.runAllTimers();

    observerCallback([{ isIntersecting: false, intersectionRatio: 0 }], null);
    // vi.runAllTimers();

    expect(mockOnImpressionEnd).toHaveBeenCalledTimes(1);
  });
});
