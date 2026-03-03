import { parse, Spec as OriginSpec } from 'comment-parser';
import glob from 'fast-glob';
import * as fs from 'fs/promises';
import { Listr } from 'listr2';
import path from 'path';
import * as prettier from 'prettier';

import { getRootPath } from '../../utils/getRootPath.ts';

import { translate } from './translate.ts';

type Spec = Pick<OriginSpec, 'type' | 'name' | 'description' | 'optional' | 'default'>;

const prettierConfig: prettier.Options = {
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  arrowParens: 'avoid',
};

export async function generateDocs(names: string[]) {
  const tasks = new Listr([], { concurrent: 10 });

  names
    .map(name => [name, glob.sync(`**/${name}.ts*`, { cwd: getRootPath() })[0]])
    .forEach(([name, sourceFilePath]) => {
      const subCtx: { docSource?: string; translatedDoc?: string } = {};
      tasks.add([
        {
          title: `Generate documents: ${sourceFilePath}`,
          task: async (_, task) =>
            task.newListr<{ docSource?: string; translatedDoc?: string }>(
              [
                {
                  title: `Convert JSDoc to markdown`,
                  task: async ctx => {
                    const docSource = await jsdocToMd(name, parseJSDoc(await fs.readFile(sourceFilePath, 'utf-8')));

                    ctx.docSource = docSource;
                  },
                },
                {
                  title: `Write English document`,
                  task: async ctx => {
                    const { docSource } = ctx;
                    const dirname = path.dirname(sourceFilePath);

                    if (docSource != null) {
                      await fs.writeFile(`${dirname}/${name}.md`, docSource);
                    }
                  },
                },
                {
                  title: `Translate markdown to Korean`,
                  task: async ctx => {
                    const { docSource } = ctx;
                    const dirname = path.dirname(sourceFilePath);

                    let isFileExists = false;
                    try {
                      await fs.access(`${dirname}/ko/${name}.md`);
                      isFileExists = true;
                    } catch {
                      isFileExists = false;
                    }

                    // Skip if Korean file already exists and English file hasn't changed
                    if (isFileExists) {
                      try {
                        const existingEnglish = await fs.readFile(`${dirname}/${name}.md`, 'utf-8');
                        if (existingEnglish === docSource) {
                          return;
                        }
                      } catch {
                        // Continue with translation if we can't read existing file
                      }
                    }

                    if (docSource == null) {
                      throw new Error('docSource is not found');
                    }

                    try {
                      const translatedDoc = await translate(docSource);
                      ctx.translatedDoc = translatedDoc;
                    } catch (error) {
                      // Log the error but don't fail the task - English doc is already saved
                      console.warn(`Translation failed for ${name}: ${error instanceof Error ? error.message : error}`);
                      ctx.translatedDoc = null;
                    }
                  },
                },
                {
                  title: `Write Korean document`,
                  skip: ctx => ctx.translatedDoc == null,
                  task: async ctx => {
                    const { translatedDoc } = ctx;
                    const dirname = path.dirname(sourceFilePath);

                    if (translatedDoc != null) {
                      await fs.mkdir(`${dirname}/ko`).catch(e => {
                        if (e.code === 'EEXIST') {
                          return;
                        }

                        throw e;
                      });
                      await fs.writeFile(`${dirname}/ko/${name}.md`, translatedDoc);
                    }
                  },
                },
              ],
              { concurrent: false, ctx: subCtx, exitOnError: false }
            ),
        },
      ]);
    });

  tasks.run();
}

function parseJSDoc(source: string) {
  const parsedComments = parse(source);

  const targetComment = parsedComments[parsedComments.length - 1];

  const template = targetComment.tags.find(tag => tag.tag === 'template');

  const description =
    targetComment.tags.find(tag => tag.tag === 'description')?.description ?? targetComment.description ?? '';

  const params = targetComment.tags.filter(tag => tag.tag === 'param');

  const returns =
    parsedComments
      .find(comment => comment.tags.find(tag => tag.tag === 'returns') != null)
      ?.tags.filter(tag => tag.tag === 'returns') ?? [];

  const nestedValueOfReturns = returns.length === 0 ? undefined : getNestedValuesFromReturn(returns[0]);

  const exampleSource = targetComment.tags.find(tag => tag.tag === 'example')?.source;

  const example =
    exampleSource == null
      ? ''
      : (exampleSource
          .splice(1, exampleSource.length - 2)
          .map(line => line.source.replace(/\s\*\s{0,1}/, ''))
          .join('\n') ?? '');

  return {
    description,
    template,
    example,
    params,
    returns:
      returns.length === 0
        ? undefined
        : {
            ...returns[0],
            name: '',
            description:
              nestedValueOfReturns == null ? returns[0].description : returns[0].description.split('-')[0].trim(),
            optional: true,
          },
    nestedValueOfReturns,
  };
}

