---
description: react-simplikit 설치 방법
---

# 설치하기

좋아하는 패키지 매니저를 사용하여 [npm](https://npmjs.com/package/react-simplikit)에서 `react-simplikit`을 설치할 수 있어요.

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

## 요구사항

- React 18 이상
- TypeScript 4.7 이상 (권장)

## 사용법

패키지에서 직접 훅을 import하세요:

```tsx
import { useToggle } from 'react-simplikit';
```

모든 훅은 트리 쉐이킹이 가능하므로, 번들에는 사용하는 것만 포함돼요.
