# react-simplikit への貢献

`react-simplikit` は誰でも気軽に貢献できるように設計されています。貢献したい場合は、以下のガイドを参考にしてください。

## スコープ

`react-simplikit` は、ブラウザ、サーバーサイドレンダリング、React Native といったあらゆる React 環境で動作するフック、コンポーネント、ユーティリティを提供します。加えて、オンスクリーンキーボード、セーフエリアインセット、ビジュアルビューポートのように、ブラウザやモバイル Web ブラウザに固有の問題を解決するフックも含みます。React のライフサイクルに干渉するものや、他のライブラリに依存するものはスコープ外です。[設計原則](./design-principles.md)を参照してください。

ソースは `packages/react-simplikit/src` 配下にあります。プラットフォームに依存しないコードは `hooks/`、`components/`、`utils/` に、モバイル Web ブラウザでのみ意味を持つコードは `mobile/hooks/` と `mobile/utils/` に置きます。ブラウザ API を使うからといって「モバイル Web」になるわけではありません。キーボードショートカットのフックは `hooks/` に、キーボードの高さを扱うフックは `mobile/hooks/` に属します。どちらもパッケージのルートからエクスポートされ、この区分はファイルの置き場所にのみ影響します。

## 実装への貢献

実装に貢献する際は、その種類（`components`、`hooks`、`utils`）に応じた適切なディレクトリに追加してください。すべての実装には、以下の要素を含める必要があります。

- **実装**
- **テストコード**
- **JSDoc**

::: tip
**ドキュメントは書かなくてもいいですか？**

はい、ドキュメントを別途書く必要はありません。代わりに、JSDoc コメントを詳しく書いたうえで `yarn docs:gen <name>` を実行すると、JSDoc をもとに英語のドキュメントが生成されるので、その結果を PR に含めてコミットしてください。翻訳は別途管理されており、翻訳が用意されるまでは、そのページは案内とともに英語で表示されます。
:::

### 実装を書く

`react-simplikit` の [設計原則](./design-principles.md) に従う必要があります。特定のライブラリに依存したり、React のライフサイクルと密接に結びついたりする実装は提供しません。これらの設計原則に沿って実装を書いてください。

### JSDoc を書く

すべての実装には [JSDoc](https://jsdoc.app/) コメントを含める必要があります。JSDoc は実装を使用する際のヒントを提供するだけでなく、ドキュメント生成においても重要な役割を果たします。
JSDoc コメントには `@description` と `@example` を必ず含める必要があり、パラメータや戻り値がある場合は `@param` と `@returns` も含める必要があります。

::: details 正確なドキュメントを生成するために、JSDoc の作成ルールを守る必要があります。JSDoc の検証に失敗すると、CI が失敗することがあります。

- JSDoc は英語で書く必要があります。
- `@description`: 実装の機能や役割を明確に説明する必須タグです。
- `@example`: 実装の使い方を示すサンプルコードを記述する必須タグです。
- `@param`: パラメータの名前と説明を書きます。実装にパラメータがある場合は必ず記述してください。

  - 必須パラメータの場合: `@param {<型>} <パラメータ名> - <パラメータの説明>`
  - 任意パラメータの場合: `@param {<型>} [<パラメータ名>] - <パラメータの説明>`
  - オブジェクト型のパラメータの場合、オブジェクト自体とそのプロパティの両方に `@param` タグが必要です。
  - 説明の下にリストを書きたい場合は、`-` の代わりに `--` を使用してください。

    ```ts
    type Props = {
      name: string;
      age: number;
      nickname?: string;
      company: {
        name: string;
        address?: string;
      };
      paymentMethod?: {
        type: 'card' | 'account';
        number?: string;
      };
    };

    /**
     * @param {string} name - Name of the user.
     * @param {number} age - Age of the user.
     * @param {string} [nickname] - Nickname of the user.
     * @param {Object} company - Company information of the user.
     * @param {string} company.name - Name of the company.
     * @param {string} [company.address] - Address of the company.
     * @param {Object} [paymentMethod] - Payment information of the user.
     * @param {string} [paymentMethod.type] - Payment method.
     * @param {string} [paymentMethod.number] - Card or account number.
     *   -- Card or account number without `-`.
     *   -- If the number is a card number, it should be 15 or 16 digits.
     */
    ```

    この JSDoc は次のようなドキュメントに変換されます。

    <div class='codeblock'>
      <Interface
        required
        name="name"
        type="string"
        description="Name of the user."
      />
      <Interface
        required
        name="age"
        type="number"
        description="Age of the user."
      />
      <Interface
        name="nickname"
        type="string"
        description="Nickname of the user."
      />
      <Interface
        required
        name="company"
        type="Object"
        description="Company information of the user."
        :nested="[
          {
            name: 'company.name',
            type: 'string',
            description: 'Name of the company.',
            required: true,
          },
          {
            name: 'company.address',
            type: 'string',
            description: 'Address of the company.',
          },  
        ]"
      />
      <Interface
        name="paymentMethod"
        type="Object"
        description="Payment information of the user."
        :nested="[
          {
            name: 'paymentMethod.type',
            type: 'string',
            description: 'Payment method.',
            required: true,
          },
          {
            name: 'paymentMethod.number',
            type: 'string',
            description: 'Card or account number.<br/>- Card or account number without `-`.<br/>- If the number is a card number, it should be 15 or 16 digits.',
          },
        ]"
      />
    </div>

