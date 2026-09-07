# react-simplikit 简介

我们怎样才能更安全、更可靠地构建基于 React 的应用？我们把答案定义为“用 React 的方式编写 React 代码”，而这个答案正是通过 `react-simplikit` 真正成形的。

`react-simplikit` 是一个轻量而强大的库，在 React 环境中提供各种实用的工具。它在设计上尊重 React 的设计原则，同时改善 React 的开发体验。

## 更直观、更熟悉的接口

我们提供尽可能接近 React 声明式 API 的开发体验。写更少的代码，更轻松地完成更多的事。

### 实现切换功能

```tsx
function Page() {
  const [isOpen, setOpen] = useState(false); // [!code --]
  // [!code --]
  const toggle = useCallback(() => {
    // [!code --]
    setOpen(isOpen => !isOpen); // [!code --]
  }, []); // [!code --]
  const [isOpen, toggle] = useToggle(false); // [!code ++]

  return (
    <div>
      <p>Bottom Sheet state: {isOpen ? 'opened' : 'closed'}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```

### 用特定的分隔元素渲染数组

<SplitView
left-title="without-react-simplikit.tsx"
right-title="with-react-simplikit.tsx">

<template #left>

```tsx
// without `react-simplikit`
const texts = ['hello', 'react', 'world'];

function Page() {
  return (
    <>
      {texts.map((text, idx) => (
        <Fragment key={text}>
          <div>{text}</div>
          {idx < texts.length - 1 ? (
            <Border type="padding24" />
          ) : null}
        </Fragment>
      ))}
    </>
  );
}
```

  </template>

<template #right>

```tsx
// with `react-simplikit`
const texts = ['hello', 'react', 'world'];

function Page() {
  return (
    <Separated by={<Border type="padding24" />}>
      {texts.map(text => (
        <div key={text}>{text}</div>
      ))}
    </Separated>
  );
}
```

  </template>
</SplitView>

## 用简洁的实现把非预期行为和 bug 降到最低

`react-simplikit` 的所有实现都不含隐藏逻辑。如果需要组合或扩展功能，我们会提供可以从外部注入的接口。我们也通过现代化的实现方式保持代码整洁。

这就是使用 `react-simplikit` 能够提升代码稳定性和可靠性的原因。

```tsx
function Page() {
  // useIntersectionObserver 只提供检测交叉状态所需的最小功能，
  // 回调和交叉判定选项则通过外部注入传入
  const ref = useIntersectionObserver<HTMLDivElement>(
    entry => {
      if (entry.isIntersecting) {
        console.log('Element is in view:', entry.target);
      } else {
        console.log('Element is out of view:', entry.target);
      }
    },
    { threshold: 0.5 }
  );

  return <div ref={ref}>Observe me!</div>;
}
```

## 高可靠性

`react-simplikit` 通过为所有实现保持 100% 的测试覆盖率来确保高可靠性。

## 保证在 SSR 环境中安全运行

随着 SSR 环境被广泛采用，写得不够严谨的组件或 Hook 可能会在 SSR 环境中报错，或者引发 hydration 不匹配。`react-simplikit` 在设计上就尽量减少这类问题，并通过 SSR 环境下 100% 的测试覆盖率来保证这一点。

## 除 React 之外没有任何依赖

react-use 在 React 和 React-DOM 之外还有 [14 个依赖](https://www.npmjs.com/package/react-use?activeTab=dependencies)，相比之下，`react-simplikit` 除了对 React 的 peer dependency 之外没有任何依赖。

## 链接

想进一步了解 react-simplikit，请查看下面的链接：

- [GitHub](https://github.com/toss/react-simplikit)
