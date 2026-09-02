---
description: '모바일 웹을 위한 react-simplikit 설치 방법'
---

# 설치하기

좋아하는 패키지 매니저를 사용하여 [npm](https://npmjs.com/package/react-simplikit)에서 `react-simplikit`을 설치할 수 있어요. 모바일 유틸리티도 같은 패키지에 포함돼 있어요.

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
import { useKeyboardHeight, useAvoidKeyboard } from 'react-simplikit';
```

모든 훅은 트리 쉐이킹이 가능하므로, 번들에는 사용하는 것만 포함돼요.

## `@react-simplikit/mobile`에서 마이그레이션하기

`@react-simplikit/mobile`이 export하던 것은 이제 모두 `react-simplikit`에서 제공돼요. codemod가 import 문과 `package.json`의 의존성을 파일에서 바로 고쳐 써요:

```sh
npx react-simplikit-codemod mobile-to-root
```

그다음 변경된 파일에 포매터나 린터 fix를 실행하세요. import 정렬 규칙이 `react-simplikit`과 `@react-simplikit/mobile`을 서로 다른 위치에 두기 때문이에요.
