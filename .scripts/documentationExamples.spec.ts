// @vitest-environment jsdom
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToString } from 'react-dom/server';
import { cleanup, render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { afterEach, expect, it } from 'vitest';

import * as simplikit from '../packages/react-simplikit/src/index.ts';

function readExamples(file: string): string[] {
  return [...readFileSync(file, 'utf8').matchAll(/```tsx\n([\s\S]*?)\n```/g)].map(match => match[1]);
}

function loadExample(source: string): React.ComponentType {
  const name = source.match(/function ([A-Z]\w*)\(/)?.[1];
  if (name == null) {
    throw new Error('The example must declare a component');
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
  // Execute the documented snippet, not a copied fixture.
  new Function('require', 'exports', outputText)((id: string) => {
    if (!(id in modules)) {
      throw new Error(`Unexpected example import: ${id}`);
    }
    return modules[id];
  }, exports);
  return exports[name];
}

afterEach(cleanup);

for (const [directory, filename, locales] of [
  ['docs', 'use-cases.md', ['ko', 'ja', 'zh-Hans', 'es']],
  ['packages/react-simplikit/src/hooks/useDebounce', 'useDebounce.md', ['ko']],
  ['packages/react-simplikit/src/hooks/useDebouncedValue', 'useDebouncedValue.md', ['ko']],
] as const) {
  it(`${filename} examples render and match their translations`, () => {
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
