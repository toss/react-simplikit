import { parse, Spec as OriginSpec } from 'comment-parser';
import glob from 'fast-glob';
import * as fs from 'fs/promises';
import { Listr } from 'listr2';
import path from 'path';
import * as prettier from 'prettier';

import { getRootPath } from '../../utils/getRootPath.ts';
import { generateSkill } from '../generateSkill/index.ts';

type Spec = Pick<OriginSpec, 'type' | 'name' | 'description' | 'optional' | 'default'>;

const prettierConfig: prettier.Options = {
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  arrowParens: 'avoid',
};

/**
 * Renders the English documentation page for one export without touching the filesystem.
 *
 * `verifyDocs.ts` compares a committed page against this, so the formatting applied here has to be
 * the same formatting the page is written with — hence prettier runs inside, not at the call site.
 */
export async function renderEnglishDoc(name: string, sourceFilePath: string): Promise<string> {
  const documentPath = `${path.dirname(sourceFilePath)}/${name}.md`;
  const docSource = await jsdocToMd(name, parseJSDoc(await fs.readFile(sourceFilePath, 'utf-8')));

  return prettier.format(docSource, {
    ...(await prettier.resolveConfig(documentPath)),
    filepath: documentPath,
  });
}

export async function generateDocs(names: string[]) {
  const tasks = new Listr([], { concurrent: 10 });

  names
    .map(name => [name, glob.sync(`**/${name}.ts*`, { cwd: getRootPath() })[0]])
    .forEach(([name, sourceFilePath]) => {
      const subCtx: { document?: string } = {};
      tasks.add([
        {
          title: `Generate documents: ${sourceFilePath}`,
          task: async (_, task) =>
            task.newListr<{ document?: string }>(
              [
                {
                  title: `Convert JSDoc to markdown`,
                  task: async ctx => {
                    ctx.document = await renderEnglishDoc(name, sourceFilePath);
                  },
                },
                {
                  title: `Write English document`,
                  task: async ctx => {
                    const { document } = ctx;

                    if (document != null) {
                      // Written already formatted: `.prettierignore`'s `src/hooks/**/*.md` is anchored to the
                      // repo root and never reaches packages/, so prettier (yarn fix, autofix.ci) reformats
                      // these pages later. `generateSkill()` below copies them, and an unformatted copy
                      // would drift from the page the moment prettier runs.
                      await fs.writeFile(`${path.dirname(sourceFilePath)}/${name}.md`, document);
                    }
                  },
                },
              ],
              { concurrent: false, ctx: subCtx, exitOnError: false }
            ),
        },
      ]);
    });

  await tasks.run();

  // The skill catalog is rendered from the English pages written above, so it is refreshed in the same run.
  await generateSkill();
}

function parseJSDoc(source: string) {
  const parsedComments = parse(source);

  const targetComment = parsedComments[parsedComments.length - 1];

  const template = targetComment.tags.find(tag => tag.tag === 'template');

  // The default compact spacing joins every line of `@description` into one, which collapses its
  // bullet lists. Only that tag is re-read with preserved spacing; the rest read better compacted.
  const preservedComment = parse(source, { spacing: 'preserve' }).at(-1);
  const description = reflowDescription(
    preservedComment?.tags.find(tag => tag.tag === 'description')?.description ?? preservedComment?.description ?? ''
  );

  const params = targetComment.tags.filter(tag => tag.tag === 'param');

  const returns =
    parsedComments
      .find(comment => comment.tags.find(tag => tag.tag === 'returns') != null)
      ?.tags.filter(tag => tag.tag === 'returns') ?? [];

  const nestedValueOfReturns = returns.length === 0 ? undefined : getNestedValuesFromReturn(returns[0]);

  const example = targetComment.tags
    .filter(tag => tag.tag === 'example')
    .map(tag =>
      tag.source
        .map(line => line.source.replace(/\s\*\s{0,1}/, ''))
        // fence lines are dropped because the doc template wraps the example in its
        // own ```tsx fence; nested fences would render as literal backticks
        .filter(line => {
          const trimmed = line.trim();
          return trimmed !== '@example' && trimmed !== '/' && !/^\s*```/.test(line);
        })
        .join('\n')
        .trim()
    )
    .filter(text => text.length > 0)
    .join('\n\n');

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
    .map(description => (description.trimEnd().endsWith('.') ? description : `${description}.`));

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
      .map(param => {
        const { rest, type } = splitRestMarker(param.type);
        return `${rest}${param.name}: ${type}${param.default == null ? '' : ` = ${param.default}`}`;
      });

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

const LIST_ITEM = /^[-*]\s/;

/**
 * Undoes the source's line wrapping while keeping the structure a reader relies on.
 *
 * A JSDoc block wraps prose to stay readable in the editor, and those breaks carry no meaning —
 * but blank lines and list items do. Joining everything (the parser's compact mode) loses the
 * lists; keeping everything bakes the editor's wrapping into the page.
 */
function reflowDescription(description: string) {
  return description
    .split('\n')
    .map(line => line.trim())
    .reduce<string[]>((lines, line) => {
      const previous = lines.at(-1);
      const continuesParagraph =
        previous != null && previous !== '' && line !== '' && !LIST_ITEM.test(line) && !LIST_ITEM.test(previous);

      if (continuesParagraph) {
        lines[lines.length - 1] = `${previous} ${line}`;
        return lines;
      }

      lines.push(line);
      return lines;
    }, [])
    .join('\n')
    .trim();
}

/** JSDoc marks a rest parameter on the type (`{...T}`), TypeScript on the name (`...name: T`). */
function splitRestMarker(type: string) {
  return type.startsWith('...') ? { rest: '...', type: type.slice('...'.length) } : { rest: '', type };
}

function getParamUl(param: Spec, nestedParams?: Spec[]) {
  return `
  <Interface
    ${Object.entries({
      required: !param.optional,
      name: param.name,
      type: splitRestMarker(param.type).type,
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
          return `description="${replaceDescription(value as string, '"')}"`;
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
                           ? `${key}: '${key === 'description' ? replaceDescription(value as string, "'") : value!.replace(/'/g, "\\'")}'`
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

/**
 * @param quote - How the caller wraps the result. `'` only needs escaping inside a single-quoted
 * JavaScript string (the `:nested` array); doing it in a double-quoted attribute leaks a backslash
 * into the rendered page.
 */
function replaceDescription(value: string, quote: '"' | "'") {
  const replaced = value
    .replace(/^\s*-\s*/, '')
    .replace(/--/g, '\n-')
    .replace(/`([^`]*)`/g, '<code>$1</code>')
    .replace(/\*\*([^**]*)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]*)\*/g, '<em>$1</em>')
    .replace(/_([^*]*)_/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');

  return quote === "'" ? replaced.replace(/'/g, `\\'`) : replaced.replace(/"/g, '&quot;');
}
