# react-simplikit, 선택의 이유

왜 많은 리액트 기반 라이브러리 중 `react-simplikit`을 선택해야 할까요? 우리가 중요하게 생각하는 가치에 대해 알아보면서, 왜 `react-simplikit`을 사용하는 것이 리액트를 리액트답게 작성하는 것과 같은지 알아볼게요.

## 선언적 인터페이스

익숙한 React 코드에 필요한 기능만 더하세요. 책 검색창에 입력한 내용은 즉시 반영하고, 목록은 입력이 300ms 동안 멈추면 갱신해요.

두 예제는 서버 없이 같은 목록에서 책을 찾아요. `<BookSearch />`을 렌더링하고 `React`를 입력해 보세요. Server Components를 사용하는 프레임워크에서는 예제를 Client Component(`'use client'`)에 넣으세요.

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

[useDebouncedValue](/ko/hooks/useDebouncedValue)를 사용하면 `query`를 늦게 반영하는 값인 `searchQuery`를 선언할 수 있어요. 입력 상태는 `useState`로 관리하고, 목록을 필터링할 값은 한 줄로 만들어요. 훅은 타이머를 관리하고, 컴포넌트가 언마운트되면 대기 중인 갱신을 취소해요.

## 작은 번들 사이즈

웹 서비스 입장에서 빠른 응답속도는 매우 중요해요. 그렇기에 웹 서비스를 구성하기 위한 라이브러리인 `react-simplikit`에게 작은 번들 사이즈는 매우 중요해요. `react-simplikit`은 지금도, 앞으로도 최대한 작은 번들 사이즈를 제공하기 위해 노력하고자 해요.

`react-simplikit`은 `react-use`에 대비하여, 아래와 같이 최대 약 89% 작은 크기를 가져요.

|                                            | react-simplikit                                                   | react-use                                                    | 차이   |
| ------------------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| Unpacked Size                              | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8% |
| Minified Size                              | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9% |
| Gzipped Size                               | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9% |
| 평균 함수 당 크기<br/>(Minified Size 기준) | 318.2 byte                                                        | 696.3 byte                                                   | -54.3% |
