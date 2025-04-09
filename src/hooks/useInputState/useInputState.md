# useInputState

`useInputState` is a React hook that manages an input state with optional value transformation.

## Interface

```ts
function useInputState(
  initialValue: string = '',
  transformValue: (value: string) => string = (v: string) => v
): readonly [value: string, onChange: (value: string) => void];
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">initialValue</span
    ><span class="post-parameters--type">string</span> ·
    <span class="post-parameters--default">&quot;&quot;</span>
    <br />
    <p class="post-parameters--description">
      The initial value of the input. Defaults to an empty string
      (<code>""</code>).
    </p>
  </li>
</ul>
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">transformValue</span
    ><span class="post-parameters--type">(value: string) =&gt; string</span> ·
    <span class="post-parameters--default">(v: string) =&gt; v</span>
    <br />
    <p class="post-parameters--description">
      A function to transform the input value. Defaults to an identity function
      that returns the input unchanged.
    </p>
  </li>
</ul>

### Return Value

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name"></span
    ><span class="post-parameters--type"
      >readonly [value: string, onChange: (value: string) =&gt; void]</span
    >
    <br />
    <p class="post-parameters--description">tuple containing:</p>
    <ul class="post-parameters-ul">
      <li class="post-parameters-li">
        <span class="post-parameters--name">value</span
        ><span class="post-parameters--type">string</span>
        <br />
        <p class="post-parameters--description">The current state value</p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">onChange</span
        ><span class="post-parameters--type">(value: string) =&gt; void</span>
        <br />
        <p class="post-parameters--description">
          A function to update the state
        </p>
      </li>
    </ul>
  </li>
</ul>

## Example

```tsx
import { useInputState } from 'react-simplikit';

function Example() {
  const [value, setValue] = useInputState('');

  return <input type="text" value={value} onChange={setValue} />;
}
```

### Make uppercase value

```tsx
import { useInputState } from 'react-simplikit';

function Example() {
  const [value, setValue] = useInputState('', v => v.toUpperCase());

  return <input type="text" value={value} onChange={setValue} />;
}
```
