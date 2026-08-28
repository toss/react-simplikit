# 移动端工具函数

一组用于解决移动端 Web 环境中常见 UI 难题的 React Hook。

## 为什么需要移动端工具函数？

移动端 Web 开发有一些桌面端不存在的独特挑战：

- **避让键盘**：软键盘出现时，固定在底部的元素会被遮住
- **滚动方向检测**：让页头和导航栏随滚动显示或隐藏
- **网络状态监控**：根据连接速度调整内容质量
- **页面可见性跟踪**：应用切到后台时暂停视频或数据统计
- **视觉视口变化**：处理移动端浏览器上的缩放、键盘和视口尺寸变化

`react-simplikit` 提供经过实战检验的移动端 Hook，只需极少的配置就能应对这些场景。

## 快速开始

```bash
npm install react-simplikit
```

### CTA 按钮示例

最常见的移动端 UI 模式，就是固定在底部、会移动到键盘上方的按钮：

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

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

### 聊天输入框示例

一个聊天界面，其中的输入框会始终停留在键盘上方：

```tsx
import { useState } from 'react';
import { useAvoidKeyboard } from 'react-simplikit';

function ChatInput() {
  const { style } = useAvoidKeyboard();
  const [message, setMessage] = useState('');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        gap: '8px',
        padding: '12px',
        ...style,
      }}
    >
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ flex: 1 }}
      />
      <button>Send</button>
    </div>
  );
}
```

### 配合安全区域

对于带主屏幕指示条的设备（比如 iPhone），你可以加上安全区域的偏移量：

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

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

## 可用的 Hook

| Hook                                                    | 说明                         |
| ------------------------------------------------------- | ---------------------------- |
| [useAvoidKeyboard](/zh-Hans/hooks/useAvoidKeyboard)     | 把固定元素移动到软键盘上方   |
| [useKeyboardHeight](/zh-Hans/hooks/useKeyboardHeight)   | 返回当前的键盘高度           |
| [useBodyScrollLock](/zh-Hans/hooks/useBodyScrollLock)   | 为模态框和浮层锁定 body 滚动 |
| [useScrollDirection](/zh-Hans/hooks/useScrollDirection) | 检测滚动方向（向上/向下）    |
| [useNetworkStatus](/zh-Hans/hooks/useNetworkStatus)     | 监控网络连接状态             |
| [usePageVisibility](/zh-Hans/hooks/usePageVisibility)   | 跟踪页面可见性状态           |
| [useVisualViewport](/zh-Hans/hooks/useVisualViewport)   | 提供视觉视口的尺寸和偏移量   |

## 路线图

移动端的屏幕很小，而这块小小的空间会带来数量惊人的 UI 难题。元素被软键盘遮住，安全区域因设备而异，用户实际看到的视口也常常和浏览器报告的不一样。这些都不是边缘情况，而是移动端开发每天都要面对的现实。

### 问题：移动端屏幕上不可靠的 UI

在移动设备上，用户在屏幕上看到的内容并不总是和开发者预期的一致。下面是几个常见的场景：

- **键盘遮挡输入框**：用户点击文本输入框时，软键盘会滑出来，可能把输入框或固定在底部的提交按钮完全挡住。
- **安全区域不一致**：带刘海、圆角或主屏幕指示条（比如 iPhone 底部的横条）的设备会预留出不应放置内容的区域，而这些区域在不同设备和不同系统版本上各不相同。
- **视口混乱**：浏览器的布局视口和实际可见区域（视觉视口）可能相差很大，键盘弹出或页面被缩放时尤其明显。固定定位的元素可能会跑到意想不到的位置。

这些问题并不局限于某一个操作系统或某一款设备。无论是 iOS Safari、Android Chrome 还是其他移动端浏览器，底层的难题都是一样的：**可见区域难以预测，仅靠标准 CSS 无法可靠地应对**。

### 我们的思路：聚焦视觉视口

`react-simplikit` 中的移动端工具函数用一种聚焦的方式来解决这些问题。我们不去用脆弱的 hack 绕开浏览器的各种怪癖，而是把设计围绕**视觉视口**展开，也就是用户在任一时刻真正能看到的那部分屏幕区域。

我们基于 [Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API) 构建，提供的 Hook 可以让你：

- **检测并响应键盘的出现**，让固定在底部的元素自然地让开位置。
- **读取安全区域内边距**，从而正确处理刘海、主屏幕指示条以及其他设备特有的预留区域。
- **跟踪真实的可见区域**，让你的布局决策基于用户实际看到的内容，而不是浏览器布局引擎的假设。

目标很简单：**在视觉视口内，UI 应该可靠且可预测地渲染出来**。

### 跨平台、跨设备

我们不希望被某个特定的操作系统或设备型号限制住。移动端 Web 本身就是跨平台的，`react-simplikit` 也拥抱这一点。

我们的 Hook 在设计上要在以下环境中表现一致：

- **iOS 和 Android**，两大主流移动平台。
- **各种浏览器**，包括 Safari、Chrome、Samsung Internet 等。
- **不同的设备形态**，从小尺寸手机到大屏设备，无论有没有刘海和主屏幕指示条。

当某个 API 不可用时（例如旧版浏览器中的 `window.visualViewport`），我们会提供安全的回退方案，优雅降级而不会破坏你的 UI。

### 接下来的计划

我们会继续扩充 `react-simplikit` 中的移动端 Hook，并始终遵循同一条原则：**让移动端 UI 开发变得可预测、可靠，无论设备和操作系统是什么**。如果存在某个常见的移动端 UI 痛点，我们很可能正在为它准备一套简洁、声明式的解决方案。

## 移动端专属原则

### 感知平台差异的设计

在实现中，我们会考虑 iOS 和 Android 之间的行为差异：

- **Visual Viewport API 的差异**：
  - iOS：键盘出现时 `offsetTop` 会变成负数
  - Android：`offsetTop` 通常保持为 0
- **键盘高度计算**：针对各平台分别处理，以获得准确的测量结果

### SSR 安全优先

每个 Hook 都包含 SSR 测试，以确保服务端渲染时的安全性：

```typescript
it('is safe on server side rendering', () => {
  const result = renderHookSSR.serverOnly(() => useHook());
  expect(result.current).toBeDefined();
});
```

### 性能优化

移动端环境需要特别关注性能：

- **事件节流/防抖**：优化 scroll、resize 这类高频事件
- **被动事件监听器**：在适用的场景中使用 passive 监听器
- **React transition**：对非紧急的更新使用 `startTransition`

## 移动端专属准则

### 在真机上测试

- 建议在 iOS Safari 和 Android Chrome 上测试
- Visual Viewport API 的行为应该在真机上验证

### 平台差异

实现时请考虑以下平台差异：

| 特性                       | iOS                  | Android        |
| -------------------------- | -------------------- | -------------- |
| `visualViewport.offsetTop` | 键盘出现时会变成负数 | 通常保持为 0   |
| 键盘行为                   | 视口被整体向上顶起   | 布局被重新调整 |

### window/document 的访问模式

访问浏览器 API 时，请始终使用 SSR 安全模式：

```typescript
// ✅ SSR 安全模式
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;

// 现在可以安全地使用 window/document 了
window.visualViewport?.addEventListener('resize', handler);
```
