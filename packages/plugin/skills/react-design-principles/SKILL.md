---
name: react-design-principles
description: Design React APIs and abstractions in a React-like way. Covers declarative interfaces, lifecycle-safe abstractions, minimal surfaces, zero-dependency bias, type safety, and documentation.
---

# React Design Principles

Use this skill for higher-level React API decisions: when to extract an abstraction, whether an API is declarative enough, or whether a helper fights React's model.

If the task becomes a specific custom hook implementation or review, pair this with `react-hook-writing` or `react-hook-review`.

## 1. Prefer Declarative Interfaces

React works best when APIs describe desired state, not orchestration steps.

- Prefer abstractions that remove repeated state + effect coordination from components.
- If consumers must manually wire many states, handlers, and effects every time, the abstraction is probably too low-level.
- Favor APIs that read like intent, not procedure.

## 2. Respect React's Lifecycle

Do not introduce abstractions that fight React's lifecycle model.

- Avoid lifecycle-wrapper helpers such as `useMount`, `useEffectOnce`, or `useLifecycles` unless there is a concrete external synchronization need.
- Prefer purpose-specific abstractions like `useWindowSize` or `useOnlineStatus` over generic lifecycle wrappers.
- When synchronizing with browser or network state, keep setup and cleanup explicit.

## 3. Keep the Surface Small

React already provides minimal primitives. Additional abstractions should stay composable and lightweight.

- Prefer a small API surface over feature-heavy helpers.
- Avoid runtime dependencies unless they remove substantial complexity.
- Inject external clients or fetchers instead of hard-coupling them inside the abstraction.

## 4. Design for Reliability

Good React abstractions are predictable in SSR, testable in isolation, and clear at the type level.

- Prefer SSR-safe initialization for shared hooks and browser-dependent logic.
- Use TypeScript generics and avoid `any`.
- Document the public API with JSDoc so usage stays discoverable.
- Treat cleanup, tests, and edge cases as part of the API design.

## 5. Zero-Dependency Bias

Dependencies add bundle weight, version pressure, and replacement cost.

- Reach for dependencies only when they solve more than they introduce.
- Prefer `peerDependencies` over runtime dependencies for shared React packages.
- Inject external clients rather than importing them inside hooks when practical.
- Keep abstractions portable across projects and environments.

## 6. Review Questions

Use these questions before finalizing an abstraction:

1. Does this make components more declarative, or just hide imperative code?
2. Does it respect React's existing lifecycle instead of recreating it?
3. Is the API minimal, typed, and easy to extend?
4. Would the abstraction still make sense without project-specific helpers?
5. Does it avoid unnecessary runtime dependencies?

## Reference

See [principles.md](references/principles.md) for the detailed rationale behind these principles.
