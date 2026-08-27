# 为什么选择 react-simplikit

在众多基于 React 的库当中，为什么你应该选择 `react-simplikit`？让我们一起看看我们坚持的核心价值，理解为什么使用 `react-simplikit` 就等于用 React 的方式编写 React 代码。

## 声明式接口

React 组件已经从类组件演进到了函数组件。

函数组件以及具备声明式 API 的 Hook 出现之后，我们可以把过去在类组件里写得非常复杂的[状态和生命周期相关逻辑抽象出来](https://legacy.reactjs.org/docs/hooks-intro.html#its-hard-to-reuse-stateful-logic-between-components)。

然而，React 组件依然很复杂。由于 React [只提供最小限度的接口](https://legacy.reactjs.org/docs/design-principles.html#common-abstraction)，即使功能只是稍微复杂一点的组件，也可能需要定义几十个状态、几十个处理函数，以及随状态变化而触发的副作用。

到了某个阶段，组件里的关注点开始混杂在一起，代码也变得命令式，让人越来越难看清这个组件到底在做什么、里面又运行着哪些逻辑。

`react-simplikit` 为那些常用但实现起来很复杂的功能提供了恰当的抽象。这样一来，即使在编写逻辑复杂的组件时，你也能保持直观的可读性。

`react-simplikit` 提供的接口，能以声明式的方式解决实际业务开发中经常遇到的各种问题。

在此基础上，它引导开发者写出更具声明式风格的 React 组件。

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
        placeholder="输入搜索关键词"
      />
      {isOpen && (isLoading || results.length > 0) && (
        <div>
          {isLoading ? (
            <div className="p-2">搜索中...</div>
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

    const response = await startLoading(
      fetch(`/api/search?q=${searchQuery}`)
        .then(res => res.json())
        .catch(error => {
          console.error('Failed to fetch results:', error);
          return [];
        })
    );

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
          searchResults(e.target.value);
        }}
        onFocus={openSearchBox}
        placeholder="输入搜索关键词"
      />
      <SwitchCase
        value={searchBoxState}
        caseBy={{
          LOADING: () => <div>搜索中...</div>,
          EMPTY: () => <div>没有找到结果。</div>,
          RESULT_EXISTS: () => (
            <Separated by={<Divider />}>
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

## 更小的包体积

对 Web 服务来说，快速的响应时间至关重要。正因如此，对于用来构建 Web 服务的库 `react-simplikit` 而言，更小的包体积非常重要。`react-simplikit` 一直在努力，无论现在还是将来都提供尽可能小的包体积。

与 `react-use` 相比，`react-simplikit` 的体积最多小约 89%：

|                                          | react-simplikit                                                   | react-use                                                    | 差异   |
| ---------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| Unpacked Size                            | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8% |
| Minified Size                            | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9% |
| Gzipped Size                             | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9% |
| 每个函数的平均体积<br/>（Minified Size） | 318.2 byte                                                        | 696.3 byte                                                   | -54.3% |
