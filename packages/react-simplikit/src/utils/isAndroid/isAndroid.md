# isAndroid

`isAndroid` is a utility function that detects whether the current device is running Android.

Notes:

- All Android browsers include the token "Android" in the user agent.

## Interface

```ts
function isAndroid(userAgent: string): boolean;
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
  description="if the device is running Android, <code>false</code> otherwise. Returns <code>false</code> on server"
  :nested="[
    {
      required: false,
    },
  ]"
/>

## Example

```tsx
if (isAndroid()) {
  // Android-specific code
  enableAndroidOptimizations();
}

// With custom user agent
const isAndroidDevice = isAndroid(
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120'
);
```
