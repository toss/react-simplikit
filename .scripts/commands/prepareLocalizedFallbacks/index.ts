import glob from 'fast-glob';
import * as fs from 'node:fs/promises';
import path from 'node:path';

import {
  generatedLocalesDirectory,
  localeDirectories,
  localizableSourcePatterns,
} from '../../../.vitepress/locales.mts';
import { getRootPath } from '../../utils/getRootPath.ts';

type PrepareLocalizedFallbacksOptions = {
  localeDirectories?: string[];
  root?: string;
};

export async function prepareLocalizedFallbacks({
  localeDirectories: targetLocaleDirectories = localeDirectories,
  root = getRootPath(),
}: PrepareLocalizedFallbacksOptions = {}) {
  const generatedDirectory = path.join(root, generatedLocalesDirectory);

  await fs.rm(generatedDirectory, { force: true, recursive: true });

  const englishDocuments = glob
    .sync(localizableSourcePatterns, {
      cwd: root,
      ignore: [
        `${generatedLocalesDirectory}/**`,
        ...targetLocaleDirectories.flatMap(locale => [`docs/${locale}/**`, `packages/**/${locale}/**`]),
      ],
    })
    .filter(participatesInRewrites);

  await Promise.all(
    targetLocaleDirectories.flatMap(locale =>
      englishDocuments.map(async sourcePath => {
        const localizedSourcePath = getLocalizedSourcePath(sourcePath, locale);
        const existingLocalizedSourcePath = path.join(root, localizedSourcePath);

        try {
          await fs.access(existingLocalizedSourcePath);
          return;
        } catch {
          const source = await fs.readFile(path.join(root, sourcePath), 'utf8');
          const generatedSourcePath = path.join(generatedDirectory, localizedSourcePath);

          await fs.mkdir(path.dirname(generatedSourcePath), { recursive: true });
          await fs.writeFile(generatedSourcePath, addFallbackFrontmatter(source));
        }
      })
    )
  );
}

// Package routes bind the same parameter twice (`:hook/:hook.md`), so a Markdown file whose
// name differs from its folder has no localized destination even though the glob matches it.
function participatesInRewrites(sourcePath: string) {
  if (!sourcePath.startsWith('packages/')) {
    return true;
  }

  return path.basename(path.dirname(sourcePath)) === path.basename(sourcePath, '.md');
}

function getLocalizedSourcePath(sourcePath: string, locale: string) {
  if (sourcePath.startsWith('docs/')) {
    return path.join('docs', locale, sourcePath.slice('docs/'.length));
  }

  return path.join(path.dirname(sourcePath), locale, path.basename(sourcePath));
}

function addFallbackFrontmatter(source: string) {
  const frontmatterClosingIndex = source.startsWith('---\n') ? source.indexOf('\n---\n', 4) : -1;
  const fallbackFrontmatter = 'untranslated: true\nsourceLocale: en\n';

  if (frontmatterClosingIndex < 0) {
    return `---\n${fallbackFrontmatter}---\n${source}`;
  }

  return `${source.slice(0, frontmatterClosingIndex + 1)}${fallbackFrontmatter}${source.slice(frontmatterClosingIndex + 1)}`;
}
