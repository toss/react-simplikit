# Mobile Utilities

A collection of React hooks that solve common UI challenges in mobile web environments.

## Why mobile utilities?

Mobile web development comes with unique challenges that don't exist on desktop:

- **Keyboard avoidance**: Fixed bottom elements get hidden when the on-screen keyboard appears
- **Scroll direction detection**: Headers and navigation bars that show/hide based on scroll
- **Network status monitoring**: Adapting content quality based on connection speed
- **Page visibility tracking**: Pausing videos or analytics when the app goes to background
- **Visual viewport changes**: Handling zoom, keyboard, and viewport resize on mobile browsers

`react-simplikit` provides battle-tested mobile hooks to handle these scenarios with minimal configuration.

## Quick Start

```bash
npm install react-simplikit
```

### Button CTA Example

The most common mobile UI pattern - a fixed bottom button that moves above the keyboard:

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

function FixedBottomCTA() {
  const { style } = useAvoidKeyboard();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```

### Chat Input Example

A chat interface with an input field that stays above the keyboard:

```tsx
import { useState } from 'react';
import { useAvoidKeyboard } from 'react-simplikit';

function ChatInput() {
  const { style } = useAvoidKeyboard();
  const [message, setMessage] = useState('');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        gap: '8px',
        padding: '12px',
        ...style,
      }}
    >
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ flex: 1 }}
      />
      <button>Send</button>
    </div>
  );
}
```

### With Safe Area

For devices with home indicators (like iPhone), you can add a safe area offset:

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

function FixedBottomCTA() {
  const { style } = useAvoidKeyboard({ safeAreaBottom: 34 });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```

## Available Hooks

| Hook                                            | Description                                       |
| ----------------------------------------------- | ------------------------------------------------- |
| [useAvoidKeyboard](/hooks/useAvoidKeyboard)     | Moves fixed elements above the on-screen keyboard |
| [useKeyboardHeight](/hooks/useKeyboardHeight)   | Returns the current keyboard height               |
| [useBodyScrollLock](/hooks/useBodyScrollLock)   | Locks body scroll for modals and overlays         |
| [useScrollDirection](/hooks/useScrollDirection) | Detects scroll direction (up/down)                |
| [useNetworkStatus](/hooks/useNetworkStatus)     | Monitors network connection status                |
| [usePageVisibility](/hooks/usePageVisibility)   | Tracks page visibility state                      |
| [useVisualViewport](/hooks/useVisualViewport)   | Provides visual viewport dimensions and offset    |
