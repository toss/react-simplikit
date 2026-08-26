import path from 'path';

export const projectRoot = path.resolve(import.meta.dirname, '..');
export const corePackageRoot = path.join(projectRoot, 'packages/react-simplikit/src');
export const mobilePackageRoot = path.join(projectRoot, 'packages/mobile/src');
export const docsRoot = path.join(projectRoot, 'docs');
