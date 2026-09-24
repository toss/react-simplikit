# getSafeAreaInset

`getSafeAreaInset` 是一个以对象形式返回所有安全区域内边距（以像素为单位）的工具函数。

该函数通过创建一个临时 DOM 元素并读取其计算样式，来获取 CSS `env(safe-area-inset-*)` 的值。

安全区域内边距用于为设备特有的 UI 元素留出空间：

- **top**：刘海、灵动岛或状态栏
- **bottom**：Face ID 设备上的主屏幕指示条
- **left/right**：横屏模式下的屏幕圆角

典型值（配备 Face ID 的 iPhone，竖屏模式）：

- top: 47-59px（刘海/灵动岛）
- bottom: 34px（主屏幕指示条）
- left/right: 0px

## 接口

```ts
function getSafeAreaInset(): SafeAreaInset;
```

### 参数

此函数不接受任何参数。

### 返回值

<Interface
  name=""
  type="SafeAreaInset"
  description="包含四边安全区域内边距的对象；不可用时全为 0。"
  :nested="[
    {
      name: 'top',
      type: 'number',
      required: false,
      description: '顶部的安全区域内边距（像素）。',
    },
    {
      name: 'bottom',
      type: 'number',
      required: false,
      description: '底部的安全区域内边距（像素）。',
    },
    {
      name: 'left',
      type: 'number',
      required: false,
      description: '左侧的安全区域内边距（像素）。',
    },
    {
      name: 'right',
      type: 'number',
      required: false,
      description: '右侧的安全区域内边距（像素）。',
    },
  ]"
/>

## 示例

```tsx
const { top, bottom, left, right } = getSafeAreaInset();

header.style.paddingTop = `${top}px`;
footer.style.paddingBottom = `${bottom}px`;
```
