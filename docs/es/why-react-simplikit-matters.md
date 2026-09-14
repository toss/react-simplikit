# Por qué importa react-simplikit

Entre las muchas bibliotecas basadas en React, ¿por qué deberías elegir `react-simplikit`? Veamos nuestros valores fundamentales y entendamos por qué usar `react-simplikit` equivale a escribir React a la manera de React.

## Interfaz declarativa

Agrega solo lo que necesitas al código React que ya conoces. En esta búsqueda de libros, el campo refleja lo que escribes de inmediato, mientras que la lista se actualiza cuando dejas de escribir durante 300 milisegundos.

Ambos ejemplos filtran la misma lista local sin un servidor. Renderiza `<BookSearch />` y prueba escribir `React`. Si usas un framework con Server Components, coloca el ejemplo en un Client Component (`'use client'`).

::: code-group

```tsx [without-react-simplikit.tsx]
import { useEffect, useState } from 'react';

const books = ['React Handbook', 'TypeScript Guide', 'CSS Patterns'];

function BookSearch() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(
    function debounceSearchQuery() {
      const timeoutId = setTimeout(() => setSearchQuery(query), 300);
      return () => clearTimeout(timeoutId);
    },
    [query]
  );

  const results = books.filter(book =>
    book.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div>
      <label>
        Search books
        <input value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      <p role="status">{results.length} results</p>
      <ul>
        {results.map(book => (
          <li key={book}>{book}</li>
        ))}
      </ul>
    </div>
  );
}
```

```tsx [with-react-simplikit.tsx]
import { useState } from 'react';
import { useDebouncedValue } from 'react-simplikit';

const books = ['React Handbook', 'TypeScript Guide', 'CSS Patterns'];

function BookSearch() {
  const [query, setQuery] = useState('');
  const searchQuery = useDebouncedValue(query, 300);

  const results = books.filter(book =>
    book.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div>
      <label>
        Search books
        <input value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      <p role="status">{results.length} results</p>
      <ul>
        {results.map(book => (
          <li key={book}>{book}</li>
        ))}
      </ul>
    </div>
  );
}
```

:::

Con [useDebouncedValue](/es/hooks/useDebouncedValue), declaras `searchQuery` como una versión de `query` que se actualiza con retraso. Mantienes el estado del campo en `useState` y obtienes el valor para filtrar la lista con una sola línea. El Hook gestiona el temporizador y cancela las actualizaciones pendientes cuando el componente se desmonta.

## Tamaño de bundle reducido

Un tiempo de respuesta rápido es crucial para los servicios web. Por eso, para `react-simplikit`, una biblioteca con la que se construyen servicios web, un tamaño de bundle reducido es muy importante. `react-simplikit` se esfuerza por ofrecer el menor tamaño de bundle posible, ahora y en el futuro.

En comparación con `react-use`, `react-simplikit` llega a ser hasta un 89% más pequeño:

|                                              | react-simplikit                                                   | react-use                                                    | Diferencia |
| -------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| Unpacked Size                                | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8%     |
| Minified Size                                | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9%     |
| Gzipped Size                                 | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9%     |
| Tamaño medio por función<br/>(Minified Size) | 318.2 byte                                                        | 696.3 byte                                                   | -54.3%     |
