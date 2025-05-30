import { useEffect, useState } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderSSR } from '../../_internal/test-utils/renderSSR.tsx';

import { useIsMounted } from './useIsMounted.ts';

function TestComponent() {
  const isMounted = useIsMounted();
  const [status, setStatus] = useState('initial');

  useEffect(() => {
    if (isMounted()) {
      setStatus('mounted');
    } else {
      setStatus('not mounted');
    }
  }, [isMounted]);

  return <div>{status}</div>;
}

describe('useIsMounted', () => {
  it('should render "initial" text on server (SSR) without hydration', () => {
    renderSSR.serverOnly(() => <TestComponent />);

    expect(screen.getByText('initial')).toBeInTheDocument();
  });

  it('should update to "mounted" after hydration on client', async () => {
    await renderSSR(() => <TestComponent />);

    expect(screen.getByText('mounted')).toBeInTheDocument();
  });

  it('should render "mounted" when rendered directly on the client', () => {
    render(<TestComponent />);

    expect(screen.getByText('mounted')).toBeInTheDocument();
  });

  it('should return false after unmount', () => {
    let checkIsMounted: () => boolean = () => false;

    function TempComponent() {
      checkIsMounted = useIsMounted();

      return <div>Testing</div>;
    }

    const { unmount } = render(<TempComponent />);

    expect(checkIsMounted()).toBe(true);

    unmount();

    expect(checkIsMounted()).toBe(false);
  });
});
