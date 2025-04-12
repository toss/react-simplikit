/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRef, RefObject } from 'react';
import { renderToString } from 'react-dom/server';
import { render, renderHook, RenderHookOptions } from '@testing-library/react';

import { serverEnvironments } from './serverEnvironments.ts';

export function renderHookSSR<P extends Record<string, any>, Hook extends (props: P) => any>(
  useHook: Hook,
  options: RenderHookOptions<P> = {}
) {
  const result = renderHook<ReturnType<Hook>, P>(useHook, {
    ...options,
    hydrate: true,
  });

  return result;
}

renderHookSSR.serverOnly = <Hook extends () => any>(useHook: Hook) => {
  const result = createRef<ReturnType<Hook>>();

  const Component = () => {
    const hookResult = useHook();
    result.current = hookResult;
    return <div></div>;
  };

  const stringified = serverEnvironments(() => renderToString(<Component />));
  render(<div dangerouslySetInnerHTML={{ __html: stringified }} />);

  return result as RefObject<ReturnType<Hook>>;
};
