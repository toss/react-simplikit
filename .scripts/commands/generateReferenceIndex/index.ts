import fs from 'node:fs/promises';
import path from 'node:path';

import { LocaleDefinition, localeDefinitions } from '../../../.vitepress/locales.mts';
import { getRootPath } from '../../utils/getRootPath.ts';

const PACKAGE_SRC = 'packages/react-simplikit/src';

type GroupLabelKey = 'hooksLabel' | 'componentsLabel' | 'utilsLabel';
type Group = { labelKey: GroupLabelKey; directories: string[] };
type IndexEntry = { name: string; url: string; description?: string; translated: boolean };
type IndexSection = { label: string; entries: IndexEntry[] };

// Mirrors the sidebar: the src/mobile trees share the flat hooks/utils URLs and the
// same three lists, sorted together.
const GROUPS: Group[] = [
  { labelKey: 'hooksLabel', directories: ['hooks', 'mobile/hooks'] },
  { labelKey: 'componentsLabel', directories: ['components'] },
  { labelKey: 'utilsLabel', directories: ['utils', 'mobile/utils'] },
];

// Lines that cannot open a description: headings, HTML, and VitePress containers.
const NON_PARAGRAPH_LINE = /^(#|<|:::)/;
const SENTENCE_END = /(?<=[.!?。])\s|(?<=[.!?。])$/;

/**
 * Generates one reference index page per locale: every export as
 * "name — first sentence of its document", grouped the same way as the sidebar.
 * The output is untracked; `docs:prepare` recreates it before every build.
 */
export async function generateReferenceIndex(): Promise<void> {
  const root = getRootPath();

  for (const locale of Object.values(localeDefinitions)) {
    await writeReferencePage(root, locale);
  }
}

async function writeReferencePage(root: string, locale: LocaleDefinition): Promise<void> {
  const sections = await Promise.all(
    GROUPS.map(async group => ({
      label: locale.themeStrings[group.labelKey],
      entries: await collectEntries(root, locale, group),
    }))
  );
  const target = path.join(root, 'docs', locale.path, 'reference.md');

  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, renderPage(locale, sections));
}

async function collectEntries(root: string, locale: LocaleDefinition, group: Group): Promise<IndexEntry[]> {
  const entries = await Promise.all(
    group.directories.map(directory => collectDirectoryEntries(root, locale, directory))
  );

  return entries.flat().sort((a, b) => a.name.localeCompare(b.name));
}

async function collectDirectoryEntries(
  root: string,
  locale: LocaleDefinition,
  directory: string
): Promise<IndexEntry[]> {
  const base = path.join(root, PACKAGE_SRC, directory);
  const category = path.basename(directory);
  const names = await listDirectories(base);

  return Promise.all(
    names.map(async name => {
      const localized =
        locale.path === '' ? undefined : await readFirstSentence(path.join(base, name, locale.path, `${name}.md`));
      const description = localized ?? (await readFirstSentence(path.join(base, name, `${name}.md`)));
      const urlPrefix = locale.path === '' ? '' : `/${locale.path}`;

      return {
        name,
        url: `${urlPrefix}/${category}/${name}`,
        description,
        translated: locale.path === '' || localized != null,
      };
    })
  );
}

async function listDirectories(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
}

async function readFirstSentence(markdownPath: string): Promise<string | undefined> {
  try {
    return firstSentence(await fs.readFile(markdownPath, 'utf8'));
  } catch {
    return undefined;
  }
}

/**
 * The first paragraph line after the frontmatter and title, cut at the end of its
 * first sentence.
 */
function firstSentence(markdown: string): string | undefined {
  const line = stripFrontmatter(markdown)
    .split('\n')
    .map(candidate => candidate.trim())
    .find(candidate => candidate !== '' && !NON_PARAGRAPH_LINE.test(candidate));

  if (line == null) {
    return undefined;
  }

  const sentenceEnd = line.search(SENTENCE_END);

  return sentenceEnd === -1 ? line : line.slice(0, sentenceEnd);
}

function stripFrontmatter(markdown: string): string {
  return markdown.replace(/^---\s*\n[\s\S]*?\n---\s*(\n|$)/, '');
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
