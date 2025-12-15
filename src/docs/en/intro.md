# Introduction to react-simplikit

How can we build React-based applications more safely and reliably? We defined the answer as 'writing React codes in a React-like way' and the answer really began to take shape through `react-simplikit`.

`react-simplikit` is a lightweight yet powerful library that provides various useful tools in React environments. It is designed to respect React's design principles while improving the React development experience.

## Library Direction

**react-simplikit is now maintained as a Universal Hook Library providing only pure state/logic hooks.**

We are repositioning react-simplikit to focus exclusively on **platform-independent hooks** that work seamlessly across web and mobile (React Native, etc.). Network-intensive, browser API-dependent, and DOM-coupled features are no longer part of react-simplikit's scope.

### What's Maintained

Hooks that don't depend on specific platform APIs will continue to be actively maintained, such as state management hooks (`useToggle`, `useBooleanState`), lifecycle hooks (`usePrevious`), and utility hooks (`useDebounce`, `useThrottle`). Backward compatibility is preserved for these pure logic hooks.

### What's Deprecated

Browser/platform-dependent hooks like `useGeolocation`, `useStorageState`, `useIntersectionObserver`, `useImpressionRef`, `useDoubleClick`, `useLongPress`, `useOutsideClickEffect`, and `useVisibilityEvent` are now deprecated. These hooks will not receive new features and may be removed in future major versions.

## More Intuitive and Familiar Interface

We provide a development experience as similar as possible to using React's declarative API. Write less and do more, more easily.

### Implementing Toggle Functionality

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

### Rendering Arrays with Specific Separators

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

## Minimizing Unintended Behavior and Bugs with Concise Implementation

All implementations in `react-simplikit` contain no hidden logic. If feature combinations or extensions are needed, we provide interfaces that can be injected externally. We also maintain clean code through modern implementation.

This is why using `react-simplikit` can increase your code's stability and reliability.

```tsx
function Page() {
  // useIntersectionObserver provides minimal functionality for detecting intersection,
  // and receives callback and intersection options through external injection
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

## High Reliability

`react-simplikit` ensures high reliability by maintaining 100% test coverage for all implementations.

## Ensuring Safe Operation in SSR Environments

With the active adoption of SSR environments, poorly written components or hooks can cause errors in SSR environments or hydration mismatches. `react-simplikit` was designed to minimize these issues and guarantees this through 100% test coverage in SSR environments.

## No Dependencies Beyond React

Compared to react-use, which has [14 dependencies](https://www.npmjs.com/package/react-use?activeTab=dependencies) excluding React and React-DOM, `react-simplikit` has no dependencies other than peer dependencies on React.

## Links

For more information about react-simplikit, please check out the following link:

- [GitHub](https://github.com/toss/react-simplikit)
