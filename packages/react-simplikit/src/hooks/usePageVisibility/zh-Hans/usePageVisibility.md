# usePageVisibility

`usePageVisibility` 是一个检测页面可见性变化 的 React Hook。它使用 Page Visibility API 监控用户何时切换标签页或最小化浏览器。它适用于暂停或恢复动画、视频或后台任务，以提升性能并改善用户体验。

## 接口

```ts
function usePageVisibility(): PageVisibility;
```

### 参数

此函数不接受任何参数。

### 返回值

<Interface
  name=""
  type="PageVisibility"
  description="页面可见性信息"
  :nested="[
    {
      name: 'isVisible',
      type: 'boolean',
      required: false,
      description:
        '如果页面当前对用户可见，则为 <code>true</code>。',
    },
    {
      name: 'visibilityState',
      type: '\'visible\' | \'hidden\'',
      required: false,
      description: '当前的可见性状态。',
    },
  ]"
/>

## 示例

### 视频播放器控制

```tsx
// 当用户切换到其他标签页时自动暂停视频
function VideoPlayer() {
  const { isVisible } = usePageVisibility();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // 当标签页隐藏时暂停视频
    if (!isVisible) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  return <video ref={videoRef} src="video.mp4" />;
}
```

### 分析跟踪

```tsx
// 跟踪用户何时离开或返回页面
function Analytics() {
  const { isVisible, visibilityState } = usePageVisibility();

  useEffect(() => {
    if (visibilityState === 'hidden') {
      // 跟踪用户离开页面
      analytics.track('page_hidden');
    }
  }, [visibilityState]);

  return null;
}
```

## 备注

- **服务端渲染安全性**：Page Visibility API 在服务端渲染期间不可用，因此该 Hook 返回安全的默认值 `{ isVisible: true, visibilityState: 'visible' }`。
- **浏览器支持**：每个现代浏览器都支持 Page Visibility API。详情请参阅 [MDN 浏览器兼容性表](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API#browser_compatibility)。
- **性能**：该 Hook 监听原生的 `visibilitychange` 事件，因此不引入轮询，开销可忽略不计。
- **可见性状态**：只返回 `'visible'` 和 `'hidden'`；已弃用的 `'prerender'` 状态被排除在外。
