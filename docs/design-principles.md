# Design Principles

`react-simplikit` is designed to be lightweight, reliable, and easy to use. The following principles serve as the core values supporting this design.

## Respect React's Lifecycle Without Interference

`react-simplikit` does not include implementations that directly interfere with React's lifecycle.
For example, it doesn't provide hooks like `useMount` or `useLifecycles`, instead favoring approaches that respect and utilize React's default behaviors.

## Lightweight and Fast Through Zero Dependencies

`react-simplikit` has absolutely no dependencies. By not relying on additional libraries, it minimizes bundle size when integrated into projects and eliminates concerns about performance degradation.

## Ensures Reliability Through 100% Test Coverage

`react-simplikit` thoroughly tests every function and branch.
We write comprehensive tests that include not only basic functionality but also SSR environment considerations for each implementation, preventing issues caused by unexpected behavior.
If you're looking for a reliable library, `react-simplikit` will be an excellent choice.

## Comprehensive Documentation for Easy Understanding and Use

`react-simplikit` provides detailed documentation to help users quickly understand and utilize each feature. The documentation includes:

- **JSDoc Comments**: Detailed explanations of each function's behavior, parameters, and return values.
- **Usage Guides**: Clear and easy-to-follow instructions to get started immediately.
- **Practical Examples**: Examples demonstrating how to utilize implementations in real-world scenarios.

While the primary documentation is in English, Korean documentation is also supported, making it accessible to Korean users.

## Type Safe with Full TypeScript Support

`react-simplikit` is built with TypeScript from the ground up. Every hook and utility comes with:

- **Strict Type Definitions**: All parameters, return values, and options are fully typed
- **IntelliSense Support**: Get autocompletion and inline documentation in your IDE
- **Generic Types**: Flexible APIs that preserve your type information
- **No `any` Types**: We avoid escape hatches that compromise type safety
