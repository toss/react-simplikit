import path from 'path';

export const projectRoot = path.resolve(import.meta.dirname, '..');
export const packageSourceRoot = path.join(projectRoot, 'packages/react-simplikit/src');
export const mobileSourceRoot = path.join(packageSourceRoot, 'mobile');
export const docsRoot = path.join(projectRoot, 'docs');
