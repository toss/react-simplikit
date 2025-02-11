# useDebounce

`useDebounce` is a React hook that returns a debounced version of the provided callback function. It helps optimize event handling by delaying function execution and grouping multiple calls into one.

## Interface
```ts
function useDebounce<F extends (...args: unknown[]) => unknown>(
  callback: F,
  wait: number,
  options: DebounceOptions,
): F & { cancel: () => void };

```

## Parameters
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">callback</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type">F</span>
    <br />
    <p class="post-parameters--description">The function to debounce.</p>
  </li>
</ul>
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">wait</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type">number</span>
    <br />
    <p class="post-parameters--description">
      The number of milliseconds to delay the function execution.
    </p>
  </li>
</ul>
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">options</span
    ><span class="post-parameters--type">DebounceOptions</span>
    <br />
    <p class="post-parameters--description">
      Configuration options for debounce behavior.
    </p>
    <ul class="post-parameters-ul">
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.leading</span
        ><span class="post-parameters--type">boolean</span> ·
        <span class="post-parameters--default">false</span>
        <br />
        <p class="post-parameters--description">
          If <code>true</code>, the function is called at the start of the
          sequence.
        </p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.trailing</span
        ><span class="post-parameters--type">boolean</span> ·
        <span class="post-parameters--default">true</span>
        <br />
        <p class="post-parameters--description">
          If <code>true</code>, the function is called at the end of the
          sequence.
        </p>
      </li>
    </ul>
  </li>
</ul>


## Returns

debounced function that delays invoking the callback. It also includes a `cancel` method to cancel any pending debounced execution.

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name"></span
    ><span class="post-parameters--type">F & { cancel: () => void }</span>
    <br />
    <p class="post-parameters--description">
      debounced function that delays invoking the callback. It also includes a
      <code>cancel</code> method to cancel any pending debounced execution.
    </p>
  </li>
</ul>


## Example
```tsx
function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value: string) => {
    // Actual API call
    searchAPI(value);
  }, 300);

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
      placeholder="Enter search term"
    />
  );
}
```
  