// @vitest-environment jsdom
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToString } from 'react-dom/server';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { afterEach, expect, it, vi } from 'vitest';

import * as simplikit from '../packages/react-simplikit/src/index.ts';

function loadExample(file: string, name: string): React.ComponentType {
  const markdown = readFileSync(file, 'utf8');
  const blocks = [...markdown.matchAll(/```tsx\n([\s\S]*?)\n```/g)].map(match => match[1]);
  const source = blocks.find(block => block.includes(`function ${name}(`));
  if (source == null) {
    throw new Error(`${file} has no ${name} example`);
  }
  const { outputText } = ts.transpileModule(`${source}\nexport { ${name} };`, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const modules: Record<string, unknown> = {
    react: React,
    'react/jsx-runtime': jsxRuntime,
    'react-simplikit': simplikit,
  };
  const exports: Record<string, React.ComponentType> = {};
  // Execute the actual documented snippet with the current public API, not a copied fixture.
  new Function('require', 'exports', outputText)((id: string) => {
    if (!(id in modules)) {
      throw new Error(`Unexpected example import: ${id}`);
    }
    return modules[id];
  }, exports);
  return exports[name];
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

for (const locale of ['', 'ko/', 'ja/', 'zh-Hans/', 'es/']) {
  const file = `docs/${locale}use-cases.md`;

  it(`${locale || 'en'} details example toggles content and expanded state`, () => {
    const Details = loadExample(file, 'Details');
    expect(renderToString(React.createElement(Details))).toContain('aria-expanded="false"');
    render(React.createElement(Details));
    const button = screen.getByRole('button', { name: 'Details' });
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Delivery takes 3–5 days.')).toBeDefined();
  });

  it(`${locale || 'en'} search example waits 300 ms and cancels on unmount`, () => {
    vi.useFakeTimers();
    const FruitSearch = loadExample(file, 'FruitSearch');
    expect(renderToString(React.createElement(FruitSearch))).toContain('Orange');
    const view = render(React.createElement(FruitSearch));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'ap' } });
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getAllByRole('listitem').map(item => item.textContent)).toEqual(['Apple']);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'ba' } });
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
}

for (const locale of ['', 'ko/']) {
  for (const hook of ['useDebounce', 'useDebouncedValue']) {
    it(`${locale || 'en'} ${hook} API example renders and delays the displayed query`, () => {
      vi.useFakeTimers();
      const Example = loadExample(`packages/react-simplikit/src/hooks/${hook}/${locale}${hook}.md`, 'SearchInput');
      expect(renderToString(React.createElement(Example))).toContain('<output');
      render(React.createElement(Example));
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'react' } });
      expect(screen.getByRole('status').textContent).toBe('');
      act(() => vi.advanceTimersByTime(300));
      expect(screen.getByRole('status').textContent).toBe('react');
      if (hook === 'useDebounce') {
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'cancelled' } });
        fireEvent.click(screen.getByRole('button', { name: 'Cancel pending update' }));
        act(() => vi.advanceTimersByTime(300));
        expect(screen.getByRole('status').textContent).toBe('react');
      }
    });
  }
}
