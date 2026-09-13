---
description: AI コーディングエージェントと react-simplikit を使う
---

# AI 連携

react-simplikit は、AI コーディングエージェント（Claude Code、Codex、Cursor など）がフックを自作する前に適切なフックを探せるよう、資料を提供しています。

## エージェントスキル

`react-simplikit` スキルは、すべてのフック、コンポーネント、ユーティリティの 1 行説明付きカタログと、import・SSR のルールを含みます。インストールすると、エージェントはデバウンス、スロットル、外側のクリック検知、キーボード回避などのロジックを書く前に参照でき、API を使う前に付属のリファレンスを読めます。

::: code-group

```sh [skills.sh]
npx skills add toss/react-simplikit --skill react-simplikit
```

```sh [Claude Code]
claude plugin marketplace add https://github.com/toss/react-simplikit --sparse .claude-plugin packages/plugin
claude plugin install react-simplikit@react-simplikit
```

```sh [Codex]
codex plugin marketplace add https://github.com/toss/react-simplikit
# then install "react-simplikit" from the plugin UI
```

:::

スキルはこれらのドキュメントから生成され、ライブラリとの整合性を保ちます。ソースは [`packages/plugin`](https://github.com/toss/react-simplikit/tree/main/packages/plugin) にあります。

## llms.txt

英語のドキュメントは、エージェントが直接読める形式でも公開されています。

- [`/llms.txt`](https://react-simplikit.slash.page/llms.txt) — 英語ドキュメントの索引と 1 行の要約
- [`/llms-full.txt`](https://react-simplikit.slash.page/llms-full.txt) — 英語ドキュメントをまとめた 1 ファイル
- 英語ドキュメントの URL の `.html` を `.md` に置き換えると、Markdown ソースを読めます。例：[`/hooks/useDebounce.md`](https://react-simplikit.slash.page/hooks/useDebounce.md)。

## Context7

react-simplikit は [Context7](https://context7.com/toss/react-simplikit) に `/toss/react-simplikit` として登録されています。Context7 MCP サーバーを使うエージェントは、追加の設定なしでそこからドキュメントを検索できます。

## エージェントのアクセスを確認する

1. インストールしたスキルまたは [llms.txt](https://react-simplikit.slash.page/llms.txt) を使い、具体的な作業に合う API を探すようエージェントに依頼してください。たとえば、入力が止まってから 300 ms 後に検索関数を呼び出す作業です。
2. リンク先の [useDebounce の Markdown リファレンス](https://react-simplikit.slash.page/hooks/useDebounce.md) を読み、コードを書く前に import、パラメータ、デフォルト値、クリーンアップの動作を説明するよう依頼してください。
3. `react-simplikit` の名前付き import を使い、コールバックの遅延と値の遅延を区別し、保留中のコールバックのキャンセルでは開始済みのリクエストが中止されないと説明することを確認してください。
4. インストール済みのパッケージバージョンでその API が使えるかを確認し、プロジェクトでコードを実行してください。サイトは最新のドキュメントを提供しているため、正しい文書を見つけても古いバージョンとの互換性は保証されません。

エージェントがスキルやサイトにアクセスできない場合は、必要な Markdown リファレンスを直接渡してください。インストールしただけでは、エージェントが文書を読んだことの確認にはなりません。必要な動作を説明する際は [用途別の使い方](/ja/use-cases) を参照してください。
