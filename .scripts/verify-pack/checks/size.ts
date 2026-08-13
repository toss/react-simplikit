import { build } from 'esbuild';

export async function measureImportCost(entry: string, consumerDir: string): Promise<number> {
  const result = await build({
    stdin: { contents: entry, resolveDir: consumerDir, loader: 'js' },
    bundle: true,
    minify: true,
    format: 'esm',
    write: false,
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    logLevel: 'silent',
  });
  const outputFile = result.outputFiles[0];
  if (outputFile === undefined) {
    throw new Error('esbuild produced no output file — the import cost was never measured');
  }
  return outputFile.contents.byteLength;
}

// A 0B result means esbuild tree-shook the entry away entirely (e.g. the export
// resolved to something with no live code), not that the export is free — that is
// a broken measurement, not a passing one, so it must fail rather than read as 0 < limit.
export function checkSizeLimit(bytes: number, limitBytes: number): string[] {
  if (bytes <= 0) {
    return [`import cost measured ${bytes}B — the entry was tree-shaken away instead of measured`];
  }
  return bytes < limitBytes ? [] : [`import cost ${bytes}B >= limit ${limitBytes}B — tree-shaking regression`];
}
