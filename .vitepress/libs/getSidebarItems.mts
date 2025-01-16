import glob from 'fast-glob';
import path from 'node:path';
import { DefaultTheme } from 'vitepress';

export function getSidebarItems(docsRoot: string, ...parts: string[]): DefaultTheme.SidebarItem[] {
  const files = glob.sync(path.join(docsRoot, ...parts));

  return files.map(file => {
    const relativePath = path.relative(docsRoot, file);
    const filename = path.basename(file, '.md');
    const dirname = path.dirname(relativePath);

    const [implementation, locale = ''] = filename.split('.');

    return {
      text: implementation,
      link: path.join(locale, dirname),
    };
  });
}
