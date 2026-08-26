---
description: How to install react-simplikit for mobile web
---

# Installation

You can install `react-simplikit` from [npm](https://npmjs.com/package/react-simplikit) using your favorite package manager.

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
import { useKeyboardHeight, useAvoidKeyboard } from 'react-simplikit';
```

All hooks are tree-shakeable, so you only include what you use in your bundle.
