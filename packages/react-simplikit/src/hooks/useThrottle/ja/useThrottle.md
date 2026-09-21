# useThrottle

`useThrottle` は、コールバック関数をスロットリングする React フックです。
スクロールやリサイズのイベントを処理する場合など、関数の呼び出し頻度を制限したいときに便利です。

## インターフェース

```ts
function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options?: { edges?: Array<'leading' | 'trailing'> }
): F & { cancel: () => void };
```

### パラメータ

<Interface
  required
  name="callback"
  type="F"
  description="スロットリングする関数。"
/>

<Interface
  required
  name="wait"
  type="number"
  description="呼び出しを制限する間隔（ミリ秒単位）。"
/>

<Interface
  name="options"
  type="{ edges?: Array<'leading' | 'trailing'> }"
  description="スロットリングの動作を制御するオプション。"
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        '関数を区間の開始時、終了時、またはその両方で呼び出すかを指定する省略可能な配列。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="待機中の実行をキャンセルする <code>cancel</code> メソッドを備えた、スロットリングされた関数を返します。"
/>

## 使用例

```tsx
const throttledScroll = useThrottle(
  () => {
    console.log('Scroll event');
  },
  200,
  { edges: ['leading', 'trailing'] }
);

useEffect(() => {
  window.addEventListener('scroll', throttledScroll);
  return () => {
    window.removeEventListener('scroll', throttledScroll);
    throttledScroll.cancel();
  };
}, [throttledScroll]);
```
