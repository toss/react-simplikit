import { parse, Spec as OriginSpec, tokenizers } from 'comment-parser';
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

// These tags carry no name, but the stock name tokenizer still takes the description's first word
// as one ("An object…" became "object…"). Skipping it for them keeps the sentence whole.
const NAMELESS_TAGS = new Set(['returns', 'remarks', 'description']);
const skipNameForNamelessTags = (spec: OriginSpec) => (NAMELESS_TAGS.has(spec.tag) ? spec : tokenizers.name()(spec));

const parseOptions = (spacing: 'compact' | 'preserve') => ({
  spacing,
  tokenizers: [tokenizers.tag(), tokenizers.type(spacing), skipNameForNamelessTags, tokenizers.description(spacing)],
});

function parseJSDoc(source: string) {
  const parsedComments = parse(source, parseOptions('compact'));

  const targetComment = parsedComments[parsedComments.length - 1];

  const templates = targetComment.tags.filter(tag => tag.tag === 'template');

  // The default compact spacing joins every line of `@description` and `@returns` into one, which
  // collapses their bullet lists. Those two are read with preserved spacing; the rest read better compacted.
  const preservedComments = parse(source, parseOptions('preserve'));
  const preservedComment = preservedComments.at(-1);
  const description = trimBlock(
    preservedComment?.tags.find(tag => tag.tag === 'description')?.description ?? preservedComment?.description ?? ''
  );
  const remarks = trimBlock(preservedComment?.tags.find(tag => tag.tag === 'remarks')?.description ?? '');

  const params = targetComment.tags.filter(tag => tag.tag === 'param');

  const returns =
    preservedComments
      .find(comment => comment.tags.find(tag => tag.tag === 'returns') != null)
      ?.tags.filter(tag => tag.tag === 'returns') ?? [];

  const parsedReturns = returns.length === 0 ? undefined : parseReturns(returns[0]);

  const examples = targetComment.tags
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
        // jsdoc.app puts the caption on the tag line: `@example <caption>…</caption>`
        .replace(/^@example\s*/, '')
    )
    .filter(text => text.length > 0)
    .map(text => {
      const caption = EXAMPLE_CAPTION.exec(text);
      return caption == null
        ? { title: undefined, code: text }
        : { title: caption[1], code: text.slice(caption[0].length) };
    });

  return {
    description,
    remarks,
    templates,
    examples,
    params,
    returns:
      parsedReturns == null
        ? undefined
        : { ...returns[0], name: '', description: parsedReturns.description, optional: true },
    nestedValueOfReturns: parsedReturns?.nested,
  };
}

/** JSDoc's own caption syntax; the title renders as a heading above the example's code block. */
const EXAMPLE_CAPTION = /^<caption>(.*?)<\/caption>\s*/;

