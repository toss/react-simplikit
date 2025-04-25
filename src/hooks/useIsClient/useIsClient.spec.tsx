import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderSSR } from '../../_internal/test-utils/renderSSR.tsx';

import { useIsClient } from './useIsClient.ts';

function TestComponent() {
  const isClient = useIsClient();

  return <div>{isClient ? 'Client-side' : 'Server-side'}</div>;
}

describe('useIsClient', () => {
  it('should render "Server-side" text when rendered in a server environment (SSR)', () => {
    renderSSR.serverOnly(() => <TestComponent />);

    expect(screen.getByText('Server-side')).toBeInTheDocument();
  });

  it('should update to "Client-side" text after hydration on the client', async () => {
    await renderSSR(() => <TestComponent />);

    expect(screen.getByText('Client-side')).toBeInTheDocument();
  });

  it('should render "Client-side" text when mounted directly on the client', async () => {
    render(<TestComponent />);

    expect(screen.getByText('Client-side')).toBeInTheDocument();
  });
});
