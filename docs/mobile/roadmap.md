# Roadmap

Mobile screens are small, and that small space creates a surprising number of UI challenges. Elements get hidden behind on-screen keyboards, safe areas vary by device, and the viewport the user actually sees often differs from what the browser reports. These are not edge cases — they are everyday realities of mobile development.

## The Problem: Unreliable UI on Mobile Screens

On mobile devices, what users see on their screen doesn't always match what developers expect. Here are a few common scenarios:

- **Keyboard covering input fields**: When a user taps on a text input, the on-screen keyboard slides up and can completely obscure the input field or a submit button fixed at the bottom.
- **Safe area inconsistencies**: Devices with notches, rounded corners, or home indicators (like the iPhone's bottom bar) have reserved areas where content shouldn't be placed — but these vary across devices and OS versions.
- **Viewport confusion**: The browser's layout viewport and the actual visible area (the visual viewport) can differ significantly, especially when the keyboard is open or the page is zoomed. Fixed-position elements may end up in unexpected places.

These issues are not specific to any single OS or device. Whether it's iOS Safari, Android Chrome, or any other mobile browser, the underlying challenge is the same: **the visible area is unpredictable, and standard CSS alone can't reliably account for it**.

## Our Approach: Focus on the Visual Viewport

`@react-simplikit/mobile` takes a focused approach to solving these problems. Rather than trying to work around browser quirks with brittle hacks, we center our design around the **visual viewport** — the area of the screen that the user can actually see at any given moment.

By building on the [Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API), we provide hooks that let you:

- **Detect and respond to keyboard appearance** so that fixed-bottom elements move out of the way naturally.
- **Read safe area insets** to properly account for notches, home indicators, and other device-specific reserved areas.
- **Track the real visible area** so your layout decisions are based on what the user actually sees, not what the browser's layout engine assumes.

The goal is simple: **within the visual viewport, UI should render reliably and predictably**.

## Cross-Platform, Cross-Device

We don't want to be limited to a specific OS or device model. Mobile web is inherently cross-platform, and `@react-simplikit/mobile` embraces that.

Our hooks are designed to work consistently across:

- **iOS and Android** — the two dominant mobile platforms.
- **Various browsers** — Safari, Chrome, Samsung Internet, and more.
- **Different device form factors** — from compact phones to large-screen devices, with or without notches and home indicators.

Where a specific API is unavailable (e.g., `window.visualViewport` in older browsers), we provide safe fallbacks that degrade gracefully without breaking your UI.

## What's Next

We're continuing to expand the set of hooks available in `@react-simplikit/mobile`, always guided by the same principle: **make mobile UI development predictable and reliable, regardless of device or OS**. If there's a common mobile UI pain point, chances are we're working on a clean, declarative solution for it.
