# Mobile Web

A collection of React hooks that solve common UI challenges in mobile web environments.

## Why these hooks?

Mobile web development comes with challenges that don't exist on desktop. Each of them has a hook in `react-simplikit`:

| Problem                                                    | Use                                                                                          |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| A fixed-bottom element hides behind the on-screen keyboard | [useAvoidKeyboard](/hooks/useAvoidKeyboard)                                                  |
| Read the keyboard height or whether it is visible          | [useKeyboardHeight](/hooks/useKeyboardHeight), [isKeyboardVisible](/utils/isKeyboardVisible) |
| Lock body scroll while a sheet or modal is open            | [useBodyScrollLock](/hooks/useBodyScrollLock)                                                |
| Respect the notch and the home indicator                   | [useSafeAreaInset](/hooks/useSafeAreaInset), [getSafeAreaInset](/utils/getSafeAreaInset)     |
| Track the area the user can actually see                   | [useVisualViewport](/hooks/useVisualViewport)                                                |
| Show or hide a header based on scroll direction            | [useScrollDirection](/hooks/useScrollDirection)                                              |
| Adapt content to the network connection                    | [useNetworkStatus](/hooks/useNetworkStatus)                                                  |
| Pause work when the page goes to the background            | [usePageVisibility](/hooks/usePageVisibility)                                                |
| Branch on the platform                                     | [isIOS](/utils/isIOS), [isAndroid](/utils/isAndroid)                                         |

Every entry is a named import from `react-simplikit`, and the [reference](/reference) lists them alongside everything else.

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

## Roadmap {#roadmap}

Mobile screens are small, and that small space creates a surprising number of UI challenges. Elements get hidden behind on-screen keyboards, safe areas vary by device, and the viewport the user actually sees often differs from what the browser reports. These are not edge cases — they are everyday realities of mobile development.

### The Problem: Unreliable UI on Mobile Screens

On mobile devices, what users see on their screen doesn't always match what developers expect. Here are a few common scenarios:

- **Keyboard covering input fields**: When a user taps on a text input, the on-screen keyboard slides up and can completely obscure the input field or a submit button fixed at the bottom.
- **Safe area inconsistencies**: Devices with notches, rounded corners, or home indicators (like the iPhone's bottom bar) have reserved areas where content shouldn't be placed — but these vary across devices and OS versions.
- **Viewport confusion**: The browser's layout viewport and the actual visible area (the visual viewport) can differ significantly, especially when the keyboard is open or the page is zoomed. Fixed-position elements may end up in unexpected places.

These issues are not specific to any single OS or device. Whether it's iOS Safari, Android Chrome, or any other mobile browser, the underlying challenge is the same: **the visible area is unpredictable, and standard CSS alone can't reliably account for it**.

### Our Approach: Focus on the Visual Viewport

Rather than working around browser quirks with brittle hacks, these hooks center on the **visual viewport** — the area of the screen that the user can actually see at any given moment.

Built on the [Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API), they let you:

- **Detect and respond to keyboard appearance** so that fixed-bottom elements move out of the way naturally.
- **Read safe area insets** to properly account for notches, home indicators, and other device-specific reserved areas.
- **Track the real visible area** so your layout decisions are based on what the user actually sees, not what the browser's layout engine assumes.

The goal is simple: **within the visual viewport, UI should render reliably and predictably**.

### Cross-Platform, Cross-Device

Mobile web is inherently cross-platform, and so are these hooks. They are designed to work consistently across:

- **iOS and Android** — the two dominant mobile platforms. Where they differ (iOS reports a negative `visualViewport.offsetTop` while the keyboard is open; Android keeps it at 0 and resizes the layout instead), the hooks account for the difference so you don't have to.
- **Various browsers** — Safari, Chrome, Samsung Internet, and more.
- **Different device form factors** — from compact phones to large-screen devices, with or without notches and home indicators.

Where a specific API is unavailable (e.g., `window.visualViewport` in older browsers), we provide safe fallbacks that degrade gracefully without breaking your UI.

### What's Next

We keep adding hooks for mobile web pain points, always guided by the same principle: **make mobile UI development predictable and reliable, regardless of device or OS**. If there's a common mobile UI pain point, chances are we're working on a clean, declarative solution for it.
