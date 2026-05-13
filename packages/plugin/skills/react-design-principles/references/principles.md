# React-Like Abstraction Principles

These notes capture the higher-level React ideas behind the plugin skills.

## Declarative Interface

Function components and hooks made it possible to extract stateful logic that was previously tangled across lifecycle methods. Good abstractions keep that declarative feel.

- Prefer APIs that let components state intent.
- Avoid forcing every consumer to coordinate several pieces of local state, refs, handlers, and effects by hand.
- If an abstraction makes the component easier to read at a glance, it is usually moving in the right direction.

## Respect Lifecycle Without Interference

React already owns render timing and effect timing. Abstractions should cooperate with that model, not simulate a second lifecycle system on top of it.

- Avoid generic lifecycle wrappers that encourage "run on mount" thinking over synchronization thinking.
- Prefer abstractions tied to a concrete problem domain.
- Keep setup and cleanup visible whenever external systems are involved.

## Minimal Interfaces Win

React exposes a relatively small surface area. Library APIs layered on top of React should usually stay small too.

- Default to fewer parameters and fewer return fields.
- Add options only when they unlock a real use case.
- Prefer composable building blocks over all-in-one helpers.

## Reliability Is Part of Design

A React abstraction is not finished when it "works once."

- SSR behavior matters for shared hooks and libraries.
- Type safety matters because APIs are reused across many call sites.
- Documentation matters because consumers need to understand the contract quickly.
- Cleanup matters because external synchronization is where subtle bugs and leaks appear.

## Zero-Dependency Bias

Dependencies add bundle weight, version pressure, and replacement cost. Reach for them only when they solve more than they introduce.

- Prefer peer dependencies over runtime dependencies for shared React packages.
- Inject external clients rather than importing them inside hooks when practical.
- Keep abstractions portable across projects and environments.
