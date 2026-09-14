# Why react-simplikit matters

Among the many React-based libraries, why should you choose `react-simplikit`? Let's explore our core values and understand why using `react-simplikit` is equivalent to writing React in a React-like way.

## Declarative Interface

Add just what you need to familiar React code. In this book search, the input updates immediately, while the list follows after you stop typing for 300 milliseconds.

Both examples filter the same local list without a server. Render `<BookSearch />` and try typing `React`. In a framework with Server Components, place the example in a Client Component (`'use client'`).

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

With [useDebouncedValue](/hooks/useDebouncedValue), `searchQuery` declares a delayed version of `query`. Keep the input state in `useState` and derive the value used to filter the list in one line. The hook manages the timer and cancels pending updates when the component unmounts.

## Small Bundle Size

Fast response time is crucial for web services. That's why small bundle size is very important for `react-simplikit`, a library for building web services. `react-simplikit` strives to provide the smallest possible bundle size now and in the future.

Compared to `react-use`, `react-simplikit` has up to about 89% smaller size:

|                                               | react-simplikit                                                   | react-use                                                    | Difference |
| --------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| Unpacked Size                                 | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8%     |
| Minified Size                                 | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9%     |
| Gzipped Size                                  | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9%     |
| Average Size per Function<br/>(Minified Size) | 318.2 byte                                                        | 696.3 byte                                                   | -54.3%     |
