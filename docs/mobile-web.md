# Mobile Web

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

## Roadmap {#roadmap}

Mobile screens are small, and that small space creates a surprising number of UI challenges. Elements get hidden behind on-screen keyboards, safe areas vary by device, and the viewport the user actually sees often differs from what the browser reports. These are not edge cases — they are everyday realities of mobile development.

### The Problem: Unreliable UI on Mobile Screens

On mobile devices, what users see on their screen doesn't always match what developers expect. Here are a few common scenarios:

- **Keyboard covering input fields**: When a user taps on a text input, the on-screen keyboard slides up and can completely obscure the input field or a submit button fixed at the bottom.
- **Safe area inconsistencies**: Devices with notches, rounded corners, or home indicators (like the iPhone's bottom bar) have reserved areas where content shouldn't be placed — but these vary across devices and OS versions.
- **Viewport confusion**: The browser's layout viewport and the actual visible area (the visual viewport) can differ significantly, especially when the keyboard is open or the page is zoomed. Fixed-position elements may end up in unexpected places.

These issues are not specific to any single OS or device. Whether it's iOS Safari, Android Chrome, or any other mobile browser, the underlying challenge is the same: **the visible area is unpredictable, and standard CSS alone can't reliably account for it**.

### Our Approach: Focus on the Visual Viewport

The mobile utilities in `react-simplikit` take a focused approach to solving these problems. Rather than trying to work around browser quirks with brittle hacks, we center our design around the **visual viewport** — the area of the screen that the user can actually see at any given moment.

By building on the [Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API), we provide hooks that let you:

- **Detect and respond to keyboard appearance** so that fixed-bottom elements move out of the way naturally.
- **Read safe area insets** to properly account for notches, home indicators, and other device-specific reserved areas.
- **Track the real visible area** so your layout decisions are based on what the user actually sees, not what the browser's layout engine assumes.

The goal is simple: **within the visual viewport, UI should render reliably and predictably**.

### Cross-Platform, Cross-Device

We don't want to be limited to a specific OS or device model. Mobile web is inherently cross-platform, and `react-simplikit` embraces that.

Our hooks are designed to work consistently across:

- **iOS and Android** — the two dominant mobile platforms.
- **Various browsers** — Safari, Chrome, Samsung Internet, and more.
- **Different device form factors** — from compact phones to large-screen devices, with or without notches and home indicators.

Where a specific API is unavailable (e.g., `window.visualViewport` in older browsers), we provide safe fallbacks that degrade gracefully without breaking your UI.

### What's Next

We're continuing to expand the set of mobile hooks available in `react-simplikit`, always guided by the same principle: **make mobile UI development predictable and reliable, regardless of device or OS**. If there's a common mobile UI pain point, chances are we're working on a clean, declarative solution for it.

## Mobile-Specific Principles {#mobile-specific-principles}

### Platform-Aware Design

We consider the behavioral differences between iOS and Android in our implementations:

- **Visual Viewport API differences**:
  - iOS: `offsetTop` becomes negative when the keyboard appears
  - Android: `offsetTop` typically remains 0
- **Keyboard height calculation**: Platform-specific handling for accurate measurements

### SSR Safety First

Every hook includes SSR testing to ensure safe server-side rendering:

```typescript
it('is safe on server side rendering', () => {
  const result = renderHookSSR.serverOnly(() => useHook());
  expect(result.current).toBeDefined();
});
```

### Performance Optimization

Mobile environments require special attention to performance:

- **Event throttling/debouncing**: Optimize frequent events like scroll and resize
- **Passive event listeners**: Use passive listeners where applicable
- **React transitions**: Leverage `startTransition` for non-urgent updates

## Mobile-Specific Guidelines {#mobile-specific-guidelines}

### Testing on Real Devices

- Testing on iOS Safari and Android Chrome is recommended
- Visual Viewport API behavior should be verified on real devices

### Platform Differences

Consider these platform differences when implementing:

| Feature                    | iOS                                    | Android             |
| -------------------------- | -------------------------------------- | ------------------- |
| `visualViewport.offsetTop` | Becomes negative when keyboard appears | Typically remains 0 |
| Keyboard behavior          | Viewport is pushed up                  | Resizes the layout  |

### window/document Access Pattern

Always use the SSR-safe pattern when accessing browser APIs:

```typescript
// ✅ SSR-safe pattern
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;

// Now safe to use window/document
window.visualViewport?.addEventListener('resize', handler);
```

## API Design Standards

### Hook Return Values

We follow consistent patterns for hook return values:

- **Object**: For state and related values (e.g., `useKeyboardHeight(): { keyboardHeight }`, `useVisualViewport(): { viewport }`)
- **void**: For side-effect only hooks (e.g., `useBodyScrollLock(): void`)

### Parameters

- Required parameters come first, optional parameters last
- Use an options object for 3+ optional parameters

### SSR Safety Pattern

All hooks follow the SSR-safe pattern:

```typescript
// ✅ SSR-safe - All hooks follow this pattern
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;
```
