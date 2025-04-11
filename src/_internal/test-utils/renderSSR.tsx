import { type ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { expect } from 'vitest';
import { vi } from 'vitest';

import { serverEnvironments } from './serverEnvironments.ts';

export async function renderSSR(ui: ReactNode, options: RenderOptions = {}) {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  const container = document.createElement('div');

  container.innerHTML = renderToString(ui);

  document.body.appendChild(container);

  const result = render(ui, {
    ...options,
    container,
    hydrate: true,
    onRecoverableError: err => {
      if (err instanceof Error && err.message.includes('Hydration failed')) {
        // console.log(err);
        console.error('Hydration failed');
      }
    },
  });

  await vi.waitFor(
    () => {
      expect(errorSpy).not.toHaveBeenCalledWith('Hydration failed');
    },
    { timeout: 1000 }
  );

  return result;
}

renderSSR.serverOnly = (ui: ReactNode) => (fn: (renderResult: RenderResult) => void) => {
  const stringified = serverEnvironments(() => renderToString(ui));

  const renderResult = render(<div dangerouslySetInnerHTML={{ __html: stringified }} />);

  fn(renderResult);
};
