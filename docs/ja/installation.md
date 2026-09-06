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
