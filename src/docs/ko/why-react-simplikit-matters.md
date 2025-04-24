# react-simplikit, 선택의 이유

왜 많은 리액트 기반 라이브러리 중 `react-simplikit`을 선택해야 할까요? 우리가 중요하게 생각하는 가치에 대해 알아보면서, 왜 `react-simplikit`을 사용하는 것이 리액트를 리액트답게 작성하는 것과 같은지 알아볼게요.

## 선언적 인터페이스

리액트 컴포넌트는 클래스형 컴포넌트에서 함수형 컴포넌트로 그 형태가 발전되어 왔어요.

함수형 컴포넌트와 선언적인 API의 훅들이 등장하면서, 기존의 클래스형 컴포넌트에서 복잡하게 작성하던 [상태와 생명주기 관련 로직들을 추상화](https://ko.legacy.reactjs.org/docs/hooks-intro.html#ts-hard-to-reuse-stateful-logic-between-components) 할 수 있게 되었어요.

그러나 여전히 리액트 컴포넌트는 복잡해요. 리액트는 [최소한의 인터페이스를 제공](https://ko.legacy.reactjs.org/docs/design-principles.html#common-abstraction)하고 있기 때문에, 조금만 복잡한 기능이 포함된 컴포넌트를 작성하기 위해서는 수십 개의 상태, 핸들러, 상태 변화에 따른 사이드 이펙트 정의가 포함될 수 있어요.

어느 시점부터 컴포넌트는 관심사가 뒤섞여 명령형으로 작성되고, 컴포넌트가 무슨 일을 하는지, 어떤 로직들이 돌아가는지는 점점 더 파악하기 어려워져요.

`react-simplikit`은 자주 사용되지만 직접 구현하기 복잡한 기능들을 적절히 추상화하여 제공해요. 이를 바탕으로 복잡한 로직을 가지는 컴포넌트를 작성할 때도 직관적인 가독성을 유지할 수 있어요.

`react-simplikit`은 실제 서비스를 개발하면서 자주 접하게 되는 다양한 문제들을 선언적으로 해결하는 인터페이스를 제시해요.

이를 바탕으로 개발자가 한 단계 더 선언적인 React 컴포넌트를 작성할 수 있도록 유도해요.

::: code-group

```tsx [without-react-simplikit.tsx]
function AutoCompleteInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);
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
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
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

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
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
        placeholder="검색어를 입력하세요"
      />
      {isOpen && (isLoading || results.length > 0) && (
        <div>
          {isLoading ? (
            <div className="p-2">검색 중...</div>
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
        placeholder="검색어를 입력하세요"
      />
      <SwitchCase
        value={searchBoxState}
        caseBy={{
          LOADING: () => <div>검색 중...</div>,
          EMPTY: () => <div>검색 결과가 없습니다.</div>,
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

## 작은 번들 사이즈

웹 서비스 입장에서 빠른 응답속도는 매우 중요해요. 그렇기에 웹 서비스를 구성하기 위한 라이브러리인 `react-simplikit`에게 작은 번들 사이즈는 매우 중요해요. `react-simplikit`은 지금도, 앞으로도 최대한 작은 번들 사이즈를 제공하기 위해 노력하고자 해요.

`react-simplikit`은 `react-use`에 대비하여, 아래와 같이 최대 약 89% 작은 크기를 가져요.

|                                            | react-simplikit                                                   | react-use                                                    | 차이   |
| ------------------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| Unpacked Size                              | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8% |
| Minified Size                              | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9% |
| Gzipped Size                               | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9% |
| 평균 함수 당 크기<br/>(Minified Size 기준) | 318.2 byte                                                        | 696.3 byte                                                   | -54.3% |
