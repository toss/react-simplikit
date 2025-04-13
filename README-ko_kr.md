![react-simplikit](src/public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/slash/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit)

[English](./README.md) | 한국어

`react-simplikit`은 React 환경에서 유용하게 사용할 수 있는 다양한 유틸리티를 제공하는 가볍고 강력한 라이브러리예요.

- `react-simplikit`은 의존성이 없어서 매우 가벼워요.
- 100% 테스트 커버리지를 통해 신뢰성을 보장해요.
- JSDoc 과 풍부한 문서, 예제를 제공해서 어떤 개발자도 쉽게 사용할 수 있어요.

## 예시

```tsx
// import from '@es-toolkit/es-toolkit' in jsr.
import { useBooleanState } from 'react-simplikit';

function Component() {
  // useBooleanState 훅을 사용해 상태를 관리해요.
  const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] = useBooleanState(false);

  return (
    <div>
      <p>Bottom Sheet 상태: {open ? '열림' : '닫힘'}</p>
      <button onClick={openBottomSheet}>열기</button>
      <button onClick={closeBottomSheet}>닫기</button>
      <button onClick={toggleBottomSheet}>토글</button>
    </div>
  );
}
```

## 기여하기

커뮤니티에 있는 모든 분들에게 기여를 환영해요. 아래에 작성되어 있는 기여 가이드를 확인하세요.

[CONTRIBUTING](./src/docs/ko/contributing.md)

## 라이선스

MIT © Viva Republica, Inc. 자세한 내용은 [LICENSE](./LICENSE)를 참고하세요.
