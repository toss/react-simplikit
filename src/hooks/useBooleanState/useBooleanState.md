# useBooleanState

`useBooleanState` is a React hook that simplifies managing a boolean state. It provides functions to set the state to `true`, set it to `false`, and toggle its value.

## Interface

```ts
function useBooleanState(
  defaultValue: boolean = false
): readonly [state: boolean, setTrue: () => void, setFalse: () => void, toggle: () => void];
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">defaultValue</span
    ><span class="post-parameters--type">boolean</span> ·
    <span class="post-parameters--default">false</span>
    <br />
    <p class="post-parameters--description">
      The initial value of the state. Defaults to <code>false</code>.
    </p>
  </li>
</ul>

### Return Value

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name"></span
    ><span class="post-parameters--type"
      >readonly [state: boolean, setTrue: () =&gt; void, setFalse: () =&gt;
      void, toggle: () =&gt; void]</span
    >
    <br />
    <p class="post-parameters--description">tuple containing:</p>
    <ul class="post-parameters-ul">
      <li class="post-parameters-li">
        <span class="post-parameters--name">state</span
        ><span class="post-parameters--type">boolean</span>
        <br />
        <p class="post-parameters--description">The current state value</p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">setTrue</span
        ><span class="post-parameters--type">() =&gt; void</span>
        <br />
        <p class="post-parameters--description">
          A function to set the state to <code>true</code>
        </p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">setFalse</span
        ><span class="post-parameters--type">() =&gt; void</span>
        <br />
        <p class="post-parameters--description">
          A function to set the state to <code>false</code>
        </p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">toggle</span
        ><span class="post-parameters--type">() =&gt; void</span>
        <br />
        <p class="post-parameters--description">
          A function to toggle the state
        </p>
      </li>
    </ul>
  </li>
</ul>

## Example

```tsx
const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] = useBooleanState(false);
```
