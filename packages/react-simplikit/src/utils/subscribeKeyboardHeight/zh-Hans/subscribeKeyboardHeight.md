# subscribeKeyboardHeight

`subscribeKeyboardHeight` 是一个订阅屏幕键盘高度变化的工具函数。

每当键盘高度可能变化时（包括键盘出现、消失或尺寸变化），传入的回调都会被调用。

在内部，该函数同时监听 Visual Viewport 的 `resize` 和 `scroll` 事件：

- `resize`：视觉视口高度变化时触发
- `scroll`：视觉视口偏移变化时触发（对 iOS 很重要，因为视口可能在尺寸不变的情况下发生位移）

性能优化：

- 默认节流（16ms，约 60fps），避免回调被过于频繁地调用
- 高度未变化时跳过回调（去重）

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
      description:
        '一个会以最新键盘高度（像素）作为参数被调用的函数。',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '若为 true，则注册时会立即以当前键盘高度调用一次回调。',
    },
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '16',
      description: '节流间隔（毫秒）。',
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
      description:
        '取消所有监听，不再接收键盘高度更新。',
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

// Later, when cleanup is needed
unsubscribe();
```