function getNestedValuesFromReturn(returnTag: Spec): Spec[] | undefined {
  if (!returnTag.description.includes('-')) {
    return;
  }

  const nestedDerscriptions = returnTag.description
    .split('-')
    .splice(1, 999)
    .join('-')
    .split(';')
    .filter(description => description.trim().length > 0)
    .map(description => `${description}.`);

  return nestedDerscriptions
    .filter(origin => origin.trim().length > 0)
    .map(origin => {
      const [, name, type, description] = /([^-\s]*)\s*`([^`]+)`\s+-\s+(.*)/.exec(origin) ?? [];
      return { name, type, description: description?.replaceAll(':', '\n  :'), optional: true };
    });
}

async function jsdocToMd(name: string, jsdoc: ReturnType<typeof parseJSDoc>) {
  const { template, description, example, params, returns, nestedValueOfReturns } = jsdoc;

  const paramsProps = params.reduce<Array<[Spec, Spec[]]>>(
    (acc, param) => {
      if (acc.length === 0) {
        return [[param, []]];
      }

      if (param.name.startsWith(acc[acc.length - 1][0].name)) {
        acc[acc.length - 1][1].push(param);
        return acc;
      }

      return [...acc, [param, []]];
    },
    [] as Array<[Spec, Spec[]]>
  );

  const getTemplateCode = () =>
    template == null ? '' : `<${template.name}${template.type.length === 0 ? '>' : ` extends ${template.type}>`}`;
  const getParamsCode = () =>
    params
      .filter(param => !param.name.includes('.'))
      .map(param => `${param.name}: ${param.type}${param.default == null ? '' : ` = ${param.default}`}`);

  return `# ${name}

${description}

## Interface

\`\`\`ts
${await prettier.format(`function ${name}${getTemplateCode()}(${getParamsCode()}): ${returns == null ? 'void' : returns.type};`, { ...prettierConfig, parser: 'typescript' })}\`\`\`

### Parameters

${await prettier.format(paramsProps.map(props => getParamUl(...props)).join(''), { ...prettierConfig, parser: 'vue' })}
### Return Value
${
  returns == null
    ? '\nThis hook does not return anything.'
    : `
${await prettier.format(getParamUl(returns, nestedValueOfReturns), { ...prettierConfig, parser: 'vue' })}`
}
## Example

\`\`\`tsx
${example}
\`\`\`
`;
}

function getParamUl(param: Spec, nestedParams?: Spec[]) {
  return `
  <Interface
    ${Object.entries({
      required: !param.optional,
      name: param.name,
      type: param.type,
      description: param.description,
      nested: nestedParams,
    })
      .filter(([key, value]) => {
        if (key === 'required') {
          return value as boolean;
        }

        if (key === 'nested') {
          return (value as Spec[])?.length > 0;
        }

        return value != null;
      })
      .map(([key, value]) => {
        if (key === 'required') {
          return `required`;
        }

        if (key === 'description') {
          return `description="${replaceDescription(value as string)}"`;
        }

        if (key === 'nested') {
          return `:nested="[
            ${nestedParams
              ?.map(
                nestedParam => `{
                     ${Object.entries({
                       name: nestedParam.name,
                       type: nestedParam.type,
                       required: !nestedParam.optional,
                       defaultValue: nestedParam.default,
                       description: nestedParam.description,
                     })
                       // eslint-disable-next-line @typescript-eslint/no-unused-vars
                       .filter(([_, value]) => value != null)
                       .map(([key, value]) =>
                         typeof value === 'string'
                           ? `${key}: '${key === 'description' ? replaceDescription(value as string) : value!.replace(/'/g, "\\'")}'`
                           : `${key}: ${value}`
                       )
                       .join(',\n')}
            }`
              )
              .join(',\n')}
          ]"`;
        }

        return `${key}="${(value as string).replace(/"/g, '\\"')}"`;
      })
      .join('\n')}
  />
  `;
}

function replaceDescription(value: string) {
  console.log(value);
  return value
    .replace(/^\s*-\s*/, '')
    .replace(/--/g, '\n-')
    .replace(/`([^`]*)`/g, '<code>$1</code>')
    .replace(/\*\*([^**]*)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]*)\*/g, '<em>$1</em>')
    .replace(/_([^*]*)_/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
    .replace(/'/g, `\\'`)
    .replace(/"/g, '&quot;');
}
