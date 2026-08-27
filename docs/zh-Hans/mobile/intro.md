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

| Hook                                                           | 说明                         |
| -------------------------------------------------------------- | ---------------------------- |
| [useAvoidKeyboard](/zh-Hans/mobile/hooks/useAvoidKeyboard)     | 把固定元素移动到软键盘上方   |
| [useKeyboardHeight](/zh-Hans/mobile/hooks/useKeyboardHeight)   | 返回当前的键盘高度           |
| [useBodyScrollLock](/zh-Hans/mobile/hooks/useBodyScrollLock)   | 为模态框和浮层锁定 body 滚动 |
| [useScrollDirection](/zh-Hans/mobile/hooks/useScrollDirection) | 检测滚动方向（向上/向下）    |
| [useNetworkStatus](/zh-Hans/mobile/hooks/useNetworkStatus)     | 监控网络连接状态             |
| [usePageVisibility](/zh-Hans/mobile/hooks/usePageVisibility)   | 跟踪页面可见性状态           |
| [useVisualViewport](/zh-Hans/mobile/hooks/useVisualViewport)   | 提供视觉视口的尺寸和偏移量   |
