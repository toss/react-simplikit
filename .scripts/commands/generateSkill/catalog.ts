export const CATEGORIES = ['hooks', 'components', 'utils'] as const;

export type Category = (typeof CATEGORIES)[number];

export type CatalogEntry = {
  name: string;
  category: Category;
  description: string;
  /** The page's deprecation notice; a deprecated entry is listed under Deprecated instead of its category. */
  deprecation?: string;
};

type RenderSkillOptions = {
  template: string;
  entries: CatalogEntry[];
};

const CATALOG_PLACEHOLDER = '<!-- CATALOG -->';

const DEPRECATED_HEADING = '### Deprecated';

const CATALOG_ROW = /^\| \[`([^`]+)`\]\(references\/\1\.md\) \| .+ \|$/gm;

// A translated page carries the notice under its own title, so any container directly under the
// heading is skipped, not only the English one.
const LEADING_CONTAINER = /^:::[^\n]*\n[\s\S]*?\n:::(?:\n|$)/;

// Only where `docs:gen` writes it: a `::: warning Deprecated` further down, in the Notes for
// example, says something about the page, not that the export is deprecated.
const DEPRECATION_NOTICE = /^# [^\n]*\n\n::: warning Deprecated\n([\s\S]*?)\n:::(?:\n|$)/;

/** Catalog heading for an export: the first segment of its source path, `./hooks/x/index.ts` → `hooks`. */
export function getCategory(sourcePath: string): Category {
  const category = sourcePath.replace(/^\.\//, '').split('/')[0];
  const known = CATEGORIES.find(candidate => candidate === category);

  if (known === undefined) {
    throw new Error(`Cannot derive a catalog category from ${sourcePath}`);
  }

  return known;
}

/**
 * First sentence of a documentation page's opening paragraph, which `docs:gen` writes from the
 * JSDoc `@description`. A period inside backticks (`options.leading`) does not end the sentence,
 * and a deprecation notice above the paragraph is not part of it.
 */
export function extractDescription(markdown: string, name: string): string {
  const body = markdown
    .replace(/^# .*\n/, '')
    .trimStart()
    .replace(LEADING_CONTAINER, '')
    .trimStart();
  const paragraph = body
    .split(/\n\s*\n/)[0]
    .replace(/\n/g, ' ')
    .trim();
  const isParagraph =
    paragraph !== '' && !paragraph.startsWith('#') && !paragraph.startsWith('```') && !paragraph.startsWith('<');

  if (!isParagraph) {
    throw new Error(`${name}.md must open with a description paragraph (run \`yarn docs:gen ${name}\`)`);
  }

  let insideCode = false;

  for (let index = 0; index < paragraph.length; index++) {
    const character = paragraph[index];

    if (character === '`') {
      insideCode = !insideCode;
      continue;
    }

    const endsSentence =
      character === '.' && !insideCode && (index + 1 === paragraph.length || /\s/.test(paragraph[index + 1]));

    if (endsSentence) {
      return paragraph.slice(0, index + 1);
    }
  }

  return paragraph;
}

/**
 * Text of the deprecation notice `docs:gen` writes under a page's heading from the JSDoc
 * `@deprecated`, on one line so it fits a table cell; `undefined` when the page has none.
 */
export function extractDeprecation(markdown: string): string | undefined {
  return DEPRECATION_NOTICE.exec(markdown)?.[1]
    .trim()
    .replace(/\s*\n\s*/g, ' ');
}

/**
 * Fills the template's `<!-- CATALOG -->` with one table per category, then a Deprecated table
 * when an entry is deprecated. Categories keep the order of `CATEGORIES`; rows keep the order
 * they are given (sorted by name upstream).
 */
export function renderSkill({ template, entries }: RenderSkillOptions): string {
  if (!template.includes(CATALOG_PLACEHOLDER)) {
    throw new Error(`The skill template must contain ${CATALOG_PLACEHOLDER}`);
  }

  const sections = CATEGORIES.flatMap(category => {
    const rows = entries.filter(entry => entry.category === category && entry.deprecation == null);

    if (rows.length === 0) {
      return [];
    }

    return [
      `### ${category}`,
      '',
      '| Name | Description |',
      '| --- | --- |',
      ...rows.map(
        entry => `| [\`${entry.name}\`](references/${entry.name}.md) | ${escapeTableCell(entry.description)} |`
      ),
      '',
    ];
  });

  const deprecatedRows = entries.flatMap(({ name, deprecation }) =>
    deprecation == null ? [] : [`| [\`${name}\`](references/${name}.md) | ${escapeTableCell(deprecation)} |`]
  );
  const deprecatedSection =
    deprecatedRows.length === 0
      ? []
      : [
          DEPRECATED_HEADING,
          '',
          'These still work but are kept only for backward compatibility. Do not use them in new code; each row names the replacement.',
          '',
          '| Name | Notice |',
          '| --- | --- |',
          ...deprecatedRows,
          '',
        ];

  return template.replace(CATALOG_PLACEHOLDER, [...sections, ...deprecatedSection].join('\n').trimEnd());
}

/**
 * Names in the Deprecated table of a rendered `SKILL.md`, which `renderSkill` writes last in the
 * catalog; empty when there is none. Only catalog rows link `references/<name>.md` from their first cell.
 */
export function readDeprecatedNames(skill: string): string[] {
  const deprecatedStart = skill.indexOf(`\n${DEPRECATED_HEADING}\n`);

  if (deprecatedStart === -1) {
    return [];
  }

  return [...skill.slice(deprecatedStart).matchAll(CATALOG_ROW)].map(match => match[1]);
}

function escapeTableCell(text: string): string {
  return text.replaceAll('|', '\\|');
}
