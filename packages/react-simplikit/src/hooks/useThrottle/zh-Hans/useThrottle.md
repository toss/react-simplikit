# useThrottle

`useThrottle` 是一个创建回调函数节流版本的 React Hook。它适用于限制函数的调用频率，例如在处理滚动或调整大小事件时。

## 接口

```ts
function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  throttleMs: number,
  options?: ThrottleOptions
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
  name="throttleMs"
  type="number"
  description="将调用节流到的毫秒数。"
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="用于控制节流行为的选项。"
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '如果为 <code>true</code>，则允许在节流时间窗口开始时立即调用。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '如果为 <code>true</code>，则允许待执行的调用在延迟结束后以最新参数运行。',
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
