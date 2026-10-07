import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

import { extractDescription, getCategory, readCatalogNames, readDeprecatedNames, renderSkill } from './catalog.ts';

describe('getCategory', () => {
  it('derives the category from the export source path', () => {
    assert.equal(getCategory('./hooks/useToggle/index.ts'), 'hooks');
    assert.equal(getCategory('./components/Separated/index.ts'), 'components');
    assert.equal(getCategory('./utils/mergeRefs/index.ts'), 'utils');
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
      deprecatedEntries: [],
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

  it('lists a deprecated entry under Deprecated as an unlinked row with its notice on one line', () => {
    const rendered = renderSkill({
      template: '# Skill\n\n## Catalog\n\n<!-- CATALOG -->\n\n## Learn more\n',
      entries: [{ name: 'useNew', category: 'hooks', description: 'Does it.' }],
      deprecatedEntries: [{ name: 'useOld', notice: 'Use `useNew` | not this.\nIt goes away\nlater.' }],
    });

    assert.equal(
      rendered,
      `# Skill

## Catalog

### hooks

| Name | Description |
| --- | --- |
| [\`useNew\`](references/useNew.md) | Does it. |

### Deprecated

These still work but are kept only for backward compatibility. Do not use them in new code; each row names the replacement.

| Name | Notice |
| --- | --- |
| \`useOld\` | Use \`useNew\` \\| not this. It goes away later. |

## Learn more
`
    );
  });

  it('rejects a template without the placeholder', () => {
    assert.throws(() => renderSkill({ template: '# Skill\n', entries: [], deprecatedEntries: [] }), /<!-- CATALOG -->/);
  });
});

describe('readCatalogNames', () => {
  it('reads the linked rows only, so a deprecated export is not counted as documented', () => {
    const skill = renderSkill({
      template: '# Skill\n\n| Need | Use |\n| --- | --- |\n| Toggle | `useToggle` |\n\n<!-- CATALOG -->\n',
      entries: [
        { name: 'isIOS', category: 'utils', description: 'Detects iOS.' },
        { name: 'useNew', category: 'hooks', description: 'Does it.' },
      ],
      deprecatedEntries: [{ name: 'useOld', notice: 'Use `useNew` instead.' }],
    });

    assert.deepEqual(readCatalogNames(skill), ['useNew', 'isIOS']);
  });
});

describe('readDeprecatedNames', () => {
  it('reads only the names in the Deprecated table of the rendered catalog', () => {
    const skill = renderSkill({
      template:
        '# Skill\n\n| Need | Use |\n| --- | --- |\n| `useBefore` | Toggle |\n\n<!-- CATALOG -->\n\n## Learn more\n\n| Name | Link |\n| --- | --- |\n| `useAfter` | Docs |\n',
      entries: [
        { name: 'isIOS', category: 'utils', description: 'Detects iOS.' },
        { name: 'useNew', category: 'hooks', description: 'Does it.' },
      ],
      deprecatedEntries: [{ name: 'useOld', notice: 'Use `useNew` instead.' }],
    });

    assert.deepEqual(readDeprecatedNames(skill), ['useOld']);
  });

  it('reports no deprecated names when the catalog has no Deprecated table', () => {
    const skill = renderSkill({
      template: '<!-- CATALOG -->\n',
      entries: [{ name: 'useNew', category: 'hooks', description: 'Does it.' }],
      deprecatedEntries: [],
    });

    assert.deepEqual(readDeprecatedNames(skill), []);
  });
});
