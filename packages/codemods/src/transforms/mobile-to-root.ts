import type { API, FileInfo } from 'jscodeshift';
import { basename, extname } from 'node:path';

import { transformPackageJson } from './utils/mobileToRoot/transformPackageJson.ts';
import { transformSource } from './utils/mobileToRoot/transformSource.ts';

export default function transform(file: FileInfo, api: API) {
  if (basename(file.path) === 'package.json') {
    const result = transformPackageJson(file.source);

    result.manual.forEach(reason => api.report(reason));

    return result.text;
  }

  if (extname(file.path) === '.json') {
    return undefined;
  }

  const result = transformSource(file.source, file.path);

  result.notes.forEach(note => api.report(`line ${note.line}: ${note.reason}`));

  return result.code;
}
