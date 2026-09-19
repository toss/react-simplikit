# useThrottle

`useThrottle` 是一个创建回调函数节流版本 的 React Hook。它适用于限制函数的调用频率，例如在处理滚动或调整大小事件时。

## 接口

```ts
function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options?: { edges?: Array<'leading' | 'trailing'> }
): F & { cancel: () => void };
```

### 参数

<Interface
  required
  name="callback"
  type="F"
  description="要被节流的函数。"
/>

<Interface
  required
  name="wait"
  type="number"
  description="将调用节流到的毫秒数。"
/>

<Interface
  name="options"
  type="{ edges?: Array<'leading' | 'trailing'> }"
  description="用于控制节流行为的选项。"
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        '一个可选的数组，用于指定应在领先边缘、落后边缘或两者处调用该函数。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="返回节流后的函数，并带有一个用于取消待执行调用的 <code>cancel</code> 方法。"
/>

## 示例

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