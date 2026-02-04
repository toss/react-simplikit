# @react-simplikit/mobile

[![npm version](https://img.shields.io/npm/v/@react-simplikit/mobile.svg)](https://www.npmjs.com/package/@react-simplikit/mobile)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)

English | [한국어](./README-ko_kr.md)

Mobile web utilities for React - fixing viewport, keyboard, and layout issues on iOS Safari and Android Chrome.

## Why?

Mobile web development is hard. iOS Safari and Android Chrome have quirks that cause:

- Viewport height changes when keyboard opens
- Body scroll issues with modals
- Safe area inset handling
- Visual viewport inconsistencies

`@react-simplikit/mobile` provides battle-tested solutions for these common problems.

## Features

- **Keyboard handling** - Avoid content being hidden by virtual keyboard
- **Body scroll lock** - Prevent background scroll in modals
- **Visual viewport** - Track actual visible area
- **Safe area** - Handle notch and home indicator
- **Device detection** - Detect iOS, Android, and browser types
- **SSR-safe** - Works with Next.js and other SSR frameworks

## Installation

```bash
npm install @react-simplikit/mobile
# or
yarn add @react-simplikit/mobile
# or
pnpm add @react-simplikit/mobile
```

## Quick Start

### Keyboard Avoiding View

```tsx
import { useAvoidKeyboard } from '@react-simplikit/mobile';

function ChatInput() {
  const { ref, style } = useAvoidKeyboard();

  return (
    <div ref={ref} style={style}>
      <input type="text" placeholder="Type a message..." />
    </div>
  );
}
```

### Body Scroll Lock

```tsx
import { useBodyScrollLock } from '@react-simplikit/mobile';

function Modal({ isOpen, children }) {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;
  return <div className="modal">{children}</div>;
}
```

### Visual Viewport

```tsx
import { useVisualViewport } from '@react-simplikit/mobile';

function Component() {
  const viewport = useVisualViewport();

  return (
    <div style={{ height: viewport.height }}>
      Actual visible height: {viewport.height}px
    </div>
  );
}
```

## What's Included

### Hooks

| Hook                 | Description                            |
| -------------------- | -------------------------------------- |
| `useAvoidKeyboard`   | Avoid content being hidden by keyboard |
| `useBodyScrollLock`  | Lock body scroll (for modals)          |
| `useVisualViewport`  | Track visual viewport size             |
| `useScrollDirection` | Detect scroll direction                |
| `useNetworkStatus`   | Monitor network connectivity           |
| `usePageVisibility`  | Track page visibility state            |

### Utilities

| Utility               | Description                    |
| --------------------- | ------------------------------ |
| `bodyScrollLock`      | Imperative scroll lock control |
| `getSafeArea`         | Get safe area insets           |
| `getKeyboardHeight`   | Estimate keyboard height       |
| `isIOS` / `isAndroid` | Device detection               |
| `isServer`            | SSR environment check          |

## Browser Support

- iOS Safari 13+
- Android Chrome 80+
- Desktop browsers (graceful fallback)

## Related Packages

- [react-simplikit](https://www.npmjs.com/package/react-simplikit) - Core hooks & utilities

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/toss/react-simplikit/blob/main/CONTRIBUTING.md).

## License

MIT © Viva Republica, Inc. See [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE) for details.
