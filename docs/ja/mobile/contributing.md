# モバイルユーティリティへの貢献

このガイドは [core の貢献ガイド](/ja/core/contributing) を拡張したものです。

## パッケージのスコープ

`react-simplikit` のモバイルユーティリティは、**モバイル Web 環境で直面する問題の解決**に焦点を当てています。

以下のような領域を扱います。

- ビューポート管理（ビジュアルビューポート、セーフエリア）
- キーボード処理（キーボードに隠れるコンテンツの回避）
- iOS Safari や Android Chrome 特有のレイアウトの問題
- モバイルブラウザにおけるスクロールの挙動

このパッケージは、ブラウザ API に依存するすべてのユーティリティのためのものでは**ありません**。ブラウザ API を使用していても、デスクトップや汎用的な課題を解決するフック（例: キーボードショートカット、マウス座標）はここには属しません。

## 開発ワークフロー

```
スキャフォールディング → 実装 → テスト → ドキュメント化 → レビュー → Changeset → マージ
```

### 1. スキャフォールディング

新しいフックの基本構造を作成します。

```bash
yarn scaffold useNewHook --type h   # フック
```

### 2. 実装

[設計原則](/ja/mobile/design-principles) に従ってください。

- named export のみを使用する
- TypeScript の型推論を最大限活用する
- SSR 安全パターンを適用する

```typescript
// ✅ SSR 安全パターン
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;
```

### 3. ドキュメント化

すべての export 対象の関数には、4 つの必須タグを含む JSDoc が必要です。

```typescript
/**
 * @description 一行の要約。（必須）
 * @param {Type} name - 説明。（パラメータがある場合は必須）
 * @returns {Type} 説明。（戻り値がある場合は必須）
 * @example
 * const result = useHook(input); // （必須）
 */
```

::: tip
**ドキュメントは書かなくてもいいですか？**

はい、ドキュメントを別途書く必要はありません。代わりに、JSDoc コメントを詳しく書いたうえで `yarn docs:gen <name>` を実行すると、JSDoc をもとに英語のドキュメントが生成されるので、その結果を PR に含めてコミットしてください。翻訳は別途管理されており、翻訳が用意されるまでは、そのページは案内とともに英語で表示されます。
:::

### 4. テスト

100% のカバレッジが必須です。

```bash
yarn test:spec      # 単一テストを実行
yarn test:coverage  # カバレッジを確認
```

#### SSR テスト（必須）

```typescript
it('is safe on server side rendering', () => {
  const result = renderHookSSR.serverOnly(() => useHook());
  expect(result.current).toBeDefined();
});
```

#### カバレッジチェックリスト

- [ ] すべての if/else 分岐
- [ ] すべての switch case
- [ ] すべての早期リターン
- [ ] クリーンアップ関数（useEffect の戻り値）

### 5. Changeset を作成する

コードの変更がパッケージに影響する場合は、changeset を作成する必要があります。

```bash
yarn changeset
```

変更の種類を選択してください。

- `patch`: バグ修正や小さな変更
- `minor`: 新機能の追加（後方互換性を維持）
- `major`: 破壊的変更（後方互換性が失われる）

::: tip
両パッケージは現在 `0.0.x` の段階です。この段階では、ほとんどの変更に `patch` を使用してください。
バージョンの種類に迷う場合は、メンテナーに相談してください。
:::

## モバイル特有のガイドライン

### 実機でのテスト

- iOS Safari と Android Chrome でのテストを推奨します
- Visual Viewport API の挙動は実機で確認する必要があります

### プラットフォームの違い

実装時には、以下のプラットフォームの違いを考慮してください。

| 機能                       | iOS                                  | Android                    |
| -------------------------- | ------------------------------------ | -------------------------- |
| `visualViewport.offsetTop` | キーボードが表示されると負の値になる | 基本的に 0 のまま          |
| キーボードの挙動           | ビューポートが押し上げられる         | レイアウトがリサイズされる |

### window/document へのアクセスパターン

ブラウザ API にアクセスする際は、常に SSR 安全パターンを使用してください。

```typescript
// ✅ SSR 安全パターン
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;

// これで window/document を安全に使用できます
window.visualViewport?.addEventListener('resize', handler);
```

## ドキュメントへの貢献

ドキュメントへの貢献に特別な条件はありません。誤った情報や訳の質が良くない箇所を見つけたり、追加したい内容があれば、自由に編集してください。ドキュメントは読者の視点でわかりやすく、簡潔に書いてください。
