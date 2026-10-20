# isIOS

`isIOS` is a utility function that detects whether the current device is running iOS or iPadOS.

Detection prefers the User-Agent Client Hints API (`navigator.userAgentData.platform`)
and falls back to the legacy `navigator.platform` / `navigator.userAgent` strings.

Notes on platform inconsistencies:

- Prior to iPadOS 13, iPads reported their platform as "iPad" (or matched /iPad/ in UA).
- Starting from iPadOS 13, Apple changed the platform string to "MacIntel"
  to make websites treat iPadOS as desktop-class Safari.
  However, these devices still expose multi-touch capabilities.
- Chromium-based browsers may report Client Hints `platform` as `"iOS"` instead of `"iPhone"`.

## Interface

```ts
function isIOS(userAgent?: string): boolean;
```

### Parameters

<Interface
  name="userAgent"
  type="string"
  description="Optional user agent string to check. Defaults to <code>navigator.userAgent</code>. When provided, the string is matched directly; the modern iPadOS heuristic still uses the live platform and touch APIs so desktop-class iPad Safari can be detected."
/>

### Return Value

<Interface
  name=""
  type="boolean"
  description="<code>true</code> if the device is running iOS or iPadOS, <code>false</code> otherwise. Returns <code>false</code> on server-side rendering environments."
/>

## Example

```tsx
if (isIOS()) {
  // iOS-specific code
  enableIOSOptimizations();
}
```

```tsx
// With custom user agent
const isIOSDevice = isIOS(
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
);
```
