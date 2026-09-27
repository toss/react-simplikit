# useAvoidKeyboard

`useAvoidKeyboard` 是一个帮助固定在底部的元素避开屏幕键盘的 React Hook。它返回一个可以应用到 `position: fixed` 元素上的 CSS 样式，当键盘出现时平滑地将元素移动到键盘上方。

## 接口

```ts
function useAvoidKeyboard(
  options?: UseAvoidKeyboardOptions
): UseAvoidKeyboardResult;
```

### 参数

<Interface
  name="options"
  type="UseAvoidKeyboardOptions"
  description="配置选项。"
  :nested="[
    {
      name: 'options.safeAreaBottom',
      type: 'number',
      required: false,
      defaultValue: '0',
      description:
        '键盘隐藏时的基础底部偏移量（像素）。用于考虑 iPhone 主页指示器区域。',
    },
    {
      name: 'options.transitionDuration',
      type: 'number',
      required: false,
      defaultValue: '200',
      description: '过渡时长（毫秒），用于平滑动画。',
    },
    {
      name: 'options.transitionTimingFunction',
      type: 'CSSProperties[\'transitionTimingFunction\']',
      required: false,
      defaultValue: '\'ease-out\'',
      description: '动画的过渡时间函数。',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description: '若为 true，则在挂载时获取初始键盘高度。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="UseAvoidKeyboardResult"
  description="一个包含键盘避让 CSS 样式的对象。"
  :nested="[
    {
      name: 'style',
      type: 'CSSProperties',
      required: false,
      description:
        '应用到固定底部元素上的 CSS 样式对象。包含 <code>transform</code> 和 <code>transition</code> 属性。',
    },
  ]"
/>

## 示例

```tsx
function FixedBottomCTA() {
  const { style } = useAvoidKeyboard();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```

```tsx
// With safe area bottom offset (e.g., for iPhone home indicator)
function FixedBottomCTA() {
  const { style } = useAvoidKeyboard({ safeAreaBottom: 34 });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```