// A name is a property path or a tuple index path such as `[1].add`; a hyphen is not allowed.
const NESTED_RETURN_ITEM = /^-\s+([\w.[\]]+)\s+`([^`]+)`\s+-\s+(.*)$/;

/**
 * Splits a `@returns` description into its intro and the `- name `type` - description` items.
 *
 * Items are recognised per line, so a hyphen inside a word ("server-side") cannot start one, a
 * `;` separator is no longer needed, and a `:` inside a type stays where it is. A list line that
 * matches neither an item nor a continuation is a typo the build should not paper over.
 */
function parseReturns(returnTag: Spec): { description: string; nested: Spec[] | undefined } {
  const lines = returnTag.description
    .replace(/^[ \t]*-[ \t]+/, '')
    .split('\n')
    .map(line => line.trim());
  const firstItem = lines.findIndex(line => LIST_ITEM.test(line));

  if (firstItem === -1) {
    return { description: joinWrappedLines(lines), nested: undefined };
  }

  const nested = lines
    .slice(firstItem)
    .filter(line => line !== '')
    .reduce<Spec[]>((items, line) => {
      const previous = items.at(-1);

      if (!LIST_ITEM.test(line) && previous != null) {
        // A `:` line is a sub-item and keeps its own line; anything else is the editor's wrapping.
        const description = line.startsWith(':')
          ? `${previous.description}\n${line}`
          : `${previous.description} ${line}`;
        return [...items.slice(0, -1), { ...previous, description }];
      }

      const match = NESTED_RETURN_ITEM.exec(line);

      if (match == null) {
        throw new Error(`Unrecognised @returns item "${line}" — expected "- name \`type\` - description"`);
      }

      const [, name, type, description] = match;
      return [...items, { name, type, description, optional: true }];
    }, []);

  return {
    description: joinWrappedLines(lines.slice(0, firstItem)),
    nested: nested.map(item => ({ ...item, description: endSentence(item.description) })),
  };
}

/** Items used to end with `;` as the separator; a period closes the sentence either way. */
function endSentence(description: string) {
  const trimmed = description.replace(/;$/, '').trimEnd();
  return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
}

async function jsdocToMd(name: string, jsdoc: ReturnType<typeof parseJSDoc>) {
  const { templates, description, remarks, examples, params, returns, nestedValueOfReturns } = jsdoc;

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
    templates.length === 0
      ? ''
      : `<${templates
          .map(template => {
            const constraint = template.type.length === 0 ? '' : ` extends ${template.type}`;
            const fallback = template.default == null ? '' : ` = ${template.default}`;
            return `${template.name}${constraint}${fallback}`;
          })
          .join(', ')}>`;
  const getParamsCode = () =>
    params
      .filter(param => !param.name.includes('.'))
      .map(param => {
        const { rest, type } = splitRestMarker(param.type);
        const optional = param.optional && param.default == null ? '?' : '';
        return `${rest}${param.name}${optional}: ${type}${param.default == null ? '' : ` = ${param.default}`}`;
      });

  return `# ${name}

${description}

## Interface

\`\`\`ts
${await prettier.format(`function ${name}${getTemplateCode()}(${getParamsCode()}): ${returns == null ? 'void' : returns.type};`, { ...prettierConfig, parser: 'typescript' })}\`\`\`

### Parameters
${
  params.length === 0
    ? '\nThis function does not accept any parameters.'
    : `
${await prettier.format(paramsProps.map(props => getParamUl(...props)).join(''), { ...prettierConfig, parser: 'vue' })}`
}
### Return Value
${
  returns == null
    ? '\nThis function does not return anything.'
    : `
${await prettier.format(getParamUl(returns, nestedValueOfReturns), { ...prettierConfig, parser: 'vue' })}`
}
## Example

${examples
  .map(({ title, code }) => `${title == null ? '' : `### ${title}\n\n`}\`\`\`tsx\n${code}\n\`\`\``)
  .join('\n\n')}
${remarks.length === 0 ? '' : `\n## Notes\n\n${remarks}\n`}`;
}

const LIST_ITEM = /^[-*]\s/;

/**
 * `@description` and `@remarks` are Markdown and go to the page as written: a line break inside a
 * paragraph renders as a space, and fences, numbered and nested lists keep their meaning.
 */
function trimBlock(text: string) {
  return text
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * The `@returns` intro lands in an HTML attribute where a line break becomes `<br />`, so the
 * source's wrapping is joined back into one line; a blank line still separates paragraphs.
 */
function joinWrappedLines(lines: string[]) {
  return lines
    .join('\n')
    .replace(/(?<=\S)\n(?=\S)/g, ' ')
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
  // `"` must go in both contexts: the attribute it would terminate is double-quoted either way.
  const replaced = value
    .replace(/^\s*-\s*/, '')
    .replace(/--/g, '\n-')
    // The page renders this with `v-html`, so a generic such as `MouseEvent<E>` would become an element.
    // Vue decodes entities in the attribute before the prop reaches `v-html`, so the escape is doubled:
    // `&amp;lt;` is `&lt;` in the prop and `<` on the page.
    .replace(/</g, '&amp;lt;')
    .replace(/>/g, '&amp;gt;')
    .replace(/`([^`]*)`/g, '<code>$1</code>')
    .replace(/\*\*([^**]*)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]*)\*/g, '<em>$1</em>')
    .replace(/_([^*]*)_/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
    .replace(/"/g, '&quot;');

  return quote === "'" ? replaced.replace(/'/g, `\\'`) : replaced;
}
