import { RefObject, useEffect } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

/**
 * @description
 * `useEventListener` is a React hook that simplifies adding and cleaning up event listeners on various targets
 * such as `window`, `document`, HTML elements, or SVG elements.
 * It automatically updates the handler without needing to reattach the event listener on every render,
 * ensuring stable performance and correct behavior.
 *
 * @template KW - The type of event for window events.
 * @template KD - The type of event for document events.
 * @template KH - The type of event for HTML or SVG element events.
 * @template T - The type of the DOM element (default is `HTMLElement`).
 * @param {KW | KD | KH} eventName - The name of the event to listen for.
 * @param {(event: WindowEventMap[KW] | DocumentEventMap[KD] | HTMLElementEventMap[KH] | SVGElementEventMap[KH]) => void} handler - The callback function to execute when the event is triggered.
 * @param {RefObject<T | null> | Document} [element] - A React ref object targeting the element to attach the event listener to, or a `Document` object to attach directly to the document. Defaults to `window` if not provided.
 * @param {boolean | AddEventListenerOptions} [options] - Optional parameters for the event listener, such as `capture`, `once`, or `passive`.
 *
 * @returns {void} This hook does not return anything.
 *
 * @example
 * function WindowResize() {
 *   useEventListener('resize', (event) => {
 *     console.log('Window resized', event);
 *   });
 *
 *   return <div>Resize the window and check the console.</div>;
 * }
 *
 * @example
 * function ClickButton() {
 *   const buttonRef = useRef<HTMLButtonElement>(null);
 *
 *   useEventListener('click', (event) => {
 *     console.log('Button clicked', event);
 *   }, buttonRef);
 *
 *   return <button ref={buttonRef}>Click me</button>;
 * }
 *
 * @example
 * function Document() {
 *   useEventListener('click', (event) => {
 *     console.log('Document clicked at coordinates', event.clientX, event.clientY);
 *   }, document);
 *
 *   return <div>Click anywhere on the document and check the console for coordinates.</div>;
 * }
 */
export function useEventListener<
  K extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  T extends Element = K extends keyof HTMLElementEventMap ? HTMLElement : SVGElement,
>(
  eventName: K,
  handler: ((event: HTMLElementEventMap[K]) => void) | ((event: SVGElementEventMap[K]) => void),
  element: RefObject<T | null>,
  options?: boolean | AddEventListenerOptions
): void;
export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document,
  options?: boolean | AddEventListenerOptions
): void;
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void;
export function useEventListener<
  KW extends keyof WindowEventMap,
  KD extends keyof DocumentEventMap,
  KH extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  T extends HTMLElement | SVGAElement = HTMLElement,
>(
  eventName: KW | KD | KH,
  handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | DocumentEventMap[KD] | Event) => void,
  element?: RefObject<T | null> | Document,
  options?: boolean | AddEventListenerOptions
) {
  const preservedHandler = usePreservedCallback(handler);

  useEffect(() => {
    const targetElement =
      element instanceof Document ? document : (element?.current ?? (element === undefined ? window : undefined));

    if (!targetElement?.addEventListener) return;

    const listener: typeof handler = event => preservedHandler(event);

    targetElement.addEventListener(eventName, listener, options);

    return () => targetElement.removeEventListener(eventName, listener, options);
  }, [eventName, element, options, preservedHandler]);
}
