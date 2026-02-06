import glob from 'fast-glob';
import path from 'node:path';
import { DefaultTheme } from 'vitepress';

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
  const pattern = locale
    ? path.join(packageRoot, category, '*', 'ko', '*.md')
    : path.join(packageRoot, category, '*', '*.md');

  const files = glob.sync(pattern, {
    ignore: ['**/ko/**/*.md'].filter(() => !locale), // Ignore ko folder when not looking for locale
  });

  const items = files
    .filter(file => {
      // Only include files that match the folder name (e.g., useBooleanState/useBooleanState.md)
      const dirname = path.basename(path.dirname(locale ? path.dirname(file) : file));
      const filename = path.basename(file, '.md');
      return dirname === filename || dirname === 'keyboardHeight'; // Special case for keyboardHeight
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
 * Sort sidebar items alphabetically by text
 */
export function sortByText(items: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem[] {
  return items.sort((a, b) => (a.text ?? '').localeCompare(b.text ?? ''));
}
