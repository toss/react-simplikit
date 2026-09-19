# useScrollDirection

`useScrollDirection` 是一个检测滚动方向 的 React Hook。它返回滚动方向（向上/向下）和当前的滚动位置。默认进行节流（50ms）以优化性能。

## 接口

```ts
function useScrollDirection(
  options?: UseScrollDirectionOptions
): ScrollDirectionState;
```

### 参数

<Interface
  name="options"
  type="UseScrollDirectionOptions"
  description="配置选项。"
  :nested="[
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '50',
      description: '节流间隔（毫秒）。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="ScrollDirectionState"
  description="包含滚动方向和位置的对象。"
  :nested="[
    {
      name: 'direction',
      type: '\\'up\\' | \\'down\\' | null',
      required: false,
      description:
        '当前的滚动方向。在首次渲染时为 <code>null</code>。',
    },
    {
      name: 'position',
      type: 'number',
      required: false,
      description: '当前的垂直滚动位置（像素）。',
    },
  ]"
/>

## 示例

```tsx
function Header() {
  const { direction, position } = useScrollDirection();

  // 向下滚动时隐藏头部
  const isHidden = direction === 'down' && position > 100;

  return <header className={isHidden ? 'hidden' : 'visible'}>My Header</header>;
}
```

### 自定义节流间隔

```tsx
function MyComponent() {
  // 每 100ms 更新一次，而非默认的 50ms
  const { direction, position } = useScrollDirection({ throttleMs: 100 });

  return (
    <div>
      Scrolling {direction}! Position: {position}px
    </div>
  );
}
```

## 备注

- **服务端渲染安全性**：该 Hook 在读取 `window.scrollY` 之前会检查 `isServer()`，因此在服务端渲染期间是安全的。
- **性能**：滚动事件会被节流，以限制处理的频率（默认：50ms）。
- **被动监听器**：滚动监听器以 `{ passive: true }` 注册，以获得更流畅的滚动效果。
- **清理**：事件监听器和节流定时器会在组件卸载时被移除。
- **浏览器支持**：需要在提供 `window` 和 `scrollY` 的浏览器环境中运行。