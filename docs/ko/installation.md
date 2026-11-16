---
description: react-simplikit 설치 방법
---

# 설치하기

사용하는 패키지 매니저로 [npm](https://npmjs.com/package/react-simplikit)에서 `react-simplikit`을 설치할 수 있어요.

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

패키지에서 직접 훅을 import하세요.

```tsx
import { useToggle } from 'react-simplikit';
```

모든 훅은 트리 쉐이킹이 가능해서 번들에는 사용하는 것만 포함돼요.

이어서 [문제별 사용법](/ko/use-cases)에서 전체 예제를 확인하거나 [API 레퍼런스](/ko/reference)를 둘러보세요.

Claude Code나 Codex를 쓴다면 [react-simplikit 플러그인](/ko/ai-integration)을 설치해 보세요. 다른 코딩 에이전트는 에이전트 스킬을 쓰면 돼요. 설치하면 에이전트가 직접 구현하지 않고 `react-simplikit`에서 알맞은 API를 골라 써요.
