import fs from 'node:fs';
import path from 'node:path';

import { LocaleDefinition, localeDefinitions } from '../../../.vitepress/locales.mts';
import { listDirectories } from '../../../.vitepress/shared.mts';
import { getRootPath } from '../../utils/getRootPath.ts';
import { extractDescription } from '../generateSkill/catalog.ts';

const PACKAGE_SRC = 'packages/react-simplikit/src';

type Group = { labelKey: 'hooksLabel' | 'componentsLabel' | 'utilsLabel'; directories: string[] };
type IndexEntry = { name: string; url: string; description?: string; translated: boolean };
type IndexSection = { label: string; entries: IndexEntry[] };

// Mirrors the sidebar: the src/mobile trees share the flat hooks/utils URLs and the
// same three lists, sorted together.
const GROUPS: Group[] = [
  { labelKey: 'hooksLabel', directories: ['hooks', 'mobile/hooks'] },
  { labelKey: 'componentsLabel', directories: ['components'] },
  { labelKey: 'utilsLabel', directories: ['utils', 'mobile/utils'] },
];

/**
 * Generates one reference index page per locale: every export as
 * "name — first sentence of its document", grouped the same way as the sidebar.
 * The output is untracked; `docs:prepare` recreates it before every build.
 */
export function generateReferenceIndex(): void {
  const root = getRootPath();

  for (const locale of Object.values(localeDefinitions)) {
    const sections = GROUPS.map(group => ({
      label: locale.themeStrings[group.labelKey],
      entries: collectEntries(root, locale, group),
    }));
    const target = path.join(root, 'docs', locale.path, 'reference.md');

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, renderPage(locale, sections));
  }
}

function collectEntries(root: string, locale: LocaleDefinition, group: Group): IndexEntry[] {
  const isRoot = locale.path === '';
  const urlPrefix = isRoot ? '' : `/${locale.path}`;

  return group.directories
    .flatMap(directory => {
      const base = path.join(root, PACKAGE_SRC, directory);
      const category = path.basename(directory);

      return listDirectories(base).map(name => {
        const localized = isRoot ? undefined : readDescription(path.join(base, name, locale.path, `${name}.md`), name);

        return {
          name,
          url: `${urlPrefix}/${category}/${name}`,
          description: localized ?? readDescription(path.join(base, name, `${name}.md`), name),
          translated: isRoot || localized != null,
        };
      });
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * The first sentence of a documentation page, by the same rule the skill catalog
 * uses; undefined when the page is missing or does not open with a paragraph.
 */
function readDescription(markdownPath: string, name: string): string | undefined {
  try {
    return extractDescription(fs.readFileSync(markdownPath, 'utf8'), name);
  } catch {
    return undefined;
  }
}

/**
 * Descriptions fall back to the English documents whenever a locale has none, so
 * the page carries the same untranslated banner an individual fallback gets.
 */
function renderPage(locale: LocaleDefinition, sections: IndexSection[]): string {
  const hasFallback = sections.some(section => section.entries.some(entry => !entry.translated));
  const frontmatter = [
    '---',
    'editLink: false',
    ...(hasFallback ? ['untranslated: true', 'sourceLocale: en'] : []),
    '---',
  ];
  const body = [`# ${locale.themeStrings.referenceLabel}`, ...sections.map(renderSection)];

  return `${frontmatter.join('\n')}\n\n${body.join('\n\n')}\n`;
}

function renderSection({ label, entries }: IndexSection): string {
  return `## ${label}\n\n${entries.map(renderEntry).join('\n')}`;
}

function renderEntry({ name, url, description }: IndexEntry): string {
  return `- [${name}](${url})${description == null ? '' : ` — ${description}`}`;
}
