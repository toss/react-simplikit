# なぜ react-simplikit なのか

数多くの React ベースのライブラリの中で、なぜ `react-simplikit` を選ぶべきなのでしょうか。私たちが大切にしているコアバリューを見ながら、`react-simplikit` を使うことがなぜ「React を React らしく書くこと」と同じなのかを理解していきましょう。

## 宣言的インターフェース

React のコンポーネントは、クラスコンポーネントから関数コンポーネントへと進化してきました。

関数コンポーネントと宣言的な API を持つフックの登場によって、これまでクラスコンポーネントで複雑に書かれていた[状態やライフサイクルに関するロジックを抽象化](https://legacy.reactjs.org/docs/hooks-intro.html#its-hard-to-reuse-stateful-logic-between-components)できるようになりました。

しかし、React のコンポーネントは依然として複雑です。React は[最小限のインターフェースを提供](https://legacy.reactjs.org/docs/design-principles.html#common-abstraction)しているため、少し複雑な機能を持つコンポーネントでも、数十個の状態、ハンドラー、状態変化に応じた副作用の定義が必要になることがあります。

ある時点から、コンポーネントは関心事が混ざり合って命令的に書かれるようになり、そのコンポーネントが何をしているのか、どんなロジックが動いているのかがだんだん把握しづらくなっていきます。

`react-simplikit` は、よく使われるものの実装が複雑になりがちな機能に対して、適切な抽象化を提供します。これにより、複雑なロジックを持つコンポーネントを書くときも、直感的な可読性を保つことができます。

`react-simplikit` は、実際のサービス開発でよく直面するさまざまな問題を宣言的に解決するインターフェースを提示します。

これをもとに、開発者がより宣言的な React コンポーネントを書けるように導きます。

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
        placeholder="検索キーワードを入力"
      />
      {isOpen && (isLoading || results.length > 0) && (
        <div>
          {isLoading ? (
            <div className="p-2">検索中...</div>
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
        placeholder="検索キーワードを入力"
      />
      <SwitchCase
        value={searchBoxState}
        caseBy={{
          LOADING: () => <div>検索中...</div>,
          EMPTY: () => <div>検索結果がありません。</div>,
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

## 小さいバンドルサイズ

Web サービスにとって、応答速度の速さは非常に重要です。だからこそ、Web サービスを構成するライブラリである `react-simplikit` にとって、小さいバンドルサイズは非常に重要です。`react-simplikit` は、今もこれからも、できる限り小さいバンドルサイズを提供できるよう努めています。

`react-simplikit` は `react-use` と比較して、以下のように最大で約 89% 小さいサイズを実現しています。

|                                                      | react-simplikit                                                   | react-use                                                    | 差分   |
| ---------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| Unpacked Size                                        | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8% |
| Minified Size                                        | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9% |
| Gzipped Size                                         | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9% |
| 関数 1 つあたりの平均サイズ<br/>(Minified Size 基準) | 318.2 byte                                                        | 696.3 byte                                                   | -54.3% |
