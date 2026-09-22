# useVisualViewport

`useVisualViewport` 是一个跟踪 Visual Viewport 变化 的 React Hook。它返回移动 WebView 中实际可见的区域，当键盘出现或用户缩放、滚动时，该区域会发生变化。

## 接口

```ts
function useVisualViewport(): { viewport: VisualViewportState | null };
```

### 参数

此函数不接受任何参数。

### 返回值

<Interface
  name=""
  type="{ viewport: VisualViewportState | null }"
  description="包含 Visual Viewport 状态的对象。"
  :nested="[
    {
      name: 'viewport',
      type: 'VisualViewportState | null',
      required: false,
      description:
        'Visual Viewport 状态对象，如果不支持则为 <code>null</code>（服务端渲染或没有 Visual Viewport API 的浏览器）。',
    },
    {
      name: 'viewport.width',
      type: 'number',
      required: false,
      description: '视口宽度（像素）。',
    },
    {
      name: 'viewport.height',
      type: 'number',
      required: false,
      description: '视口高度（像素）。',
    },
    {
      name: 'viewport.offsetLeft',
      type: 'number',
      required: false,
      description:
        '视口相对于布局视口的左侧偏移（像素）。通常为 0，除非发生水平滚动或平移。',
    },
    {
      name: 'viewport.offsetTop',
      type: 'number',
      required: false,
      description:
        '视口相对于布局视口的顶部偏移（像素）。在 iOS 上当键盘出现时会变为负值（例如 -300px 表示 300px 高的键盘），因此可使用 <code>-offsetTop</code> 作为键盘高度。在 Android 上通常保持为 0。',
    },
    {
      name: 'viewport.scale',
      type: 'number',
      required: false,
      description:
        '捏合缩放的比例因子。1.0 表示未缩放，大于 1.0 表示放大，小于 1.0 表示缩小（较少见，取决于视口设置）。',
    },
  ]"
/>

## 示例

```tsx
function CustomLayout() {
  const { viewport } = useVisualViewport();

  // 始终先检查是否为 null
  if (!viewport) {
    return <div>Visual Viewport not supported</div>;
  }

  const { width, height, offsetTop, scale } = viewport;

  // 当用户放大时隐藏浮动 UI
  const showFloatingUI = scale <= 1.3;

  return (
    <div style={{ height }}>
      {showFloatingUI && <FloatingButton />}
      Viewport-aware content
    </div>
  );
}
```

### 检测缩放

```tsx
const { viewport } = useVisualViewport();
if (viewport && viewport.scale > 1.3) {
  // 当用户放大时隐藏浮动 UI
  setShowFloatingButton(false);
}
```

## 备注

- **服务端渲染安全性**：在服务端渲染期间以及在没有 Visual Viewport API 的浏览器中，`viewport` 为 `null`。在读取其属性之前，务必检查是否为 `null`。
- **浏览器支持**：现代移动浏览器支持 Visual Viewport API。在缺少该 API 的情况下，该 Hook 返回 `null`。
- **性能**：更新被包裹在 React 的 `startTransition` 中，因此视口变化不会阻塞紧急渲染。
- **更简单的替代方案**：如果只需要键盘高度，可以使用 `useKeyboardHeight()`，它提供了更简单的 API。
- **平台差异**：在 iOS 上，当键盘出现时 `offsetTop` 会变为负值；在 Android 上则通常保持为 0。
- **使用场景**：检测键盘、响应捏合缩放手势、构建感知视口的布局，以及按缩放级别显示或隐藏 UI。
