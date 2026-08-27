# 为移动端工具函数做贡献

本指南是在 [core 贡献指南](/zh-Hans/core/contributing) 的基础上扩展的。

## 包的范围

`react-simplikit` 中的移动端工具函数专注于**解决移动端 Web 环境中遇到的问题**。

其中包括：

- 视口管理（visual viewport、安全区域）
- 键盘处理（避免内容被键盘遮挡）
- iOS Safari 和 Android Chrome 上特有的布局问题
- 移动端浏览器中的滚动行为

这个包**并不**收录所有依赖浏览器 API 的工具函数。如果一个 Hook 用到了浏览器 API，但解决的是桌面端或通用场景的问题（例如快捷键、鼠标坐标），它就不属于这里。

## 开发流程

```
脚手架 → 实现 → 测试 → 文档 → 评审 → Changeset → 合并
```

### 1. 脚手架

为新的 Hook 创建基本结构：

```bash
yarn scaffold useNewHook --type h   # Hook
```

### 2. 实现

请遵循[设计原则](/zh-Hans/mobile/design-principles)：

- 只使用具名导出
- 最大限度地利用 TypeScript 的类型推断
- 应用 SSR 安全模式

```typescript
// ✅ SSR 安全模式
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;
```

### 3. 文档

所有导出的函数都必须包含带 4 个必填标签的 JSDoc：

```typescript
/**
 * @description 一句话摘要。（必填）
 * @param {Type} name - 说明。（有参数时必填）
 * @returns {Type} 说明。（有返回值时必填）
 * @example
 * const result = useHook(input); // （必填）
 */
```

::: tip
**我需要自己写文档吗？**

不需要，你不用另外写文档。请改为写详细的 JSDoc 注释。你的 PR 合并之后，系统会根据 JSDoc 自动生成英文和韩文文档，并自动创建一个添加文档的 PR。
:::

### 4. 测试

必须达到 100% 的覆盖率：

```bash
yarn test:spec      # 运行单个测试
yarn test:coverage  # 检查覆盖率
```

#### SSR 测试（必需）

```typescript
it('is safe on server side rendering', () => {
  const result = renderHookSSR.serverOnly(() => useHook());
  expect(result.current).toBeDefined();
});
```

#### 覆盖率检查清单

- [ ] 所有 if/else 分支
- [ ] 所有 switch case
- [ ] 所有提前 return
- [ ] 清理函数（useEffect 返回的函数）

### 5. 创建 Changeset

当你的代码改动会影响这个包时，就需要创建一个 changeset：

```bash
yarn changeset
```

选择改动的类型：

- `patch`：修复 bug 或小改动
- `minor`：新增功能（保持向后兼容）
- `major`：破坏性变更（打破向后兼容）

::: tip
两个包目前都处于 `0.0.x` 阶段。在这个阶段，大多数改动都应该使用 `patch`。
如果你不确定该用哪种版本类型，请与维护者讨论。
:::

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

## 贡献文档

贡献文档没有特别的条件。如果你发现了错误的信息、质量不佳的翻译，或者有想补充的内容，欢迎随时修改。请从读者的角度出发，把文档写得清晰、简洁。
