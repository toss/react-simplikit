---
description: react-simplikit を v0 から v1 にアップグレードする方法
---

# v1 への移行

v1 では、フックのインターフェースを予測しやすく整理しました。時間のオプション名には単位が付き、コールバックと遅延時間は 1 つのオプションオブジェクトで渡し、状態を持つフックは `[value, actions]` を返します。ほとんどは機械的な変更なので、codemod が書き換えてくれます。

## 1. codemod を実行する

先に変更をコミットするか stash してから、プロジェクトのルートで実行します。

```sh
npx @react-simplikit/codemod v0-to-v1
```

`--dry-run` を付けると、ファイルを書き換えずに変更内容だけを表示します。codemod は `react-simplikit` から import した呼び出しだけを書き換え、2 回実行しても何も変わりません。

オプションを変数で渡している場合など、安全に書き換えられないコードはそのまま残し、ファイルと行番号とともに `manual-review` に一覧表示します。それらを手で直してから、アップグレードしてください。

```sh
npm install react-simplikit@^1
```

## 2. codemod が書き換えるもの

| 変更                                                           | v0                                                                      | v1                                                                          |
| -------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `useBooleanState` が `[value, actions]` を返す                 | `const [open, setTrue, setFalse, toggle] = useBooleanState()`           | `const [open, { setTrue, setFalse, toggle }] = useBooleanState()`           |
| `useStorageState` が `[value, actions]` を返す                 | `const [token, setToken, refresh] = useStorageState('token')`           | `const [token, { setValue: setToken, refresh }] = useStorageState('token')` |
| `useCounter` が `[value, actions]` を返す                      | `const { count, increment } = useCounter(0)`                            | `const [count, { increment }] = useCounter(0)`                              |
| `useInterval` が 1 つのオプションオブジェクトを受け取る        | `useInterval(poll, 1000)`                                               | `useInterval({ onTick: poll, delayMs: 1000 })`                              |
| `useTimeout` が 1 つのオプションオブジェクトを受け取る         | `useTimeout(close, 3000)`                                               | `useTimeout({ onTimeout: close, delayMs: 3000 })`                           |
| 時間のオプション名が `Ms` で終わる                             | `useDebouncedCallback({ timeThreshold: 300 })`                          | `useDebouncedCallback({ debounceMs: 300 })`                                 |
|                                                                | `useThrottledCallback({ timeThreshold: 300 })`                          | `useThrottledCallback({ throttleMs: 300 })`                                 |
|                                                                | `useImpressionRef({ timeThreshold })`, `<ImpressionArea timeThreshold>` | `useImpressionRef({ timeThresholdMs })`, `<ImpressionArea timeThresholdMs>` |
|                                                                | `useLongPress(fn, { delay })`                                           | `useLongPress(fn, { delayMs })`                                             |
|                                                                | `useAvoidKeyboard({ transitionDuration })`                              | `useAvoidKeyboard({ transitionDurationMs })`                                |
| スロットルフックの `edges` が `leading` と `trailing` に変わる | `useThrottle(fn, 100, { edges: ['leading'] })`                          | `useThrottle(fn, 100, { leading: true, trailing: false })`                  |
| `useDoubleClick` のオプション名が変わる                        | `useDoubleClick({ click, doubleClick, delay })`                         | `useDoubleClick({ onClick, onDoubleClick, delayMs })`                       |

## 3. 手で確認すること

次の変更は、コードはそのままでも動作が変わります。そのため codemod では書き換えられません。

### ブラウザのフックが固定値から始まる

`useScrollDirection`、`useVisualViewport`、`useNetworkStatus`、`usePageVisibility`、`useSafeAreaInset` は、クライアントの最初のレンダリングでサーバーと同じ値を返し、ブラウザの値はマウント後に反映されます。これでハイドレーションのミスマッチはなくなりますが、最初のレンダリングでブラウザの値を読んでいたコードは、下の表の値を受け取るようになります。

| フック               | 最初のレンダリング                                |
| -------------------- | ------------------------------------------------- |
| `useScrollDirection` | `position: 0`                                     |
| `useVisualViewport`  | `viewport: null`                                  |
| `useNetworkStatus`   | `{}`                                              |
| `usePageVisibility`  | `{ isVisible: true, visibilityState: 'visible' }` |
| `useSafeAreaInset`   | `{ top: 0, bottom: 0, left: 0, right: 0 }`        |

### `useStorageState` が JSON の値を検査する

`serializer` と `deserializer` を渡さずに、`Date`、`Map`、関数、`NaN` など JSON で表せない値を設定すると、元とは異なる値を黙って保存する代わりに、その値のパスを含むエラーを投げるようになりました。こうした値は `serializer` と `deserializer` の両方を渡して保存してください。また、`refresh` はストレージを読み直すだけになり、ストレージへの書き込みは行いません。

### `subscribeKeyboardHeight` がすぐにコールバックを呼ぶ

購読した直後にコールバックが 1 回実行されるようになりました。v0 と同じ動作にするには `immediate: false` を渡してください。

## 非推奨の名前

次の名前は v1 でもそのまま動作し、エディタに非推奨の表示が出るだけです。都合のよいときに書き換えてください。

| 非推奨                     | 代わりに使う名前          |
| -------------------------- | ------------------------- |
| `useCallbackOncePerRender` | `useCallbackOnce`         |
| `useVisibilityEvent`       | `usePageVisibilityEffect` |

変更の全体は [v1.0.0 のロードマップ](https://github.com/toss/react-simplikit/issues/533)と[変更履歴](https://github.com/toss/react-simplikit/blob/main/packages/react-simplikit/CHANGELOG.md)で確認できます。
