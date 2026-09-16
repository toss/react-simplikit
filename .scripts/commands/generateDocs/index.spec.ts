import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { compileTemplate } from 'vue/compiler-sfc';

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

  it('keeps the first word of a @returns description', async () => {
    const document = await render(
      'isIOS',
      `/**
 * @description
 * \`isIOS\` does something.
 *
 * @returns {boolean} \`true\` if the device is running iOS, \`false\` otherwise.
 *
 * @example
 * isIOS();
 */
export function isIOS() {}`
    );

    expect(document).toContain(
      'description="<code>true</code> if the device is running iOS, <code>false</code> otherwise."'
    );
  });

  it('does not read a hyphen inside a word of a @returns description as a nested item', async () => {
    const document = await render(
      'isServer',
      `/**
 * @description
 * \`isServer\` does something.
 *
 * @returns {boolean} Whether it runs on the server.
 * Returns \`false\` on server-side rendering environments.
 *
 * @example
 * isServer();
 */
export function isServer() {}`
    );

    expect(document).toContain(
      'description="Whether it runs on the server. Returns <code>false</code> on server-side rendering environments."'
    );
    expect(document).not.toContain(':nested');
  });

  it('reads nested return items line by line without a `;` separator', async () => {
    const document = await render(
      'useLongPress',
      `/**
 * @description
 * \`useLongPress\` does something.
 *
 * @returns {Object} Event handlers to attach to an element.
 * - onMouseDown \`() => void\` - Event handler for mouse down events.
 * - onMouseUp \`() => void\` - Event handler for mouse up events.
 *
 * @example
 * useLongPress();
 */
export function useLongPress() {}`
    );

    expect(document).toContain('description="Event handlers to attach to an element."');
    expect(document).toContain("name: 'onMouseDown'");
    expect(document).toContain("name: 'onMouseUp'");
    expect(document).toContain("description: 'Event handler for mouse down events.'");
  });

  it('keeps a `:` continuation line of a nested item on its own line', async () => {
    const document = await render(
      'useGeolocation',
      `/**
 * @description
 * \`useGeolocation\` does something.
 *
 * @returns {Object} Object containing location data.
 * - error \`Error|null\` - Error object if an error occurred, or null
 *   The hook uses standard error codes
 *   : \`0\` - Geolocation is not supported
 *   : \`1\` - User denied permission;
 *
 * @example
 * useGeolocation();
 */
export function useGeolocation() {}`
    );

    expect(document).toContain(
      "'Error object if an error occurred, or null The hook uses standard error codes<br />: <code>0</code> - Geolocation is not supported<br />: <code>1</code> - User denied permission.'"
    );
  });

  it('strips a leading dash from a @returns description', async () => {
    const document = await render(
      'useControlledState',
      `/**
 * @description
 * \`useControlledState\` does something.
 *
 * @returns {T} - The state and the setter function.
 *
 * @example
 * useControlledState();
 */
export function useControlledState() {}`
    );

    expect(document).toContain('description="The state and the setter function."');
    expect(document).not.toContain(':nested');
  });

  it('throws on a list line of @returns that is not a `- name `type` - description` item', async () => {
    await expect(
      render(
        'useNetworkStatus',
        `/**
 * @description
 * \`useNetworkStatus\` does something.
 *
 * @returns {NetworkStatus} Network status information
 * - \`effectiveType\` - Connection quality
 *
 * @example
 * useNetworkStatus();
 */
export function useNetworkStatus() {}`
      )
    ).rejects.toThrow('Unrecognised @returns item "- `effectiveType` - Connection quality"');
  });

  it('marks an optional parameter with `?` and keeps `= default` when one exists', async () => {
    const document = await render(
      'useKeyboardHeight',
      `/**
 * @description
 * \`useKeyboardHeight\` does something.
 *
 * @param {Options} [options] - Configuration options.
 * @param {boolean} [options.immediate=true] - Whether to read on mount.
 * @param {number} [delay=0] - Delay in milliseconds.
 *
 * @returns {void}
 *
 * @example
 * useKeyboardHeight();
 */
export function useKeyboardHeight() {}`
    );

    expect(document).toContain('options?: Options');
    expect(document).toContain('delay: number = 0');
  });

  it('renders each @example in its own fence', async () => {
    const document = await render(
      'useIsClient',
      `/**
 * @description
 * \`useIsClient\` does something.
 *
 * @returns {boolean} Whether it is a client.
 *
 * @example
 * useIsClient();
 *
 * @example
 * // With a fallback
 * useIsClient() ? 1 : 0;
 */
export function useIsClient() {}`
    );

    expect(document).toContain(
      '```tsx\nuseIsClient();\n```\n\n```tsx\n// With a fallback\nuseIsClient() ? 1 : 0;\n```'
    );
  });

  it('escapes angle brackets in a description', async () => {
    const document = await render(
      'useHandlers',
      `/**
 * @description
 * \`useHandlers\` does something.
 *
 * @param {(event: MouseEvent<E>) => void} onClick - Called with a \`MouseEvent<E>\`.
 *
 * @returns {void}
 *
 * @example
 * useHandlers();
 */
export function useHandlers() {}`
    );

    expect(document).toContain('description="Called with a <code>MouseEvent&amp;lt;E&amp;gt;</code>."');

    // What `v-html` receives is the prop after Vue's entity decoding, not the Markdown text.
    const block = /<Interface[\s\S]*?\/>/.exec(document.split('### Parameters')[1])?.[0] ?? '';
    const { code } = compileTemplate({ source: block, id: 'test', filename: 'test.vue' });
    const description = /description: "([^"]*)"/.exec(code)?.[1];
    expect(description).toBe('Called with a <code>MouseEvent&lt;E&gt;</code>.');
  });

  it('renders every @template with its constraint and default', async () => {
    const document = await render(
      'useRefEffect',
      `/**
 * @description
 * \`useRefEffect\` does something.
 *
 * @template {HTMLElement} [RefElement=HTMLElement] - The element type.
 * @template Value - The value type.
 *
 * @returns {void}
 *
 * @example
 * useRefEffect();
 */
export function useRefEffect() {}`
    );

    expect(document).toContain(
      'function useRefEffect<\n  RefElement extends HTMLElement = HTMLElement,\n  Value,\n>(): void;'
    );
  });

  it('accepts a tuple index such as `[0]` or `[1].add` as a nested item name', async () => {
    const document = await render(
      'useSet',
      `/**
 * @description
 * \`useSet\` does something.
 *
 * @returns {[Set<T>, Actions]} A tuple containing the Set state and actions.
 * - [0] \`Set<T>\` - The current Set state.
 * - [1].add \`(value: T) => void\` - Adds a value.
 *
 * @example
 * useSet();
 */
export function useSet() {}`
    );

    expect(document).toContain("name: '[0]'");
    expect(document).toContain("name: '[1].add'");
  });

  it('renders a captioned @example under a level-3 heading', async () => {
    const document = await render(
      'useBodyScrollLock',
      `/**
 * @description
 * \`useBodyScrollLock\` does something.
 *
 * @returns {void}
 *
 * @example
 * <caption>Multiple modals - single lock pattern</caption>
 * function BodyScrollLock() {}
 */
export function useBodyScrollLock() {}`
    );

    expect(document).toContain(
      '## Example\n\n### Multiple modals - single lock pattern\n\n```tsx\nfunction BodyScrollLock() {}\n```'
    );
  });

  it('renders an uncaptioned @example without a heading', async () => {
    const document = await render(
      'usePlain',
      `/**
 * @description
 * \`usePlain\` does something.
 *
 * @returns {void}
 *
 * @example
 * usePlain();
 */
export function usePlain() {}`
    );

    expect(document).toContain('## Example\n\n```tsx\nusePlain();\n```');
    expect(document.split('## Example')[1]).not.toContain('###');
  });

  it('renders @remarks as a Notes section after the examples', async () => {
    const document = await render(
      'useNoted',
      `/**
 * @description
 * \`useNoted\` does something.
 *
 * @returns {void}
 *
 * @example
 * useNoted();
 *
 * @remarks
 * - **SSR safety**: The hook only runs inside \`useEffect\`,
 *   so it is safe during server-side rendering.
 * - **Cleanup**: The lock is released on unmount.
 */
export function useNoted() {}`
    );

    expect(document).toContain(
      '```tsx\nuseNoted();\n```\n\n## Notes\n\n- **SSR safety**: The hook only runs inside `useEffect`, so it is safe during server-side rendering.\n- **Cleanup**: The lock is released on unmount.\n'
    );
  });

  it('omits the Notes section when there is no @remarks', async () => {
    const document = await render(
      'useQuiet',
      `/**
 * @description
 * \`useQuiet\` does something.
 *
 * @returns {void}
 *
 * @example
 * useQuiet();
 */
export function useQuiet() {}`
    );

    expect(document).not.toContain('## Notes');
    expect(document.trimEnd().endsWith('```')).toBe(true);
  });
});
