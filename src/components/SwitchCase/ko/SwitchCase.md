# SwitchCase

`SwitchCase`는 `switch-case` 구문을 선언적으로 사용할 수 있는 컴포넌트예요.
값(`value`)에 따라 적절한 컴포넌트를 조건부 렌더링을 할 때 유용해요.

## Props

- `caseBy`: 특정 값에 따라 렌더링할 컴포넌트를 매핑한 객체예요.  
  키는 비교할 값이며, 값은 해당 키가 선택될 때 렌더링할 컴포넌트 함수예요.
- `value`: 현재 비교할 값이에요.  
  `caseBy` 객체의 키와 비교해 일치하는 경우 해당 컴포넌트를 렌더링해요.
- `defaultComponent`: `value`가 `caseBy`에 없는 경우 렌더링할 컴포넌트예요.

## Example

```jsx
<SwitchCase
  value={status}
  // status 값이 'a', 'b', 'c'일 때 각각 TypeA, TypeB, TypeC를 렌더링해요.
  caseBy={{
    a: () => <TypeA />,
    b: () => <TypeB />,
    c: () => <TypeC />,
  }}
  // status 값이 caseBy에 없을 경우 Default 컴포넌트를 렌더링해요.
  defaultComponent={() => <Default />}
/>
```
