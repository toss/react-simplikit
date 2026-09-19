# useSafeAreaInset

`useSafeAreaInset` 是一个跟踪安全区域内边距变化 的 React Hook。它返回安全区域的内边距，当屏幕方向变化（例如从竖屏到横屏）时会自动更新。

安全区域的内边距考虑了特定设备上的 UI 元素：

- **顶部**：刘海屏缺口、Dynamic Island 或状态栏
- **底部**：Face ID 设备上的主页指示条
- **左侧/右侧**：横屏模式下屏幕的圆角

## 接口

```ts
function useSafeAreaInset(): SafeAreaInset;
```

### 参数

此函数不接受任何参数。

### 返回值

<Interface
  name=""
  type="SafeAreaInset"
  description="包含四边安全区域内边距的对象。"
  :nested="[
    {
      name: 'top',
      type: 'number',
      required: false,
      description:
        '顶部安全区域内边距（像素）。考虑刘海屏缺口、Dynamic Island 或状态栏。',
    },
    {
      name: 'bottom',
      type: 'number',
      required: false,
      description:
        '底部安全区域内边距（像素）。考虑 Face ID 设备上的主页指示条。',
    },
    {
      name: 'left',
      type: 'number',
      required: false,
      description:
        '左侧安全区域内边距（像素）。考虑横屏模式下的圆角。',
    },
    {
      name: 'right',
      type: 'number',
      required: false,
      description:
        '右侧安全区域内边距（像素）。考虑横屏模式下的圆角。',
    },
  ]"
/>

## 示例

```tsx
function MyComponent() {
  const safeArea = useSafeAreaInset();

  return (
    <div
      style={{
        paddingTop: safeArea.top,
        paddingBottom: safeArea.bottom,
        paddingLeft: safeArea.left,
        paddingRight: safeArea.right,
      }}
    >
      Content that respects safe areas
    </div>
  );
}
```

```tsx
// 在屏幕旋转时自动更新
function RotationAwareHeader() {
  const { top, left, right } = useSafeAreaInset();

  return (
    <header
      style={{
        paddingTop: top,
        paddingLeft: left,
        paddingRight: right,
      }}
    >
      Header content
    </header>
  );
}
```