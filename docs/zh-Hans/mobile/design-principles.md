# 设计原则

移动端工具函数遵循 `react-simplikit` 的核心原则，并针对移动端特有的问题做了扩展。

## 核心原则

### 尊重 React 的生命周期，不加干涉

`react-simplikit` 不包含直接干涉 React 生命周期的实现。
例如，它不提供 `useMount` 或 `useLifecycles` 这样的 Hook，而是采用尊重并利用 React 默认行为的方式。

### 通过零依赖做到轻量与快速

`react-simplikit` 完全没有依赖。由于不依赖任何额外的库，它把接入项目时的包体积降到最低，也让你不必担心性能下降。

### 通过 100% 测试覆盖率保证可靠性

`react-simplikit` 会彻底测试每个函数和每个分支。
我们为每个实现编写全面的测试，不仅覆盖基本功能，还考虑到 SSR 环境的情况，从而避免非预期行为引发的问题。

### 完善的文档，易于理解和使用

`react-simplikit` 提供详细的文档，帮助用户快速理解并用好每个功能。文档包括：

- **JSDoc 注释**：详细说明每个函数的行为、参数和返回值。
- **使用指南**：清晰易懂的步骤，让你立刻上手。
- **实用示例**：展示如何在真实场景中运用这些实现的示例。

### 完整的 TypeScript 支持带来类型安全

`react-simplikit` 从一开始就用 TypeScript 构建。每个 Hook 和工具函数都具备：

- **严格的类型定义**：所有参数、返回值和选项都有完整的类型
- **IntelliSense 支持**：在 IDE 中获得自动补全和内联文档
- **泛型**：灵活的 API，保留你的类型信息
- **不使用 `any` 类型**：我们避免使用会破坏类型安全的脱围机制

## API 设计规范

### Hook 的返回值

对于 Hook 的返回值，我们遵循一致的模式：

- **对象**：用于状态及相关的值（例如 `useKeyboardHeight(): { keyboardHeight }`、`useVisualViewport(): { viewport }`）
- **void**：用于只有副作用的 Hook（例如 `useBodyScrollLock(): void`）

### 参数

- 必填参数放在前面，可选参数放在最后
- 可选参数达到 3 个或更多时，请使用选项对象

### SSR 安全模式

所有 Hook 都遵循 SSR 安全模式：

```typescript
// ✅ SSR 安全：所有 Hook 都遵循这个模式
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;
```

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
