# SwitchCase

`SwitchCase` 는 switch-case 구문을 선언적으로 사용할 수 있는 컴포넌트에요.

## Props

- `caseBy`: 케이스에 따라 렌더링할 컴포넌트를 정의한 객체에요.
- `value`: 케이스 값이에요.
- `defaultComponent`: 케이스에 해당하지 않는 경우 렌더링할 컴포넌트에요

## Example

```jsx
<SwitchCase
  value={status}
  // status 값이 `'a'`, `'b'`, `'c'` 인지에 따라서 아래 컴포넌트가 렌더링돼요.
  caseBy={{
    a: () => <TypeA />,
    b: () => <TypeB />,
    c: () => <TypeC />,
  }}
  // status 값이 아무것도 해당되지 않는 경우, 이 컴포넌트가 렌더링돼요.
  defaultComponent={() => <Default />}
/>
```
