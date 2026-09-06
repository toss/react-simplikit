# react-simplikit の紹介

どうすればもっと安全で堅牢な React ベースのアプリケーションを作れるでしょうか。私たちはその答えを「React を React らしく書くこと」と定義し、`react-simplikit` でその答えを具体化しました。

`react-simplikit` は、React 環境で役立つさまざまなツールを提供する軽量で強力なライブラリです。React の設計原則を尊重しながら、React の開発体験を改善するために設計されています。

## より直感的で馴染みのあるインターフェース

React の宣言的な API を使うときにできるだけ近い開発体験を提供します。より少なく書いて、より多くのことをより簡単に実現しましょう。

### トグル機能の実装

```tsx
function Page() {
  const [isOpen, setOpen] = useState(false); // [!code --]
  // [!code --]
  const toggle = useCallback(() => {
    // [!code --]
    setOpen(isOpen => !isOpen); // [!code --]
  }, []); // [!code --]
  const [isOpen, toggle] = useToggle(false); // [!code ++]

  return (
    <div>
      <p>Bottom Sheet state: {isOpen ? 'opened' : 'closed'}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```

### 特定の区切り要素で配列をレンダリングする

<SplitView
left-title="without-react-simplikit.tsx"
right-title="with-react-simplikit.tsx">

<template #left>

```tsx
// without `react-simplikit`
const texts = ['hello', 'react', 'world'];

function Page() {
  return (
    <>
      {texts.map((text, idx) => (
        <Fragment key={text}>
          <div>{text}</div>
          {idx < texts.length - 1 ? (
            <Border type="padding24" />
          ) : null}
        </Fragment>
      ))}
    </>
  );
}
```

  </template>

<template #right>

```tsx
// with `react-simplikit`
const texts = ['hello', 'react', 'world'];

function Page() {
  return (
    <Separated by={<Border type="padding24" />}>
      {texts.map(text => (
        <div key={text}>{text}</div>
      ))}
    </Separated>
  );
}
```

  </template>
</SplitView>

## 簡潔な実装で意図しない挙動とバグを最小化する

`react-simplikit` のすべての実装には隠れたロジックがありません。機能の組み合わせや拡張が必要な場合は、外部から注入できるインターフェースを提供します。また、モダンな実装を通じてクリーンなコードを維持しています。

これが、`react-simplikit` を使うことでコードの安定性と信頼性を高められる理由です。

```tsx
function Page() {
  // useIntersectionObserver は交差の検知に必要な最小限の機能だけを提供し、
  // コールバックと交差判定のオプションは外部から注入して受け取ります
  const ref = useIntersectionObserver<HTMLDivElement>(
    entry => {
      if (entry.isIntersecting) {
        console.log('Element is in view:', entry.target);
      } else {
        console.log('Element is out of view:', entry.target);
      }
    },
    { threshold: 0.5 }
  );

  return <div ref={ref}>Observe me!</div>;
}
```

## 高い信頼性

`react-simplikit` は、すべての実装で 100% のテストカバレッジを維持することで高い信頼性を保証します。

## SSR 環境でも安全な動作を保証する

SSR 環境の積極的な採用に伴い、適切に書かれていないコンポーネントやフックは SSR 環境でエラーを起こしたり、ハイドレーションのミスマッチを引き起こしたりすることがあります。`react-simplikit` はこうした問題を最小化するように設計されており、SSR 環境での 100% テストカバレッジによってそれを保証しています。

## React 以外の依存関係なし

React と React-DOM を除いて [14 個の依存関係](https://www.npmjs.com/package/react-use?activeTab=dependencies)を持つ react-use と比較して、`react-simplikit` は React への peer dependency 以外の依存関係を持ちません。

## リンク

react-simplikit についてさらに詳しく知りたい方は、以下のリンクをご覧ください。

- [GitHub](https://github.com/toss/react-simplikit)
