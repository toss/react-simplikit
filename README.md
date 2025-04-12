![react-simplikit](./src/public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/slash/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/branch/main/graph/badge.svg?token=5PopssACmx)](https://codecov.io/gh/toss/react-simplikit)

English | [Korean](./README-ko_kr.md)

`react-simplikit` is a lightweight yet powerful library that provides various utilities for use in React environments.

- `react-simplikit` is dependency-free, making it extremely lightweight.
- `react-simplikit` guarantees reliability with 100% test coverage.
- `react-simplikit` offers JSDoc comments, detailed documentation, and examples to ensure any developer can easily use it.

## Example

```tsx
import { useBooleanState } from 'react-simplikit';

function Component() {
  const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] = useBooleanState(false);

  return (
    <div>
      <p>Bottom Sheet State: {open ? 'Open' : 'Closed'}</p>
      <button onClick={openBottomSheet}>Open</button>
      <button onClick={closeBottomSheet}>Close</button>
      <button onClick={toggleBottomSheet}>Toggle</button>
    </div>
  );
}
```

## Contributing

Contributions are welcome from everyone in the community. Please check the contribution guide linked below.

[CONTRIBUTING](./src/docs/en/contributing.md)

## License

MIT © Viva Republica, Inc. For more details, see [LICENSE](./LICENSE)
