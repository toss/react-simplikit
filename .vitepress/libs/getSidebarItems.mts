import glob from 'fast-glob';
import path from 'node:path';
import { DefaultTheme } from 'vitepress';

import { generatedLocalesDirectory, localeDirectories } from '../locales.mts';
import { projectRoot } from '../shared.mts';

/**
 * Get sidebar items from a package's source directory
 * @param packageRoot - Root directory of the package (e.g., packages/core/src)
 * @param category - Category like 'hooks', 'components', 'utils'
 * @param prefix - URL prefix like '/core' or '/mobile'
 * @param locale - Optional locale like 'ko'
 */
export function getSidebarItems(
  packageRoot: string,
  category: string,
  prefix: string,
  locale?: string
): DefaultTheme.SidebarItem[] {
  // Find all .md files in the category directory
  const patterns =
    locale != null
      ? getLocalizedPatterns(packageRoot, category, locale)
      : [path.join(packageRoot, category, '*', '*.md')];

  const files = glob.sync(patterns, {
    ignore: locale == null ? localeDirectories.map(directory => `**/${directory}/**/*.md`) : [],
  });

  const items = files
    .filter(file => {
      // Only include files that match the folder name (e.g., useBooleanState/useBooleanState.md)
      const dirname = path.basename(path.dirname(locale ? path.dirname(file) : file));
      const filename = path.basename(file, '.md');
      return dirname === filename;
    })
    .map(file => {
      const filename = path.basename(file, '.md');
      const link = locale ? `/${locale}${prefix}/${category}/${filename}` : `${prefix}/${category}/${filename}`;

      return { text: filename, link };
    })
    .sort((a, b) => a.text.localeCompare(b.text));

  return items;
}

/**
 * A locale's pages come from two trees: tracked translations, and the English fallbacks
 * `docs:prepare` materializes under `generated-locales/` for pages that have none yet. Reading
 * only the first tree would leave a fallback page routed but unlinked from the sidebar.
 */
function getLocalizedPatterns(packageRoot: string, category: string, locale: string): string[] {
  const patterns = [path.join(packageRoot, category, '*', locale, '*.md')];
  const relativePackageRoot = path.relative(projectRoot, packageRoot);
  const isInsideProject = !relativePackageRoot.startsWith('..') && !path.isAbsolute(relativePackageRoot);

  if (isInsideProject) {
    patterns.push(
      path.join(projectRoot, generatedLocalesDirectory, relativePackageRoot, category, '*', locale, '*.md')
    );
  }

  return patterns;
}

/**
 * Sort sidebar items alphabetically by text
 */
export function sortByText(items: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem[] {
  return items.sort((a, b) => (a.text ?? '').localeCompare(b.text ?? ''));
}