- `@returns`: 戻り値の名前と説明を書きます。実装に戻り値がある場合は必ず記述してください。

  - 形式: `@returns {<型>} <戻り値の説明>`
  - オブジェクトやタプルの戻り値の場合、各メンバーの説明を含めてください。
  - 各メンバーに追加の説明が必要な場合は、`:` を使用してください。

    ```ts
    type ReturnValue = [Object, () => void];

    /**
     * @returns {[Object, () => void]} A tuple containing:
     * - obj `Object` - An object containing:
     *   : label `string` - The label of the input.
     *   : value `string` - The value of the input.
     * - onChange `() => void` - A function to update the value.
     */
    ```

    この JSDoc は次のようなドキュメントに変換されます。

    <div class='codeblock'>
      <Interface
        name=""
        type="[obj: Object, onChange: () => void]"
        description="A tuple containing:"
        :nested="[
          {
            name: 'obj',
            type: 'Object',
            description: 'An object containing: <br />  : label <code>string</code> - The label of the input. <br />  : value <code>string</code> - The value of the input.',
          },
          {
            name: 'onChange',
            type: '() => void',
            description: 'A function to update the value.',
          },
        ]"
      />
    </div>

    <br />

    オブジェクト型の戻り値も同様に書けます。

    ```ts
    type ReturnValue = { value: string; onChange: () => void };

    /**
     * @returns {Object} An object containing:
     * - value `string` - The value of the input.
     * - onChange `() => void` - A function to update the value.
     */
    ```

    この JSDoc は次のようなドキュメントに変換されます。

    <div class='codeblock'>
      <Interface
        name=""
        type="Object"
        description="An object containing:"
        :nested="[
          {
            name: 'value',
            type: 'string',
            description: 'The value of the input.',
          },
          {
            name: 'onChange',
            type: '() => void',
            description: 'A function to update the value.',
          },
        ]"
      />
    </div>

:::

### テストコードを書く

すべての実装には、実装と同じ名前のテストコードを必ず含める必要があります。テストカバレッジは常に 100% を満たす必要があります。以下のコマンドでカバレッジを確認できます。

```bash
yarn test:coverage
```

::: details SSR 環境で安全に動作するか確認してください
`react-simplikit` のすべての実装は、SSR 環境で安全に動作することを確認するために特別なレンダリング関数を使ってテストされています。

- コンポーネントのテスト

  ```tsx
  it('is safe on server side rendering', () => {
    // renderSSR.serverOnly はコンポーネントをサーバー環境でレンダリングするメソッドです。
    // この環境では useEffect のようなフックは実行されず、window や document のようなオブジェクトも利用できないため、これらを使うとエラーになります。
    renderSSR.serverOnly(() => (
      <Component>
        <div>Test Content</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render children correctly', async () => {
    // renderSSR はコンポーネントをクライアント環境でレンダリングするメソッドです。
    // ただし、サーバーでレンダリングされた HTML とクライアントでレンダリングされた HTML が異なる場合、ハイドレーションのミスマッチエラーが発生します。
    await renderSSR(() => (
      <Component>
        <div>Test Content</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should hydration mismatch error occurred', async () => {
    // このテストコードは、ハイドレーションのミスマッチエラーによって失敗します。
    await renderSSR(() => (
      <Component>
        <div>Test Content</div>
        <div>{Math.random()}</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  ```

- フックのテスト

  ```ts
  it('is safe on server side rendering', () => {
    // renderHookSSR.serverOnly はフックをサーバー環境でレンダリングするメソッドです。
    // この環境では useEffect のようなフックは実行されず、window や document のようなオブジェクトも利用できないため、これらを使うとエラーになります。
    const result = renderHookSSR.serverOnly(() => useToggle(true));
    const [bool] = result.current;
    expect(bool).toBe(true);
  });

  it('should initialize with the default value true', async () => {
    const { result } = await renderHookSSR(() => useToggle(true));
    const [bool] = result.current;
    expect(bool).toBe(true);
  });
  ```

:::

### Changeset を作成する

コードの変更がパッケージに影響する場合は、changeset を作成する必要があります。Changeset は、バージョン管理と changelog 生成を自動化するツールです。

#### Changeset の作成方法

1. 変更を実装したら、以下のコマンドを実行してください。

```bash
yarn changeset
```

2. 変更の種類を選択してください。

   - `patch`: バグ修正や小さな変更
   - `minor`: 新機能の追加（後方互換性を維持）
   - `major`: 破壊的変更（後方互換性が失われる）

3. 変更内容の簡単な説明を書いてください。

::: tip
パッケージは現在 `0.x` の段階です。この段階では、ほとんどの変更に `patch` を使用してください。
バージョンの種類に迷う場合は、メンテナーに相談してください。
:::

