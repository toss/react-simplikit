import { type ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { render, RenderOptions } from '@testing-library/react';
import { expect } from 'vitest';
import { vi } from 'vitest';

import { serverEnvironments } from './serverEnvironments.ts';

export async function renderSSR(renderer: () => ReactNode, options: RenderOptions = {}) {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  const ui = renderer();
  const serverUi = renderer();

  const container = document.createElement('div');

  container.innerHTML = renderToString(serverUi);

  document.body.appendChild(container);

  const result = render(ui, {
    ...options,
    container,
    hydrate: true,
    onRecoverableError: err => {
      if (!(err instanceof Error)) {
        console.warn(err);
        return;
      }

      console.warn(err.message);

      if (err instanceof Error && err.message.includes('Hydration failed')) {
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

renderSSR.serverOnly = (renderer: () => ReactNode) => {
  const ui = renderer();
  const stringified = serverEnvironments(() => renderToString(ui));

  const renderResult = render(<div dangerouslySetInnerHTML={{ __html: stringified }} />);

  return renderResult;
};
