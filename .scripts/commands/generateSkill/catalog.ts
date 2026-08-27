export const CATEGORIES = ['hooks', 'components', 'utils', 'mobile hooks', 'mobile utils'] as const;

export type Category = (typeof CATEGORIES)[number];

export type CatalogEntry = {
  name: string;
  category: Category;
  description: string;
};

type RenderSkillOptions = {
  template: string;
  entries: CatalogEntry[];
};

const CATALOG_PLACEHOLDER = '<!-- CATALOG -->';

/**
 * Catalog heading for an export, from where it lives: `./mobile/hooks/x/index.ts` → `mobile hooks`.
 * "mobile" is a label for what the entry assumes (a mobile browser), not an import path — everything
 * is imported from the package root.
 */
export function getCategory(sourcePath: string): Category {
  const segments = sourcePath.replace(/^\.\//, '').split('/');
  const category = segments[0] === 'mobile' ? `mobile ${segments[1]}` : segments[0];
  const known = CATEGORIES.find(candidate => candidate === category);

  if (known === undefined) {
    throw new Error(`Cannot derive a catalog category from ${sourcePath}`);
  }

  return known;
}

/**
 * First sentence of a documentation page's opening paragraph, which `docs:gen` writes from the
 * JSDoc `@description`. A period inside backticks (`options.leading`) does not end the sentence.
 */
export function extractDescription(markdown: string, name: string): string {
  const body = markdown.replace(/^# .*\n/, '').trimStart();
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
 * Fills the template's `<!-- CATALOG -->` with one table per category. Categories keep the
 * order of `CATEGORIES`; rows keep the order they are given (sorted by name upstream).
 */
export function renderSkill({ template, entries }: RenderSkillOptions): string {
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

  return template.replace(CATALOG_PLACEHOLDER, sections.join('\n').trimEnd());
}

function escapeTableCell(text: string): string {
  return text.replaceAll('|', '\\|');
}
