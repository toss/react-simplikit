# isIOS

`isIOS` is a utility function that detects whether the current device is running iOS or iPadOS. Notes on platform inconsistencies: - Prior to iPadOS 13, iPads reported their platform as "iPad" (or matched /iPad/ in UA). - Starting from iPadOS 13, Apple changed the platform string to "MacIntel" to make websites treat iPadOS as desktop-class Safari. However, these devices still expose multi-touch capabilities.

## Interface

```ts
function isIOS(userAgent: string): boolean;
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
  description="if the device is running iOS or iPadOS, <code>false</code> otherwise. Returns <code>false</code> on server"
  :nested="[
    {
      required: false,
    },
  ]"
/>

## Example

```tsx
if (isIOS()) {
  // iOS-specific code
  enableIOSOptimizations();
}
```
