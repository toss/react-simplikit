# Por qué importa react-simplikit

Entre las muchas bibliotecas basadas en React, ¿por qué deberías elegir `react-simplikit`? Veamos nuestros valores fundamentales y entendamos por qué usar `react-simplikit` equivale a escribir React a la manera de React.

## Interfaz declarativa

Los componentes de React han evolucionado desde los componentes de clase hasta los componentes de función.

Con la llegada de los componentes de función y de los Hooks de API declarativa, ahora podemos [abstraer el estado y la lógica relacionada con el ciclo de vida](https://legacy.reactjs.org/docs/hooks-intro.html#its-hard-to-reuse-stateful-logic-between-components) que antes se escribía de forma complicada en los componentes de clase.

Aun así, los componentes de React siguen siendo complejos. Como React [ofrece interfaces mínimas](https://legacy.reactjs.org/docs/design-principles.html#common-abstraction), un componente con una funcionalidad apenas algo compleja puede necesitar decenas de estados, manejadores y definiciones de efectos secundarios que dependen de los cambios de estado.

En algún momento, los componentes acaban mezclando responsabilidades y se escriben de forma imperativa, y cada vez cuesta más entender qué hace el componente y qué lógica se está ejecutando.

`react-simplikit` ofrece las abstracciones adecuadas para funcionalidades de uso frecuente pero difíciles de implementar. Así puedes mantener una legibilidad intuitiva incluso cuando escribes componentes con lógica compleja.

`react-simplikit` presenta interfaces que resuelven de forma declarativa los distintos problemas que aparecen habitualmente durante el desarrollo real de un servicio.

Sobre esa base, guía a los desarrolladores para que escriban componentes de React más declarativos.

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
        placeholder="Escribe un término de búsqueda"
      />
      {isOpen && (isLoading || results.length > 0) && (
        <div>
          {isLoading ? (
            <div className="p-2">Buscando...</div>
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
        placeholder="Escribe un término de búsqueda"
      />
      <SwitchCase
        value={searchBoxState}
        caseBy={{
          LOADING: () => <div>Buscando...</div>,
          EMPTY: () => <div>No se encontraron resultados.</div>,
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

## Tamaño de bundle reducido

Un tiempo de respuesta rápido es crucial para los servicios web. Por eso, para `react-simplikit`, una biblioteca con la que se construyen servicios web, un tamaño de bundle reducido es muy importante. `react-simplikit` se esfuerza por ofrecer el menor tamaño de bundle posible, ahora y en el futuro.

En comparación con `react-use`, `react-simplikit` llega a ser hasta un 89% más pequeño:

|                                              | react-simplikit                                                   | react-use                                                    | Diferencia |
| -------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| Unpacked Size                                | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8%     |
| Minified Size                                | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9%     |
| Gzipped Size                                 | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9%     |
| Tamaño medio por función<br/>(Minified Size) | 318.2 byte                                                        | 696.3 byte                                                   | -54.3%     |
