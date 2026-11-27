---
description: 将 react-simplikit 从 v0 升级到 v1
---

# 迁移到 v1

v1 让 Hook 的接口更容易预测：时间选项的名称带上单位，回调和延迟放进同一个选项对象，状态 Hook 返回 `[value, actions]`。这些改动大多是机械性的，所以 codemod 会帮你完成改写。

## 1. 运行 codemod

先提交或 stash 你的改动，然后在项目根目录运行：

```sh
npx @react-simplikit/codemod v0-to-v1
```

加上 `--dry-run` 可以只查看改动而不写入文件。codemod 只改写从 `react-simplikit` 导入的调用，运行两次也不会再产生改动。

无法安全改写的代码（例如通过变量传入的选项）会保持原样，并连同文件和行号列在 `manual-review` 下。手动修复这些代码后，再升级：

```sh
npm install react-simplikit@^1
```

## 2. codemod 会改写的内容

| 改动                                              | v0                                                                      | v1                                                                          |
| ------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `useBooleanState` 返回 `[value, actions]`         | `const [open, setTrue, setFalse, toggle] = useBooleanState()`           | `const [open, { setTrue, setFalse, toggle }] = useBooleanState()`           |
| `useStorageState` 返回 `[value, actions]`         | `const [token, setToken, refresh] = useStorageState('token')`           | `const [token, { setValue: setToken, refresh }] = useStorageState('token')` |
| `useCounter` 返回 `[value, actions]`              | `const { count, increment } = useCounter(0)`                            | `const [count, { increment }] = useCounter(0)`                              |
| `useInterval` 接收一个选项对象                    | `useInterval(poll, 1000)`                                               | `useInterval({ onTick: poll, delayMs: 1000 })`                              |
| `useTimeout` 接收一个选项对象                     | `useTimeout(close, 3000)`                                               | `useTimeout({ onTimeout: close, delayMs: 3000 })`                           |
| 时间选项以 `Ms` 结尾                              | `useDebouncedCallback({ timeThreshold: 300 })`                          | `useDebouncedCallback({ debounceMs: 300 })`                                 |
|                                                   | `useThrottledCallback({ timeThreshold: 300 })`                          | `useThrottledCallback({ throttleMs: 300 })`                                 |
|                                                   | `useImpressionRef({ timeThreshold })`, `<ImpressionArea timeThreshold>` | `useImpressionRef({ timeThresholdMs })`, `<ImpressionArea timeThresholdMs>` |
|                                                   | `useLongPress(fn, { delay })`                                           | `useLongPress(fn, { delayMs })`                                             |
|                                                   | `useAvoidKeyboard({ transitionDuration })`                              | `useAvoidKeyboard({ transitionDurationMs })`                                |
| 节流 Hook 的 `edges` 改为 `leading` 和 `trailing` | `useThrottle(fn, 100, { edges: ['leading'] })`                          | `useThrottle(fn, 100, { leading: true, trailing: false })`                  |
| `useDoubleClick` 的选项改名                       | `useDoubleClick({ click, doubleClick, delay })`                         | `useDoubleClick({ onClick, onDoubleClick, delayMs })`                       |

## 3. 需要手动检查的内容

下面这些改动不改变代码写法，但会改变行为，所以 codemod 无法替你完成。

### 浏览器 Hook 从固定值开始

`useScrollDirection`、`useVisualViewport`、`useNetworkStatus`、`usePageVisibility` 和 `useSafeAreaInset` 在客户端首次渲染时返回与服务端相同的值，浏览器的值在挂载后才会更新。这修复了 hydration 不匹配的问题，但在首次渲染时读取浏览器值的代码，现在会得到下表中的值。

| Hook                 | 首次渲染                                          |
| -------------------- | ------------------------------------------------- |
| `useScrollDirection` | `position: 0`                                     |
| `useVisualViewport`  | `viewport: null`                                  |
| `useNetworkStatus`   | `{}`                                              |
| `usePageVisibility`  | `{ isVisible: true, visibilityState: 'visible' }` |
| `useSafeAreaInset`   | `{ top: 0, bottom: 0, left: 0, right: 0 }`        |

### `useStorageState` 会检查 JSON 值

不传 `serializer` 和 `deserializer` 时，如果设置的值无法用 JSON 表示，例如 `Date`、`Map`、函数或 `NaN`，现在会抛出错误并指出该值所在的路径，而不是存入被 JSON 改动过的值。存储这类值时，请同时传入 `serializer` 和 `deserializer`。另外，`refresh` 现在只会重新读取存储，不再写入存储。

### `subscribeKeyboardHeight` 会立即调用回调

现在订阅后回调会立刻执行一次。传入 `immediate: false` 可以保持 v0 的行为。

## 已弃用的名称

这些名称在 v1 中仍然可用，只会在编辑器中显示弃用提示。方便时再改名即可。

| 已弃用                     | 改用                      |
| -------------------------- | ------------------------- |
| `useCallbackOncePerRender` | `useCallbackOnce`         |
| `useVisibilityEvent`       | `usePageVisibilityEffect` |

完整的改动列表见 [v1.0.0 路线图](https://github.com/toss/react-simplikit/issues/533)和[更新日志](https://github.com/toss/react-simplikit/blob/main/packages/react-simplikit/CHANGELOG.md)。
