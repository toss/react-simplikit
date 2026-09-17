/**
 * MiniSearch tokenizer for the local search. It splits text the way MiniSearch's default tokenizer does,
 * then splits every chunk containing Han, Hiragana or Katakana into words, because those scripts put no
 * spaces between words and a word in the middle of a clause would never match.
 *
 * VitePress ships this function to the browser as source text, so the body must not reference anything
 * from its module scope. The split pattern must stay equal to MiniSearch's `SPACE_OR_PUNCTUATION`. Without
 * `Intl.Segmenter` it returns the default split, which keeps non-CJK search working.
 */
export function segmentWords(text: string): string[] {
  const chunks = text.split(/[\n\r\p{Z}\p{P}]+/u);
  if (typeof Intl.Segmenter !== 'function') {
    return chunks;
  }
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
  return chunks.flatMap(chunk =>
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(chunk)
      ? Array.from(segmenter.segment(chunk))
          .filter(part => part.isWordLike === true)
          .map(part => part.segment)
      : [chunk]
  );
}
