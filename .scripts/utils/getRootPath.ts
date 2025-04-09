import path from 'path';
import { fileURLToPath } from 'url';

export function getRootPath() {
  return path.join(fileURLToPath(new URL('.', import.meta.url)), '../..');
}
