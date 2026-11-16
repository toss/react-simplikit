import * as fs from 'node:fs/promises';
import path from 'node:path';

import { collectPublicExportEntries } from '../../utils/collectPublicExports.ts';
import { getRootPath } from '../../utils/getRootPath.ts';
import { readDeprecation, readNoDocs } from '../../utils/jsdoc.ts';

import { CatalogEntry, DeprecatedEntry, extractDescription, getCategory, renderSkill } from './catalog.ts';

export const SKILL_DIRECTORY = 'packages/plugin/skills/react-simplikit';
export const PACKAGE_INDEX_FILE = 'packages/react-simplikit/src/index.ts';

const TEMPLATE_FILE = new URL('./template.md', import.meta.url);

type GenerateSkillOptions = {
  root?: string;
  outputDirectory?: string;
};

/**
 * Writes the consumer-facing agent skill: `SKILL.md` (template + a catalog of every public export)
 * and `references/<name>.md` (a verbatim copy of each export's English documentation page).
 * The output depends only on `index.ts`, the pages and each export's `@deprecated` and `@no-docs`
 * tags, so re-running on unchanged sources changes nothing.
 *
 * A `@deprecated` export is listed in the Deprecated table instead of its category, linked to its
 * reference page unless it is also `@no-docs`. A `@no-docs` export that is not deprecated has no
 * page and is left out entirely.
 */
export async function generateSkill({
  root = getRootPath(),
  outputDirectory = path.join(root, SKILL_DIRECTORY),
}: GenerateSkillOptions = {}): Promise<void> {
  const indexFilePath = path.join(root, PACKAGE_INDEX_FILE);
  const packageSourceDirectory = path.dirname(indexFilePath);
  const referencesDirectory = path.join(outputDirectory, 'references');

  // Recreated from scratch so an export removed from index.ts does not leave a stale page behind.
  await fs.rm(referencesDirectory, { force: true, recursive: true });
  await fs.mkdir(referencesDirectory, { recursive: true });

  const publicExports: Array<{ entry: CatalogEntry } | { deprecatedEntry: DeprecatedEntry } | null> = await Promise.all(
    (await collectPublicExportEntries(indexFilePath)).map(async ({ name, sourcePath }) => {
      const exportDirectory = path.join(packageSourceDirectory, path.dirname(sourcePath));
      const source = await readExportSource(exportDirectory, name);
      const notice = readDeprecation(source);
      const hasPage = !readNoDocs(source);

      if (!hasPage) {
        return notice == null ? null : { deprecatedEntry: { name, notice, hasPage } };
      }

      const markdown = await readDocumentationPage(path.join(exportDirectory, `${name}.md`), name);

      await fs.writeFile(path.join(referencesDirectory, `${name}.md`), markdown);

      if (notice != null) {
        return { deprecatedEntry: { name, notice, hasPage } };
      }

      return { entry: { name, category: getCategory(sourcePath), description: extractDescription(markdown, name) } };
    })
  );
  const entries = publicExports.flatMap(item => (item != null && 'entry' in item ? [item.entry] : []));
  const deprecatedEntries = publicExports.flatMap(item =>
    item != null && 'deprecatedEntry' in item ? [item.deprecatedEntry] : []
  );

  const template = await fs.readFile(TEMPLATE_FILE, 'utf8');

  await fs.writeFile(path.join(outputDirectory, 'SKILL.md'), renderSkill({ template, entries, deprecatedEntries }));
}

/** The file an export is declared in sits next to the `index.ts` that re-exports it, named after the export. */
async function readExportSource(exportDirectory: string, name: string): Promise<string> {
  for (const extension of ['ts', 'tsx']) {
    try {
      return await fs.readFile(path.join(exportDirectory, `${name}.${extension}`), 'utf8');
    } catch {
      continue;
    }
  }

  throw new Error(`${name} has no source file at ${path.join(exportDirectory, name)}.ts(x)`);
}

async function readDocumentationPage(documentPath: string, name: string): Promise<string> {
  try {
    return await fs.readFile(documentPath, 'utf8');
  } catch {
    throw new Error(`${name} has no documentation page at ${documentPath} (run \`yarn docs:gen ${name}\`)`);
  }
}
