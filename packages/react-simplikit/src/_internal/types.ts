/**
 * Parameter list of a function the caller passes in.
 * The types come from the caller's annotations or the inference context, and fall back to `any` when there is neither.
 * `unknown[]` would reject annotated callbacks, because function parameters are compared contravariantly.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the only `any` allowed in implementation code
export type CallerTypedArgs = any[];