4. 生成された changeset ファイルを PR に含めてコミットしてください。

::: tip
Changeset ファイルは `.changeset` フォルダに作成され、PR と一緒にコミットする必要があります。PR がマージされると、バージョンが自動的に更新され、changelog が生成されます。
:::

### リリース

変更が `main` ブランチにマージされると、リリースプロセスが自動的に実行されます。

1. PR が `main` ブランチにマージされると、GitHub Actions が実行されます。
2. changeset がある場合、バージョン更新用の PR が自動的に作成されます。
3. バージョン更新用の PR がマージされると、新しいバージョンが npm に公開されます。

リリース結果は [GitHub Actions](https://github.com/toss/react-simplikit/actions) で確認できます。

## ドキュメントへの貢献

ドキュメントへの貢献に特別な条件はありません。誤った情報や訳の質が良くない箇所を見つけたり、追加したい内容があれば、自由に編集してください。ドキュメントは読者の視点でわかりやすく、簡潔に書いてください。

## スキャフォールディング

貢献のための最小限の骨組みを作成するコマンドがあります。以下のコマンドを使うと、基本的な構造を持つ実装フォルダを作成できます。

```bash
yarn run scaffold <name> --type <type>
```

- `type`: 実装の種類。`component`、`hook`、`util` のいずれかを指定してください。
- `name`: 実装の名前。

### 使用例

```bash
yarn run scaffold Button --type component
```

このコマンドは `src/components/Button` フォルダに 3 つのファイルを作成します。

::: code-group

```tsx [Button.tsx]
/**
 * @description
 * <description-here>
 *
 * @param {<param-type>} <param-name> - <param-description>
 * @param {<param-type>} [<param-name>] - <optional-param-description>
 *
 * @returns {<return-type>} <return-description>
 * - <member-description> `<member-name>` - <member-description>
 *
 * @example
 * <example-code>
 */
export function Button() {
  // TODO: Implement Button
}
```

```tsx [Button.spec.ts]
import { describe, expect, it } from 'vitest';

import { renderSSR } from '../../_internal/test-utils/renderSSR.tsx';

import { Button } from './Button.tsx';

describe('Button', () => {
  it('is safe on server side rendering', async () => {
    const result = renderSSR.serverOnly(() => <Button />);
    expect(true).toBe(true);
  });

  it('should work', async () => {
    const result = renderSSR.serverOnly(() => <Button />);
    expect(true).toBe(true);
  });
});
```

```ts [index.ts]
export { Button } from './Button.tsx';
```

:::

::: tip
以下のショートカットも使用できます。

```bash
yarn run scaffold Button --t c // コンポーネントを作成
yarn run scaffold useButton --t h // フックを作成
yarn run scaffold getButton --t u // ユーティリティを作成
```

:::

## 貢献の流れ

スキャフォールディング → 実装 → テスト → ドキュメント化 → レビュー → Changeset → マージ

### カバレッジチェックリスト

- [ ] すべての if/else 分岐
- [ ] すべての switch case
- [ ] すべての早期リターン
- [ ] クリーンアップ関数（useEffect の戻り値）

### 実装ルール

- named export のみを使用します
- TypeScript の型推論を最大限活用します
- 必須パラメータを先に、任意パラメータを後に置きます。任意パラメータが 3 個以上になったらオプションオブジェクトを使います
- 値が 1 つならその値を、状態とアクションの組なら `[state, action]` のタプルを、メンバーがそれより多い場合や今後増える見込みの形（キーボードの高さやセーフエリアインセットのようなブラウザの計測値）ならオブジェクトを返します
- 以下の SSR 安全パターンを適用します

### SSR 安全パターン

レンダリング中にブラウザ API を読み取らないでください。サーバーには `window` がなく、クライアントの値がサーバーの値と異なるとハイドレーションのミスマッチが起きます。固定の初期値から始めて、エフェクトの中で同期してください。

```ts
const [state, setState] = useState(FIXED_INITIAL_VALUE);

useEffect(function syncBrowserState() {
  if (isServer()) {
    return;
  }

  setState(readBrowserApi());
}, []);
```

### ブラウザ・モバイル Web 向けフック

- 高頻度のイベント（`scroll`、`resize`、`visualViewport` の変化）は約 16ms でスロットリングし、値が変わっていなければ更新をスキップし、緊急でない更新には `startTransition` を使います
- ハンドラーが `preventDefault` を呼ばない場合はパッシブイベントリスナーを使います
- 1 つのプラットフォームに決め打ちせず、プラットフォームの違いを考慮します

  | 機能                       | iOS                                  | Android                    |
  | -------------------------- | ------------------------------------ | -------------------------- |
  | `visualViewport.offsetTop` | キーボードが表示されると負の値になる | 基本的に 0 のまま          |
  | キーボードの挙動           | ビューポートが押し上げられる         | レイアウトがリサイズされる |

- jsdom はビジュアルビューポートやオンスクリーンキーボードを再現できないため、これらのフックはテストに加えて実機の iOS Safari と Android Chrome でも確認します
