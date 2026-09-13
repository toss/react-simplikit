# 为什么选择 react-simplikit

在众多基于 React 的库当中，为什么你应该选择 `react-simplikit`？让我们一起看看我们坚持的核心价值，理解为什么使用 `react-simplikit` 就等于用 React 的方式编写 React 代码。

## 声明式接口

在熟悉的 React 代码中，只添加所需的功能。在这个图书搜索示例中，输入内容立即更新，列表则在停止输入 300 毫秒后更新。

两个示例都筛选同一个本地列表，无需服务器。渲染 `<BookSearch />`，然后尝试输入 `React`。如果使用支持 Server Components 的框架，请将示例放在 Client Component（`'use client'`）中。

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

通过 [useDebouncedValue](/zh-Hans/hooks/useDebouncedValue)，你可以将 `searchQuery` 声明为延迟反映 `query` 的值。输入状态仍由 `useState` 管理，只需一行代码即可派生出用于筛选列表的值。Hook 负责管理计时器，并在组件卸载时取消尚未执行的更新。

## 更小的包体积

对 Web 服务来说，快速的响应时间至关重要。正因如此，对于用来构建 Web 服务的库 `react-simplikit` 而言，更小的包体积非常重要。`react-simplikit` 一直在努力，无论现在还是将来都提供尽可能小的包体积。

与 `react-use` 相比，`react-simplikit` 的体积最多小约 89%：

|                                          | react-simplikit                                                   | react-use                                                    | 差异   |
| ---------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| Unpacked Size                            | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8% |
| Minified Size                            | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9% |
| Gzipped Size                             | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9% |
| 每个函数的平均体积<br/>（Minified Size） | 318.2 byte                                                        | 696.3 byte                                                   | -54.3% |
