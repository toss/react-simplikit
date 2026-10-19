/**
 * Parameter list of a function the caller passes in.
 * The caller's own annotations decide the types, and unannotated parameters end up as `any`.
 * `unknown[]` would reject annotated callbacks, because function parameters are compared contravariantly.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the only `any` allowed in implementation code
export type CallerTypedArgs = any[];
