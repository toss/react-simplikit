import { parse, Spec as OriginSpec } from 'comment-parser';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as prettier from 'prettier';

type Spec = Pick<OriginSpec, 'type' | 'name' | 'description' | 'optional' | 'default'>;

(async () => {
  const arg = process.argv[2];

  const filePath = arg.includes('/') ? arg : await searchFile(arg);

  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const name = /\/([^/.]+)\.ts/.exec(filePath)?.[1]!;

  const docSource = await jsdocToMd(name, parseJSDoc(await fs.readFile(filePath, 'utf-8')));

  await fs.writeFile(filePath.replace(/\..+/, '.md'), docSource);
})();

async function searchFile(filename: string, dir: string = './src'): Promise<string> {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      const found = await searchFile(filename, fullPath);
      if (found !== 'x') {
        return found;
      }
    } else if (file.name.startsWith(`${filename}.ts`)) {
      return fullPath;
    }
  }

  return 'x';
}

function parseJSDoc(source: string) {
  const parsedComments = parse(source);

  const targetComment = parsedComments[parsedComments.length - 1];

  const template = targetComment.tags.find(tag => tag.tag === 'template');

  const description = targetComment.tags.find(tag => tag.tag === 'description')?.description ?? '';

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

  const nestedDerscriptions = returnTag.description.split('-').splice(1, 999).join('-').split('.');

  return nestedDerscriptions
    .filter(origin => origin.trim().length > 0)
    .map(origin => {
      const [, name, type, description] = /([^-\s]*)\s*`([^`]+)`\s+-\s+(.*)/.exec(origin) ?? [];
      return { name, type, description, optional: true };
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
    template == null ? '' : `<${template.name}${template.type.length === 0 ? '' : ` extends ${template.type}>`}`;
  const getParamsCode = () =>
    params
      .filter(param => !param.name.includes('.'))
      .map(param => `${param.name}: ${param.type}${param.default == null ? '' : ` = ${param.default}`}`);

  return `# ${name}

${description}

## Interface
\`\`\`ts
${await prettier.format(`function ${name}${getTemplateCode()}(${getParamsCode()}): ${returns == null ? 'void' : returns.type};`, { parser: 'typescript' })}
\`\`\`

### Parameters

${await prettier.format(paramsProps.map(props => getParamUl(...props)).join(''), { parser: 'html' })}
### Return Value
${
  returns == null
    ? '\nThis hook does not return anything.'
    : `
${await prettier.format(getParamUl(returns, nestedValueOfReturns), { parser: 'html' })}`
}

## Example

\`\`\`tsx
${example}
\`\`\`
  `;
}

function getParamUl(param: Spec, nestedParams?: Spec[]) {
  return `<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    ${getParamLi(param)}
    ${
      nestedParams == null
        ? ''
        : `\
    ${
      nestedParams.length > 0
        ? `<ul class="post-parameters-ul">
    ${nestedParams
      .map(
        nestedParam => `\
      <li class="post-parameters-li">
        ${getParamLi(nestedParam)}
      </li>\
        `
      )
      .join('\n')}
    </ul>`
        : ''
    }  \
    `
    }
  </li>
</ul>
  `;
}

function getParamLi(param: Spec) {
  return `
    <span class="post-parameters--name">${param.name}</span>${
      param.optional ? '' : '<span class="post-parameters--required">required</span> · '
    }<span class="post-parameters--type">${escapeHTMLEntities(param.type)}</span>${param.default == null ? '' : ` · <span class="post-parameters--default">${escapeHTMLEntities(param.default)}</span>`}
    <br />
    <p class="post-parameters--description">${param.description
      .replace(/^\s*-\s*/, '')
      .replace(/`([^`]*)`/g, '<code>$1</code>')
      .replace(/\*\*([^**]*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]*)\*/g, '<em>$1</em>')
      .replace(/_([^*]*)_/g, '<em>$1</em>')}</p>\
  `;
}

function escapeHTMLEntities(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
