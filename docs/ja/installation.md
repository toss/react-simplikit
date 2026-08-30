---
description: react-simplikit のインストール方法
---

# インストール

お好みのパッケージマネージャーを使って、[npm](https://npmjs.com/package/react-simplikit) から `react-simplikit` をインストールできます。

::: code-group

```sh [npm]
npm install react-simplikit
```

```sh [pnpm]
pnpm add react-simplikit
```

```sh [yarn]
yarn add react-simplikit
```

```sh [bun]
bun add react-simplikit
```

:::

## 要件

- React 18 以上
- TypeScript 4.7 以上（推奨）

## 使い方

パッケージから直接フックを import してください。

```tsx
import { useToggle } from 'react-simplikit';
```

すべてのフックはツリーシェイキング対応なので、実際に使用するものだけがバンドルに含まれます。

## `@react-simplikit/mobile` からの移行

`@react-simplikit/mobile` が export していたものは、すべて `react-simplikit` から提供されるようになりました。codemod が import 文と `package.json` の依存関係をその場で書き換えます。

```sh
npx react-simplikit-codemod mobile-to-root
```

その後、変更されたファイルに対してフォーマッターまたはリンターの fix を実行してください。import の順序ルールでは `react-simplikit` と `@react-simplikit/mobile` の並ぶ位置が異なるからです。
