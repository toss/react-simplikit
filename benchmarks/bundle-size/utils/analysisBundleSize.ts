import esbuild from 'esbuild';
import path from 'path';

export async function getBundleSize(pkg: 'react-use' | 'reactive-kit' | 'usehooks-ts' | '@react-hookz/web') {
  const allExports = await import(pkg);

  const script = `import * as allExports from "${pkg}"; console.log(allExports)`;

  const bundled = await esbuild.build({
    stdin: {
      contents: script,
      resolveDir: import.meta.dirname,
      sourcefile: path.resolve(import.meta.dirname, 'test.js'),
      loader: 'js',
    },
    write: false,
    minify: true,
    bundle: true,
  });

  const exportsLength = Object.keys(allExports).length;
  const totalSize = Buffer.from(bundled.outputFiles![0].contents).byteLength;

  return {
    exportsLength,
    size: totalSize,
    avg: totalSize / exportsLength,
  };
}
