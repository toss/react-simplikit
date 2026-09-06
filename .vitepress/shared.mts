import fs from 'node:fs';
import path from 'node:path';

export const SITE_ORIGIN = 'https://react-simplikit.slash.page';

export const projectRoot = path.resolve(import.meta.dirname, '..');
export const packageSourceRoot = path.join(projectRoot, 'packages/react-simplikit/src');
export const docsRoot = path.join(projectRoot, 'docs');

export function listDirectories(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}
