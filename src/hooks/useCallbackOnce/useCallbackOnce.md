# useCallbackOnce

A React hook that ensures a callback function is executed only once, regardless of how many times it's called. This is useful for one-time operations that should not be repeated, even if the component re-renders.

## Interface

```ts
function useCallbackOnce(callback: () => void, deps: DependencyList): (...args: any[]) => void;
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">callback</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type">() =&gt; void</span>
    <br />
    <p class="post-parameters--description">
      The callback function to be executed once.
    </p>
  </li>
</ul>
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">deps</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type">DependencyList</span>
    <br />
    <p class="post-parameters--description">
      Dependencies array that will trigger a new one-time execution when
      changed.
    </p>
  </li>
</ul>

### Return Value

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name"></span
    ><span class="post-parameters--type">(...args: any[]) =&gt; void</span>
    <br />
    <p class="post-parameters--description">
      memoized function that will only execute once until dependencies change.
    </p>
  </li>
</ul>

## Example

```tsx
import { useCallbackOnce } from 'react-simplikit';

function UserInteraction() {
  const trackFirstInteraction = useCallbackOnce(() => {
    analytics.track('first_interaction');
  }, []);

  return <button onClick={handleOneTimeEvent}>Click me</button>;
}
```

### With Dependencies

This example shows how to track user visits, resetting when the user ID changes:

```tsx
import { useCallbackOnce } from 'react-simplikit';
import { useEffect } from 'react';

function UserTracker({ userId }: { userId: string }) {
  const trackUserVisit = useCallbackOnce(() => {
    analytics.trackVisit(userId);
  }, [userId]);

  trackUserVisit();

  return <div>User page</div>;
}
```
