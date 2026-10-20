# isAndroid

`isAndroid` is a utility function that detects whether the current device is running Android.

Detection prefers the User-Agent Client Hints API (`navigator.userAgentData.platform`)
and falls back to matching `"Android"` in Client Hints brands or `navigator.userAgent`.

Notes:

- All Android browsers include the token "Android" in the user agent.
- Chromium on Android typically exposes Client Hints `platform` as `"Android"`.

## Interface

```ts
function isAndroid(userAgent?: string): boolean;
```

### Parameters

<Interface
  name="userAgent"
  type="string"
  description="Optional user agent string to check. Defaults to <code>navigator.userAgent</code>."
/>

### Return Value

<Interface
  name=""
  type="boolean"
  description="<code>true</code> if the device is running Android, <code>false</code> otherwise. Returns <code>false</code> on server-side rendering environments."
/>

## Example

```tsx
if (isAndroid()) {
  // Android-specific code
  enableAndroidOptimizations();
}
```

```tsx
// With custom user agent
const isAndroidDevice = isAndroid(
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120'
);
```
