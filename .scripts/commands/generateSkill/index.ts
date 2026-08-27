import * as fs from 'node:fs/promises';
import path from 'node:path';

import { collectPublicExportEntries } from '../../utils/collectPublicExports.ts';
import { getRootPath } from '../../utils/getRootPath.ts';

import { CatalogEntry, extractDescription, getCategory, renderSkill } from './catalog.ts';

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
 * The output depends only on `index.ts` and the pages, so re-running on unchanged sources changes nothing.
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

  const entries: CatalogEntry[] = await Promise.all(
    (await collectPublicExportEntries(indexFilePath)).map(async ({ name, sourcePath }) => {
      const documentPath = path.join(packageSourceDirectory, path.dirname(sourcePath), `${name}.md`);
      const markdown = await readDocumentationPage(documentPath, name);

      await fs.writeFile(path.join(referencesDirectory, `${name}.md`), markdown);

      return { name, category: getCategory(sourcePath), description: extractDescription(markdown, name) };
    })
  );

  const template = await fs.readFile(TEMPLATE_FILE, 'utf8');

  await fs.writeFile(path.join(outputDirectory, 'SKILL.md'), renderSkill({ template, entries }));
}

async function readDocumentationPage(documentPath: string, name: string): Promise<string> {
  try {
    return await fs.readFile(documentPath, 'utf8');
  } catch {
    throw new Error(`${name} has no documentation page at ${documentPath} (run \`yarn docs:gen ${name}\`)`);
  }
}
