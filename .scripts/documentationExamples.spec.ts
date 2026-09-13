// @vitest-environment jsdom
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToString } from 'react-dom/server';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { afterEach, expect, it, vi } from 'vitest';

import * as simplikit from '../packages/react-simplikit/src/index.ts';

function readExamples(file: string): string[] {
  return [...readFileSync(file, 'utf8').matchAll(/```tsx[^\n]*\n([\s\S]*?)\n```/g)].map(match => match[1]);
}

function loadExample(source: string): React.ComponentType {
  const componentName = source.match(/function ([A-Z]\w*)\(/)?.[1];
  if (componentName == null) {
    throw new Error('The example must declare a named component with the function keyword');
  }
  const { outputText } = ts.transpileModule(`${source}\nexport { ${componentName} };`, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const modules: Record<string, unknown> = {
    react: React,
    'react/jsx-runtime': jsxRuntime,
    'react-simplikit': simplikit,
  };
  const exports: Record<string, React.ComponentType> = {};
  // Execute the Markdown example against the current public API.
  const executeExample = new Function('require', 'exports', outputText);
  executeExample((id: string) => {
    if (!(id in modules)) {
      throw new Error(`Unexpected example import: ${id}`);
    }
    return modules[id];
  }, exports);
  return exports[componentName];
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

for (const [directory, filename, locales] of [
  ['docs', 'use-cases.md', ['ko', 'ja', 'zh-Hans', 'es']],
  ['docs', 'why-react-simplikit-matters.md', ['ko', 'ja', 'zh-Hans', 'es']],
  ['packages/react-simplikit/src/hooks/useDebounce', 'useDebounce.md', ['ko']],
  ['packages/react-simplikit/src/hooks/useDebouncedValue', 'useDebouncedValue.md', ['ko']],
] as const) {
  it(`${filename} examples render and use the same code in every translation`, () => {
    const examples = readExamples(`${directory}/${filename}`);
    expect(examples.length).toBeGreaterThan(0);
    for (const source of examples) {
      const element = React.createElement(loadExample(source));
      expect(renderToString(element)).not.toBe('');
      expect(render(element).container.childElementCount).toBeGreaterThan(0);
    }
    for (const locale of locales) {
      expect(readExamples(`${directory}/${locale}/${filename}`)).toEqual(examples);
    }
  });
}

it('both countdown examples pause, resume, stop at zero and clean up on unmount', () => {
  vi.useFakeTimers();
  const examples = readExamples('docs/why-react-simplikit-matters.md');
  expect(examples).toHaveLength(2);

  for (const source of examples) {
    const element = React.createElement(loadExample(source));
    const view = render(element);
    act(() => vi.advanceTimersByTime(1000));
    expect(view.getByText('9 seconds')).toBeDefined();
    fireEvent.click(view.getByRole('button', { name: 'Pause' }));
    act(() => vi.advanceTimersByTime(2000));
    expect(view.getByText('9 seconds')).toBeDefined();
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(view.getByRole('button', { name: 'Resume' }));
    for (let tick = 0; tick < 9; tick++) {
      act(() => vi.advanceTimersByTime(1000));
    }
    expect(view.getByText('0 seconds')).toBeDefined();
    expect(vi.getTimerCount()).toBe(0);
    view.unmount();
    const running = render(element);
    expect(vi.getTimerCount()).toBe(1);
    running.unmount();
    expect(vi.getTimerCount()).toBe(0);
  }
});
