import { parse, Spec, tokenizers } from 'comment-parser';

// These tags carry no name, but the stock name tokenizer still takes the description's first word
// as one ("An object…" became "object…"). Skipping it for them keeps the sentence whole.
const NAMELESS_TAGS = new Set(['returns', 'remarks', 'description', 'deprecated']);
const skipNameForNamelessTags = (spec: Spec) => (NAMELESS_TAGS.has(spec.tag) ? spec : tokenizers.name()(spec));

export const parseOptions = (spacing: 'compact' | 'preserve') => ({
  spacing,
  tokenizers: [tokenizers.tag(), tokenizers.type(spacing), skipNameForNamelessTags, tokenizers.description(spacing)],
});

/**
 * `@description` and `@remarks` are Markdown and go to the page as written: a line break inside a
 * paragraph renders as a space, and fences, numbered and nested lists keep their meaning.
 */
export function trimBlock(text: string) {
  return text
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * The `@deprecated` text of an export's own comment (the last one in its source file), or
 * `undefined` when there is none. A `@deprecated` on another comment in the file, such as an
 * options type, does not mark the export itself.
 *
 * A deprecated export has no documentation page, so this is the only place the docs and skill
 * tooling learn about it from.
 */
export function readDeprecation(source: string): string | undefined {
  const tag = parse(source, parseOptions('preserve'))
    .at(-1)
    ?.tags.find(tag => tag.tag === 'deprecated');

  if (tag == null) {
    return undefined;
  }

  const text = trimBlock(tag.description);
  const namesReplacement = /`[^`]+`/.test(text);

  if (!namesReplacement) {
    throw new Error(
      '@deprecated must name the replacement in backticks, e.g. "@deprecated Use `newName` instead.", not with {@link newName}'
    );
  }

  return text;
}
