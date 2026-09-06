import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

import { extractDescription, getCategory, renderSkill } from './catalog.ts';

describe('getCategory', () => {
  it('derives the category from the export source path, ignoring the mobile directory', () => {
    assert.equal(getCategory('./hooks/useToggle/index.ts'), 'hooks');
    assert.equal(getCategory('./components/Separated/index.ts'), 'components');
    assert.equal(getCategory('./utils/mergeRefs/index.ts'), 'utils');
    assert.equal(getCategory('./mobile/hooks/useKeyboardHeight/index.ts'), 'hooks');
    assert.equal(getCategory('./mobile/utils/isIOS/index.ts'), 'utils');
  });

  it('rejects a path outside the known categories', () => {
    assert.throws(() => getCategory('./_internal/helper/index.ts'), /Cannot derive a catalog category/);
  });
});

describe('extractDescription', () => {
  it('returns the first sentence of the opening paragraph', () => {
    const markdown = `# useDebounce

\`useDebounce\` is a React hook that returns a debounced callback. It groups calls
into one.

## Interface
`;

    assert.equal(
      extractDescription(markdown, 'useDebounce'),
      '`useDebounce` is a React hook that returns a debounced callback.'
    );
  });

  it('does not end the sentence at a period inside backticks', () => {
    const markdown = `# useX\n\nReads \`options.leading\` first. Then more.\n`;

    assert.equal(extractDescription(markdown, 'useX'), 'Reads `options.leading` first.');
  });

  it('returns the whole paragraph when it has no sentence break', () => {
    const markdown = `# useX\n\nA React hook that manages a Set as state\n\n## Interface\n`;

    assert.equal(extractDescription(markdown, 'useX'), 'A React hook that manages a Set as state');
  });

  it('rejects a page that does not open with a paragraph', () => {
    assert.throws(
      () => extractDescription('# useX\n\n## Interface\n', 'useX'),
      /must open with a description paragraph/
    );
    assert.throws(() => extractDescription('# useX\n', 'useX'), /must open with a description paragraph/);
  });
});

describe('renderSkill', () => {
  it('replaces the catalog placeholder with one table per category, in a fixed order', () => {
    const rendered = renderSkill({
      template: '# Skill\n\n## Catalog\n\n<!-- CATALOG -->\n\n## Learn more\n',
      entries: [
        { name: 'isIOS', category: 'utils', description: 'Detects iOS.' },
        { name: 'useToggle', category: 'hooks', description: 'Toggles a | boolean.' },
      ],
    });

    assert.equal(
      rendered,
      `# Skill

## Catalog

### hooks

| Name | Description |
| --- | --- |
| [\`useToggle\`](references/useToggle.md) | Toggles a \\| boolean. |

### utils

| Name | Description |
| --- | --- |
| [\`isIOS\`](references/isIOS.md) | Detects iOS. |

## Learn more
`
    );
  });

  it('rejects a template without the placeholder', () => {
    assert.throws(() => renderSkill({ template: '# Skill\n', entries: [] }), /<!-- CATALOG -->/);
  });
});
