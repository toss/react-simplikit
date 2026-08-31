import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { renderEnglishDoc } from './index.ts';

async function render(name: string, source: string) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'generate-docs-'));
  const sourceFilePath = path.join(directory, `${name}.ts`);
  await fs.writeFile(sourceFilePath, source);

  try {
    return await renderEnglishDoc(name, sourceFilePath);
  } finally {
    await fs.rm(directory, { force: true, recursive: true });
  }
}

describe('renderEnglishDoc', () => {
  it('leaves an apostrophe alone in a top-level description, which is a double-quoted attribute', async () => {
    const document = await render(
      'useElement',
      `/**
 * @description
 * \`useElement\` does something.
 *
 * @param {string} id - The element's id.
 *
 * @returns {void}
 *
 * @example
 * useElement('root');
 */
export function useElement(id: string) {}`
    );

    expect(document).toContain(`description="The element's id."`);
  });

  it('escapes an apostrophe inside a nested description, which is a single-quoted string', async () => {
    const document = await render(
      'useUser',
      `/**
 * @description
 * \`useUser\` does something.
 *
 * @returns {UseUserReturn} An object.
 * - name \`string\` - The user's name;
 *
 * @example
 * useUser();
 */
export function useUser() {}`
    );

    expect(document).toContain(`The user\\'s name.`);
  });

  it('rejoins a paragraph that the source wrapped across lines', async () => {
    const document = await render(
      'useWrapped',
      `/**
 * @description
 * \`useWrapped\` does one thing.
 * It also does another thing.
 *
 * @returns {void}
 *
 * @example
 * useWrapped();
 */
export function useWrapped() {}`
    );

    expect(document).toContain('`useWrapped` does one thing. It also does another thing.');
  });

  it('escapes a double quote in a nested description, which sits inside a double-quoted attribute', async () => {
    const document = await render(
      'useMode',
      `/**
 * @description
 * \`useMode\` does something.
 *
 * @returns {UseModeReturn} An object.
 * - mode \`string\` - Either "wide" or "narrow";
 *
 * @example
 * useMode();
 */
export function useMode() {}`
    );

    expect(document).toContain('Either &quot;wide&quot; or &quot;narrow&quot;.');
  });

  it('rejoins the wrapped continuation lines of a bullet item', async () => {
    const document = await render(
      'useWrappedBullet',
      `/**
 * @description
 * Intro line.
 *
 * - The first bullet wraps
 *   onto a second line
 *   and a third line.
 * - The second bullet stays.
 *
 * @returns {void}
 *
 * @example
 * useWrappedBullet();
 */
export function useWrappedBullet() {}`
    );

    expect(document).toContain(
      '- The first bullet wraps onto a second line and a third line.\n- The second bullet stays.'
    );
  });

  it('keeps the bullet list of a multi-line description on separate lines', async () => {
    const document = await render(
      'useLayout',
      `/**
 * @description
 * \`useLayout\` is useful for:
 *
 * - Measuring elements
 * - Avoiding layout shifts
 *
 * @returns {void}
 *
 * @example
 * useLayout();
 */
export function useLayout() {}`
    );

    expect(document).toContain('- Measuring elements\n- Avoiding layout shifts');
  });

  it('puts the spread of a rest parameter on the name, not the type', async () => {
    const document = await render(
      'mergeAll',
      `/**
 * @description
 * \`mergeAll\` does something.
 *
 * @param {...PropsList} props - The props objects to merge.
 *
 * @returns {Merged} The merged object.
 *
 * @example
 * mergeAll({}, {});
 */
export function mergeAll(...props: PropsList) {}`
    );

    expect(document).toContain('...props: PropsList');
    expect(document).toContain('type="PropsList"');
  });

  it('does not double the period of a nested description that already ends with one', async () => {
    const document = await render(
      'useSubscription',
      `/**
 * @description
 * \`useSubscription\` does something.
 *
 * @returns {UseSubscriptionReturn} An object.
 * - unsubscribe \`() => void\` - Stops receiving updates.;
 *
 * @example
 * useSubscription();
 */
export function useSubscription() {}`
    );

    expect(document).toContain('Stops receiving updates.');
    expect(document).not.toContain('Stops receiving updates..');
  });
});
