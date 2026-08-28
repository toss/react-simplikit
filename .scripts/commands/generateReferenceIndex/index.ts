import fs from 'node:fs/promises';
import path from 'node:path';

import { localeDefinitions } from '../../../.vitepress/locales.mts';
import { getRootPath } from '../../utils/getRootPath.ts';

const PACKAGE_SRC = 'packages/react-simplikit/src';

type Group = { labelKey: 'hooksLabel' | 'componentsLabel' | 'utilsLabel' | 'mobileWebLabel'; directories: string[] };

// Mirrors the sidebar grouping: the mobile trees share the flat hooks/utils URLs
// but stay a separate group so mobile web stays discoverable as a category.
const GROUPS: Group[] = [
  { labelKey: 'hooksLabel', directories: ['hooks'] },
  { labelKey: 'componentsLabel', directories: ['components'] },
  { labelKey: 'utilsLabel', directories: ['utils'] },
  { labelKey: 'mobileWebLabel', directories: ['mobile/hooks', 'mobile/utils'] },
];

/**
 * Extracts the first descriptive sentence from a co-located document: the first
 * paragraph line after the title, cut at the end of its first sentence.
 */
async function firstSentence(markdownPath: string): Promise<string | undefined> {
  let text: string;

  try {
    text = await fs.readFile(markdownPath, 'utf8');
  } catch {
    return undefined;
  }

  const lines = text.split('\n');
  let inFrontmatter = false;

  for (const [index, line] of lines.entries()) {
    if (index === 0 && line.trim() === '---') {
      inFrontmatter = true;
      continue;
    }

    if (inFrontmatter) {
      if (line.trim() === '---') {
        inFrontmatter = false;
      }
      continue;
    }

    const trimmed = line.trim();

    if (trimmed === '' || trimmed.startsWith('#') || trimmed.startsWith('<') || trimmed.startsWith(':::')) {
      continue;
    }

    const sentenceEnd = trimmed.search(/(?<=[.!?。])\s|(?<=[.!?。])$/);
    return sentenceEnd === -1 ? trimmed : trimmed.slice(0, sentenceEnd);
  }

  return undefined;
}

/**
 * Generates one reference index page per locale: every export as
 * "name - first sentence of its document", grouped the same way as the sidebar.
 * The output is untracked; `docs:prepare` recreates it before every build.
 */
export async function generateReferenceIndex(): Promise<void> {
  const root = getRootPath();

  for (const definition of Object.values(localeDefinitions)) {
    const localeSegment = definition.path === '' ? '' : `${definition.path}/`;
    const urlPrefix = definition.path === '' ? '' : `/${definition.path}`;
    const strings = definition.themeStrings;
    const sections: string[] = [`# ${strings.referenceLabel}`];

    for (const group of GROUPS) {
      const items: string[] = [];

      for (const directory of group.directories) {
        const category = directory.split('/').pop() as string;
        const base = path.join(root, PACKAGE_SRC, directory);
        const entries = await fs.readdir(base, { withFileTypes: true });

        for (const entry of entries) {
          if (!entry.isDirectory()) {
            continue;
          }

          const name = entry.name;
          const localized = path.join(base, name, definition.path, `${name}.md`);
          const english = path.join(base, name, `${name}.md`);
          const description =
            (definition.path === '' ? undefined : await firstSentence(localized)) ?? (await firstSentence(english));

          items.push(
            `- [${name}](${urlPrefix}/${category}/${name})${description === undefined ? '' : ` — ${description}`}`
          );
        }
      }

      items.sort((a, b) => a.localeCompare(b));
      sections.push(`## ${strings[group.labelKey]}`, items.join('\n'));
    }

    const target = path.join(root, 'docs', localeSegment, 'reference.md');
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, `${sections.join('\n\n')}\n`);
  }
}
