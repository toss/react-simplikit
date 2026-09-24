# getSafeAreaInset

`getSafeAreaInset` 是一个实用函数，以对象形式返回所有安全区域内边距（单位为像素）。

该函数通过创建一个临时 DOM 元素并读取其计算样式，来获取 CSS `env(safe-area-inset-*)` 的值。

安全区域内边距用于处理设备特有的 UI 元素：

- **top**：刘海屏、灵动岛或状态栏
- **bottom**：Face ID 设备上的主屏幕指示条
- **left/right**：横屏模式下的圆角

典型值（支持 Face ID 的 iPhone，竖屏模式）：

- top：47-59px（刘海屏/灵动岛）
- bottom：34px（主屏幕指示条）
- left/right：0px

## Interface

```ts
function getSafeAreaInset(): SafeAreaInset;
```

### Parameters

该函数不接受任何参数。

### Return Value

<Interface
  name=""
  type="SafeAreaInset"
  description="包含所有四个方向安全区域内边距的对象，如果不可用则全部为 0。"
  :nested="[
    {
      name: 'top',
      type: 'number',
      required: false,
      description: '顶部安全区域内边距（像素）。',
    },
    {
      name: 'bottom',
      type: 'number',
      required: false,
      description: '底部安全区域内边距（像素）。',
    },
    {
      name: 'left',
      type: 'number',
      required: false,
      description: '左侧安全区域内边距（像素）。',
    },
    {
      name: 'right',
      type: 'number',
      required: false,
      description: '右侧安全区域内边距（像素）。',
    },
  ]"
/>

## Example

```tsx
const { top, bottom, left, right } = getSafeAreaInset();

header.style.paddingTop = `${top}px`;
footer.style.paddingBottom = `${bottom}px`;
```
