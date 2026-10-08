# useThrottle

`useThrottle` は、コールバック関数をスロットリングする React フックです。
スクロールやリサイズのイベントを処理する場合など、関数の呼び出し頻度を制限したいときに便利です。

## インターフェース

```ts
function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  throttleMs: number,
  options?: ThrottleOptions
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
  name="throttleMs"
  type="number"
  description="呼び出しを制限する間隔（ミリ秒単位）。"
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="スロットリングの動作を制御するオプション。"
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code> の場合、スロットリング区間の開始時に即座に呼び出せます。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code> の場合、遅延時間の経過後に、待機中の呼び出しを最新の引数で実行できます。',
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
  { leading: true, trailing: true }
);

useEffect(() => {
  window.addEventListener('scroll', throttledScroll);
  return () => {
    window.removeEventListener('scroll', throttledScroll);
    throttledScroll.cancel();
  };
}, [throttledScroll]);
```
