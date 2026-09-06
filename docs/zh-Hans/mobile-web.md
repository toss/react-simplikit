# 移动端 Web

一组用于解决移动端 Web 环境中常见 UI 难题的 React Hook。

## 为什么是这些 Hook？

移动端 Web 开发有一些桌面端不存在的挑战。每一个都能在 `react-simplikit` 中找到对应的 Hook：

| 问题                                     | 使用                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 固定在底部的元素被软键盘遮住             | [useAvoidKeyboard](/zh-Hans/hooks/useAvoidKeyboard)                                                          |
| 读取键盘高度或键盘是否可见               | [useKeyboardHeight](/zh-Hans/hooks/useKeyboardHeight)、[isKeyboardVisible](/zh-Hans/utils/isKeyboardVisible) |
| 在底部面板或模态框打开期间锁定 body 滚动 | [useBodyScrollLock](/zh-Hans/hooks/useBodyScrollLock)                                                        |
| 避开刘海和主屏幕指示条                   | [useSafeAreaInset](/zh-Hans/hooks/useSafeAreaInset)、[getSafeAreaInset](/zh-Hans/utils/getSafeAreaInset)     |
| 跟踪用户实际能看到的区域                 | [useVisualViewport](/zh-Hans/hooks/useVisualViewport)                                                        |
| 根据滚动方向显示或隐藏页头               | [useScrollDirection](/zh-Hans/hooks/useScrollDirection)                                                      |
| 根据网络连接调整内容                     | [useNetworkStatus](/zh-Hans/hooks/useNetworkStatus)                                                          |
| 页面切到后台时暂停工作                   | [usePageVisibility](/zh-Hans/hooks/usePageVisibility)                                                        |
| 按平台分支处理                           | [isIOS](/zh-Hans/utils/isIOS)、[isAndroid](/zh-Hans/utils/isAndroid)                                         |

每一项都是从 `react-simplikit` 具名导入的，[参考](/zh-Hans/reference)页面把它们和其余所有 API 列在一起。

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

## 路线图 {#roadmap}

移动端的屏幕很小，而这块小小的空间会带来数量惊人的 UI 难题。元素被软键盘遮住，安全区域因设备而异，用户实际看到的视口也常常和浏览器报告的不一样。这些都不是边缘情况，而是移动端开发每天都要面对的现实。

### 问题：移动端屏幕上不可靠的 UI

在移动设备上，用户在屏幕上看到的内容并不总是和开发者预期的一致。下面是几个常见的场景：

- **键盘遮挡输入框**：用户点击文本输入框时，软键盘会滑出来，可能把输入框或固定在底部的提交按钮完全挡住。
- **安全区域不一致**：带刘海、圆角或主屏幕指示条（比如 iPhone 底部的横条）的设备会预留出不应放置内容的区域，而这些区域在不同设备和不同系统版本上各不相同。
- **视口混乱**：浏览器的布局视口和实际可见区域（视觉视口）可能相差很大，键盘弹出或页面被缩放时尤其明显。固定定位的元素可能会跑到意想不到的位置。

这些问题并不局限于某一个操作系统或某一款设备。无论是 iOS Safari、Android Chrome 还是其他移动端浏览器，底层的难题都是一样的：**可见区域难以预测，仅靠标准 CSS 无法可靠地应对**。

### 我们的思路：聚焦视觉视口

这些 Hook 不用脆弱的 hack 绕开浏览器的各种怪癖，而是围绕**视觉视口**来设计，也就是用户在任一时刻真正能看到的那部分屏幕区域。

它们基于 [Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API) 构建，可以让你：

- **检测并响应键盘的出现**，让固定在底部的元素自然地让开位置。
- **读取安全区域内边距**，从而正确处理刘海、主屏幕指示条以及其他设备特有的预留区域。
- **跟踪真实的可见区域**，让你的布局决策基于用户实际看到的内容，而不是浏览器布局引擎的假设。

目标很简单：**在视觉视口内，UI 应该可靠且可预测地渲染出来**。

### 跨平台、跨设备

移动端 Web 本身就是跨平台的，这些 Hook 也是。它们在设计上要在以下环境中表现一致：

- **iOS 和 Android**，两大主流移动平台。两者行为不同的地方（iOS 在键盘弹出期间把 `visualViewport.offsetTop` 报告为负数，Android 则保持为 0 并重新调整布局），由 Hook 来处理，你不必操心。
- **各种浏览器**，包括 Safari、Chrome、Samsung Internet 等。
- **不同的设备形态**，从小尺寸手机到大屏设备，无论有没有刘海和主屏幕指示条。

当某个 API 不可用时（例如旧版浏览器中的 `window.visualViewport`），我们会提供安全的回退方案，优雅降级而不会破坏你的 UI。

### 接下来的计划

我们会继续为移动端 Web 的 UI 痛点添加 Hook，并始终遵循同一条原则：**让移动端 UI 开发变得可预测、可靠，无论设备和操作系统是什么**。如果存在某个常见的移动端 UI 痛点，我们很可能正在为它准备一套简洁、声明式的解决方案。
