import fs from 'fs/promises';
import { Listr } from 'listr2';
import path from 'path';
import prettier from 'prettier';

import { getRootPath } from '../../utils/getRootPath.ts';

const prettierConfig: prettier.Options = {
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  arrowParens: 'avoid',
  parser: 'typescript',
};

export async function scaffold(name: string, type: 'hook' | 'component' | 'util') {
  const directory = path.join(getRootPath(), `./packages/core/src/${type}s/${name}`);
  const ext = type === 'component' ? 'tsx' : 'ts';

  const tasks = new Listr(
    [
      {
        title: 'Create directory',
        task: async () => {
          await fs.mkdir(directory, { recursive: true });
        },
      },
      {
        title: 'Create Source File',
        task: async () => {
          const sourceFile = `${directory}/${name}.${ext}`;
          await fs.writeFile(
            sourceFile,
            await prettier.format(
              `
                /**
                  * @description
                  * <description-here>
                  * 
                  * @param {<param-type>} <param-name> - <param-description>
                  * @param {<param-type>} [<param-name>] - <optional-param-description>
                  * 
                  * @returns {<return-type>} <return-description>
                  * - <member-description> \`<member-name>\` - <member-description>
                  * 
                  * @example
                  * <example-code>
                  */
                export function ${name}() {
                  // TODO: Implement ${name}
                }
              `,
              prettierConfig
            )
          );
        },
      },
      {
        title: 'Create Test File',
        task: async () => {
          const testFile = `${directory}/${name}.spec.${ext}`;

          const getRenderContent = () => {
            if (type === 'hook') {
              return `${name}()`;
            }
            if (type === 'component') {
              return `<${name} />`;
            }
            return `${name}()`;
          };

          await fs.writeFile(
            testFile,
            await prettier.format(
              `
                import { describe, expect, it } from 'vitest';

                ${type === 'util' ? '' : `import { render${type === 'hook' ? 'Hook' : ''}SSR } from '../../_internal/test-utils/render${type === 'hook' ? 'Hook' : ''}SSR.tsx';`}

                import { ${name} } from './${name}.${ext}';

                describe('${name}', () => {
                  ${
                    type !== 'util'
                      ? `it('is safe on server side rendering', async () => {
                    const result = render${type === 'hook' ? 'Hook' : ''}SSR.serverOnly(() => ${getRenderContent()});

                    expect(true).toBe(true);
                  });
                  
                  `
                      : ''
                  }
                  it('should work', ${type === 'component' ? 'async ' : ''}() => {
                    const result = ${type === 'util' ? getRenderContent() : `render${type === 'hook' ? 'Hook' : ''}SSR.serverOnly(() => ${getRenderContent()})`};

                    expect(true).toBe(true);
                  });
                });
              `,
              prettierConfig
            )
          );
        },
      },
      {
        title: 'Create Index File',
        task: async () => {
          const indexFile = `${directory}/index.ts`;
          await fs.writeFile(
            indexFile,
            await prettier.format(`export { ${name} } from './${name}.${ext}';`, prettierConfig)
          );
        },
      },
    ],
    { concurrent: true }
  );

  await tasks.run();
}
