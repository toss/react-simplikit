# subscribeKeyboardHeight

`subscribeKeyboardHeight` 是一个用于订阅屏幕键盘高度变化的工具函数。提供的回调函数会在键盘高度每次发生变化时被调用，包括键盘出现、消失或尺寸改变等情况。在内部，该函数会同时监听 Visual Viewport 的 `resize` 和 `scroll` 事件。

- `resize`：视觉视口高度变化时触发
- `scroll`：视觉视口偏移量变化时触发（在 iOS 上视口可以在不调整大小的情况下移动，因此这一点很重要）

**性能优化**

- 默认进行节流（16ms，约 60fps），以防止过多的回调调用
- 高度未发生变化时跳过回调

## 接口

```ts
function subscribeKeyboardHeight(
  options: SubscribeKeyboardHeightOptions
): SubscribeKeyboardHeightResult;
```

### 参数

<Interface
  required
  name="options"
  type="SubscribeKeyboardHeightOptions"
  description="配置选项"
  :nested="[
    {
      name: 'options.callback',
      type: '(height: number) => void',
      required: true,
      description: '以更新后的键盘高度（像素为单位）调用的函数。',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description: '为 true 时，回调会立即以当前键盘高度被调用。',
    },
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '16',
      description: '以毫秒为单位的节流间隔。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="SubscribeKeyboardHeightResult"
  description="包含取消订阅函数的对象。"
  :nested="[
    {
      name: 'unsubscribe',
      type: '() => void',
      required: false,
      description: '取消所有监听器的订阅，并停止键盘高度更新。',
    },
  ]"
/>

## 示例

```tsx
const { unsubscribe } = subscribeKeyboardHeight({
  callback: height => {
    footer.style.paddingBottom = `${height}px`;
  },
  immediate: true,
});

// 之后需要清理时
unsubscribe();
```
