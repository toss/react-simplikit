---
description: '@react-simplikit/mobile のインストール方法'
---

# インストール

お好みのパッケージマネージャーを使って、[npm](https://npmjs.com/package/@react-simplikit/mobile) から `@react-simplikit/mobile` をインストールできます。

::: code-group

```sh [npm]
npm install @react-simplikit/mobile
```

```sh [pnpm]
pnpm add @react-simplikit/mobile
```

```sh [yarn]
yarn add @react-simplikit/mobile
```

```sh [bun]
bun add @react-simplikit/mobile
```

:::

## 要件

- React 18 以上
- TypeScript 4.7 以上（推奨）

## 使い方

パッケージから直接フックを import してください。

```tsx
import { useKeyboardHeight, useAvoidKeyboard } from '@react-simplikit/mobile';
```

すべてのフックはツリーシェイキング対応なので、実際に使用するものだけがバンドルに含まれます。
