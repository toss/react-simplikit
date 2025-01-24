# reactive-kit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/slash/blob/main/LICENSE)

English | [Korean](./README-ko_kr.md)

`reactive-kit` is a lightweight yet powerful library that provides various utilities for use in React environments.

- `reactive-kit` is dependency-free, making it extremely lightweight.
- `reactive-kit` guarantees reliability with 100% test coverage.
- `reactive-kit` offers JSDoc comments, detailed documentation, and examples to ensure any developer can easily use it.

## Example

```tsx
import { useBooleanState } from 'reactive-kit';

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

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

MIT © Viva Republica, Inc. For more details, see [LICENSE](./LICENSE)
