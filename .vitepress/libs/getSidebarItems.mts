import glob from 'fast-glob';
import path from 'node:path';
import { DefaultTheme } from 'vitepress';

export function getSidebarItems(docsRoot: string, ...parts: string[]): DefaultTheme.SidebarItem[] {
  const files = glob.sync(path.join(docsRoot, ...parts, '*.md'));
  const locale = /^[a-z]{2}$/.test(parts[parts.length - 1]) ? parts.pop()! : '';

  return files.map(file => {
    const relativePath = path.relative(docsRoot, file);
    const filename = path.basename(file, '.md');
    const dirname = path.dirname(relativePath);

    const link = locale === '' ? path.join('/', dirname) : path.join('/', locale, dirname.replace(`/${locale}`, ''));

    return { text: filename, link };
  });
}
