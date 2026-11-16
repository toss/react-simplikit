---
description: react-simplikit v0에서 v1로 업그레이드하기
---

# v1로 업그레이드하기

v1에서는 훅 인터페이스를 예측하기 쉽게 정리했어요. 시간 옵션 이름에 단위를 붙이고, 콜백과 지연 시간을 옵션 객체 하나로 받고, 상태 훅은 `[value, actions]`를 반환해요. 대부분 기계적으로 바꿀 수 있는 변경이라 codemod가 대신 고쳐 줘요.

## 1. codemod 실행하기

먼저 변경 사항을 커밋하거나 stash한 뒤, 프로젝트 루트에서 실행해요.

```sh
npx @react-simplikit/codemod v0-to-v1
```

`--dry-run`을 붙이면 파일을 고치지 않고 바뀔 내용만 보여 줘요. codemod는 `react-simplikit`에서 import한 호출만 고치고, 두 번 실행해도 더 바뀌는 것은 없어요.

옵션을 변수로 넘기는 경우처럼 안전하게 고칠 수 없는 코드는 고치지 않고, `manual-review` 목록에 파일과 줄 번호를 함께 보여 줘요. 이 부분을 직접 고친 뒤 업그레이드하세요.

```sh
npm install react-simplikit@^1
```

## 2. codemod가 고치는 것

| 변경                                                  | v0                                                                      | v1                                                                          |
| ----------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `useBooleanState`가 `[value, actions]`를 반환         | `const [open, setTrue, setFalse, toggle] = useBooleanState()`           | `const [open, { setTrue, setFalse, toggle }] = useBooleanState()`           |
| `useStorageState`가 `[value, actions]`를 반환         | `const [token, setToken, refresh] = useStorageState('token')`           | `const [token, { setValue: setToken, refresh }] = useStorageState('token')` |
| `useCounter`가 `[value, actions]`를 반환              | `const { count, increment } = useCounter(0)`                            | `const [count, { increment }] = useCounter(0)`                              |
| `useInterval`이 옵션 객체 하나를 받음                 | `useInterval(poll, 1000)`                                               | `useInterval({ onTick: poll, delayMs: 1000 })`                              |
| `useTimeout`이 옵션 객체 하나를 받음                  | `useTimeout(close, 3000)`                                               | `useTimeout({ onTimeout: close, delayMs: 3000 })`                           |
| 시간 옵션 이름이 `Ms`로 끝남                          | `useDebouncedCallback({ timeThreshold: 300 })`                          | `useDebouncedCallback({ debounceMs: 300 })`                                 |
|                                                       | `useThrottledCallback({ timeThreshold: 300 })`                          | `useThrottledCallback({ throttleMs: 300 })`                                 |
|                                                       | `useImpressionRef({ timeThreshold })`, `<ImpressionArea timeThreshold>` | `useImpressionRef({ timeThresholdMs })`, `<ImpressionArea timeThresholdMs>` |
|                                                       | `useLongPress(fn, { delay })`                                           | `useLongPress(fn, { delayMs })`                                             |
|                                                       | `useAvoidKeyboard({ transitionDuration })`                              | `useAvoidKeyboard({ transitionDurationMs })`                                |
| 스로틀 훅의 `edges`가 `leading`과 `trailing`으로 바뀜 | `useThrottle(fn, 100, { edges: ['leading'] })`                          | `useThrottle(fn, 100, { leading: true, trailing: false })`                  |
| `useDoubleClick`의 옵션 이름이 바뀜                   | `useDoubleClick({ click, doubleClick, delay })`                         | `useDoubleClick({ onClick, onDoubleClick, delayMs })`                       |

## 3. 직접 확인할 것

아래 변경은 코드는 그대로인데 동작이 달라져요. 그래서 codemod로 고칠 수 없어요.

### 고정된 값으로 시작하는 브라우저 훅

`useScrollDirection`, `useVisualViewport`, `useNetworkStatus`, `usePageVisibility`, `useSafeAreaInset`은 클라이언트의 첫 렌더링에서 서버와 같은 값을 반환하고, 브라우저 값은 마운트한 뒤에 들어와요. 덕분에 hydration mismatch가 사라지지만, 첫 렌더링에서 브라우저 값을 읽던 코드는 이제 아래 표의 값을 받아요.

| 훅                   | 첫 렌더링 값                                      |
| -------------------- | ------------------------------------------------- |
| `useScrollDirection` | `position: 0`                                     |
| `useVisualViewport`  | `viewport: null`                                  |
| `useNetworkStatus`   | `{}`                                              |
| `usePageVisibility`  | `{ isVisible: true, visibilityState: 'visible' }` |
| `useSafeAreaInset`   | `{ top: 0, bottom: 0, left: 0, right: 0 }`        |

### `useStorageState`의 JSON 값 검사

`serializer`와 `deserializer` 없이 `Date`, `Map`, 함수, `NaN`처럼 JSON으로 담을 수 없는 값을 설정하면, 이제 JSON 변환으로 형태가 바뀐 값을 저장하지 않고 문제가 된 값의 경로를 담아 에러를 던져요. 이런 값은 `serializer`와 `deserializer`를 함께 넘겨서 저장하세요. 또 `refresh`는 이제 저장소를 다시 읽기만 하고 저장소에 쓰지 않아요.

### 구독하자마자 콜백을 실행하는 `subscribeKeyboardHeight`

이제 구독하자마자 콜백이 한 번 실행돼요. v0처럼 동작하게 하려면 `immediate: false`를 넘기세요.

## deprecated된 이름

아래 이름은 v1에서도 그대로 동작하고, 에디터에 deprecated 안내만 보여요. 편할 때 바꾸면 돼요.

| deprecated                 | 대신 쓸 이름              |
| -------------------------- | ------------------------- |
| `useCallbackOncePerRender` | `useCallbackOnce`         |
| `useVisibilityEvent`       | `usePageVisibilityEffect` |

전체 변경 사항은 [v1.0.0 로드맵](https://github.com/toss/react-simplikit/issues/533)과 [변경 기록](https://github.com/toss/react-simplikit/blob/main/packages/react-simplikit/CHANGELOG.md)에서 볼 수 있어요.
