export const CATEGORIES = ['hooks', 'components', 'utils'] as const;

export type Category = (typeof CATEGORIES)[number];

export type CatalogEntry = {
  name: string;
  category: Category;
  description: string;
};

/**
 * A deprecated export, listed with its `@deprecated` text. `hasPage` is false for a `@no-docs` export,
 * whose row then links nowhere.
 */
export type DeprecatedEntry = {
  name: string;
  notice: string;
  hasPage: boolean;
};

type RenderSkillOptions = {
  template: string;
  entries: CatalogEntry[];
  deprecatedEntries: DeprecatedEntry[];
};

const CATALOG_PLACEHOLDER = '<!-- CATALOG -->';

const DEPRECATED_HEADING = '### Deprecated';

const CATALOG_ROW = /^\| \[`([^`]+)`\]\(references\/\1\.md\) \| .+ \|$/gm;

const DEPRECATED_ROW = /^\| (?:`([^`]+)`|\[`([^`]+)`\]\(references\/\2\.md\)) \| .+ \|$/gm;

// A `:::` block right under the title, such as the warning `docs:gen` puts on a `@deprecated` page.
const LEADING_CONTAINER = /^:::[^\n]*\n[\s\S]*?\n:::(?:\n|$)/;

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
 * JSDoc `@description`. A period inside backticks (`options.leading`) does not end the sentence.
 * The deprecation warning a `@deprecated` page opens with is skipped, so the description stays the
 * export's own.
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
 * Fills the template's `<!-- CATALOG -->` with one table per category, then a Deprecated table
 * when there are deprecated entries. Categories keep the order of `CATEGORIES`; rows keep the order
 * they are given (sorted by name upstream). A Deprecated row links its reference page when it has
 * one; a `@no-docs` export has none.
 */
export function renderSkill({ template, entries, deprecatedEntries }: RenderSkillOptions): string {
  if (!template.includes(CATALOG_PLACEHOLDER)) {
    throw new Error(`The skill template must contain ${CATALOG_PLACEHOLDER}`);
  }

  const sections = CATEGORIES.flatMap(category => {
    const rows = entries.filter(entry => entry.category === category);

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

  const deprecatedSection =
    deprecatedEntries.length === 0
      ? []
      : [
          DEPRECATED_HEADING,
          '',
          'These still work but are kept only for backward compatibility. Do not use them in new code; each row names the replacement.',
          '',
          '| Name | Notice |',
          '| --- | --- |',
          // A wrapped `@deprecated` text is joined into one line so it fits the table cell.
          ...deprecatedEntries.map(
            ({ name, notice, hasPage }) =>
              `| ${hasPage ? `[\`${name}\`](references/${name}.md)` : `\`${name}\``} | ${escapeTableCell(notice.replace(/\s*\n\s*/g, ' '))} |`
          ),
          '',
        ];

  return template.replace(CATALOG_PLACEHOLDER, [...sections, ...deprecatedSection].join('\n').trimEnd());
}

/**
 * Names of the catalog rows of a rendered `SKILL.md`: the rows that link `references/<name>.md` from
 * their first cell, above the Deprecated table, whose rows can link a reference too.
 */
export function readCatalogNames(skill: string): string[] {
  const deprecatedStart = skill.indexOf(`\n${DEPRECATED_HEADING}\n`);
  const catalog = deprecatedStart === -1 ? skill : skill.slice(0, deprecatedStart);

  return [...catalog.matchAll(CATALOG_ROW)].map(match => match[1]);
}

/**
 * Names in the Deprecated table of a rendered `SKILL.md`, which `renderSkill` writes last in the
 * catalog; empty when there is none. The section ends at the next heading, so a table further
 * down the template is not read as part of it.
 */
export function readDeprecatedNames(skill: string): string[] {
  const deprecatedStart = skill.indexOf(`\n${DEPRECATED_HEADING}\n`);

  if (deprecatedStart === -1) {
    return [];
  }

  const [section] = skill.slice(deprecatedStart + `\n${DEPRECATED_HEADING}\n`.length).split(/^#+ /m);

  return [...section.matchAll(DEPRECATED_ROW)].map(match => match[1] ?? match[2]);
}

function escapeTableCell(text: string): string {
  return text.replaceAll('|', '\\|');
}
