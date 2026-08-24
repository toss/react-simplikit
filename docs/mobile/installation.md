---
description: How to install react-simplikit/mobile
---

# Installation

You can install `react-simplikit/mobile` from [npm](https://npmjs.com/package/react-simplikit/mobile) using your favorite package manager.

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

## Requirements

- React 18 or higher
- TypeScript 4.7 or higher (recommended)

## Usage

Import hooks directly from the package:

```tsx
import { useKeyboardHeight, useAvoidKeyboard } from 'react-simplikit/mobile';
```

All hooks are tree-shakeable, so you only include what you use in your bundle.
