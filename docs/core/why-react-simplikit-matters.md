# Why react-simplikit matters

Among the many React-based libraries, why should you choose `react-simplikit`? Let's explore our core values and understand why using `react-simplikit` is equivalent to writing React in a React-like way.

## Declarative Interface

React components have evolved from class components to function components.

With the introduction of function components and declarative API hooks, we can now [abstract state and lifecycle-related logic](https://legacy.reactjs.org/docs/hooks-intro.html#its-hard-to-reuse-stateful-logic-between-components) that was previously written in a complex way in class components.

However, React components are still complex. Since React [provides minimal interfaces](https://legacy.reactjs.org/docs/design-principles.html#common-abstraction), components with even slightly complex functionality may require dozens of states, handlers, and side effect definitions based on state changes.

At some point, components become mixed with concerns and are written imperatively, making it increasingly difficult to understand what the component doing and what logic is running.

`react-simplikit` provides appropriate abstractions for frequently used but complex-to-implement features. This allows you to maintain intuitive readability even when writing components with complex logic.

`react-simplikit` presents interfaces that declaratively solve various problems commonly encountered during actual service development.

Based on this, it guides developers to write more declarative React components.

::: code-group

```tsx [without-react-simplikit.tsx]
function AutoCompleteInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${query}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Enter search term"
      />
      {isOpen && (isLoading || results.length > 0) && (
        <div>
          {isLoading ? (
            <div className="p-2">Searching...</div>
          ) : (
            results.map((result, idx) => (
              <Fragment key={result.id}>
                <div
                  onClick={() => {
                    setQuery(result.title);
                    setOpen(false);
                  }}
                >
                  {result.title}
                </div>
                {idx !== results.length - 1 && <Divider />}
              </Fragment>
            ))
          )}
        </div>
      )}
    </div>
  );
}
```

```tsx [with-react-simplikit.tsx]
function AutoCompleteInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, startLoading] = useLoading();
  const [isOpen, openSearchBox, closeSearchBox] = useBooleanState(false);

  const searchBoxState = useMemo(() => {
    if (!isOpen) return 'CLOSE';

    if (isLoading) return 'LOADING';

    if (results.length > 0) return 'RESULT_EXISTS';

    return 'EMPTY';
  }, [isOpen, isLoading, results]);

  const searchResults = useDebounce(async (searchQuery: string) => {
    if (searchQuery.trim().length === 0) {
      setResults([]);
      return;
    }

    const response = await fetch(`/api/search?q=${searchQuery}`)
      .then(res => res.json())
      .catch(error => {
        console.error('Failed to fetch results:', error);
        return [];
      });

    setResults(response);
  }, 300);

  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClickEffect(containerRef.current, () => closeSearchBox());

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          openSearchBox();
          startLoading(searchResults(e.target.value));
        }}
        onFocus={openSearchBox}
        placeholder="Enter search term"
      />
      <SwitchCase
        value={searchBoxState}
        caseBy={{
          LOADING: () => <div>Searching...</div>,
          EMPTY: () => <div>No results found.</div>,
          RESULT_EXISTS: () => (
            <Separated with={<Divider />}>
              {results.map(result => (
                <Fragment key={result.id}>
                  <div
                    onClick={() => {
                      setQuery(result.title);
                      closeSearchBox();
                    }}
                  >
                    {result.title}
                  </div>
                </Fragment>
              ))}
            </Separated>
          ),
          CLOSE: () => null,
        }}
      />
    </div>
  );
}
```

:::

## Small Bundle Size

Fast response time is crucial for web services. That's why small bundle size is very important for `react-simplikit`, a library for building web services. `react-simplikit` strives to provide the smallest possible bundle size now and in the future.

Compared to `react-use`, `react-simplikit` has up to about 89% smaller size:

|                                               | react-simplikit                                                   | react-use                                                    | Difference |
| --------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| Unpacked Size                                 | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8%     |
| Minified Size                                 | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9%     |
| Gzipped Size                                  | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9%     |
| Average Size per Function<br/>(Minified Size) | 318.2 byte                                                        | 696.3 byte                                                   | -54.3%     |
