# なぜ react-simplikit なのか

数多くの React ベースのライブラリの中で、なぜ `react-simplikit` を選ぶべきなのでしょうか。私たちが大切にしているコアバリューを見ながら、`react-simplikit` を使うことがなぜ「React を React らしく書くこと」と同じなのかを理解していきましょう。

## 宣言的インターフェース

使い慣れた React コードに、必要な機能だけを追加できます。この書籍検索では、入力内容はすぐに反映され、入力が 300 ミリ秒間止まると一覧が更新されます。

どちらの例も、サーバーを使わずに同じローカルの一覧を絞り込みます。`<BookSearch />` をレンダリングして、`React` と入力してみてください。Server Components を使うフレームワークでは、この例を Client Component（`'use client'`）に配置してください。

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

[useDebouncedValue](/ja/hooks/useDebouncedValue) を使うと、`query` を遅れて反映する値として `searchQuery` を宣言できます。入力の状態は `useState` で管理し、一覧の絞り込みに使う値を 1 行で導き出します。フックがタイマーを管理し、コンポーネントのアンマウント時に保留中の更新をキャンセルします。

## 小さいバンドルサイズ

Web サービスにとって、応答速度の速さは非常に重要です。だからこそ、Web サービスを構成するライブラリである `react-simplikit` にとって、小さいバンドルサイズは非常に重要です。`react-simplikit` は、今もこれからも、できる限り小さいバンドルサイズを提供できるよう努めています。

`react-simplikit` は `react-use` と比較して、以下のように最大で約 89% 小さいサイズを実現しています。

|                                                      | react-simplikit                                                   | react-use                                                    | 差分   |
| ---------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| Unpacked Size                                        | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8% |
| Minified Size                                        | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9% |
| Gzipped Size                                         | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9% |
| 関数 1 つあたりの平均サイズ<br/>(Minified Size 基準) | 318.2 byte                                                        | 696.3 byte                                                   | -54.3% |
