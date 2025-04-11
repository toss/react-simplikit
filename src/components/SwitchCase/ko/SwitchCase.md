# SwitchCase

`SwitchCase`는 주어진 값에 기반하여 선언적으로 컴포넌트를 렌더링할 수 있는 컴포넌트예요, 마치 `switch-case` 문장과 비슷해요. 이는 특정 상태에 따라 다른 컴포넌트를 조건부로 렌더링해야 할 때 유용해요.

## 인터페이스
```ts
function SwitchCase(
  value: string | number,
  caseBy: Record<string | number, () => JSX.Element>,
  defaultComponent: () => JSX.Element,
): JSX.Element;

```

### 파라미터

<Interface
  required
  name="value"
  type="string | number"
  description="비교할 값이에요. <code>caseBy</code>에서 일치하는 키와 연결된 컴포넌트가 렌더링돼요."
/>

<Interface
  required
  name="caseBy"
  type="Record<string | number, () => JSX.Element>"
  description="렌더링할 컴포넌트를 값으로 맵핑하는 객체예요. 키는 가능한 값을 나타내며, 값은 해당 컴포넌트를 반환하는 함수예요."
/>

<Interface
  required
  name="defaultComponent"
  type="() => JSX.Element"
  description="<code>value</code>가 <code>caseBy</code>의 어떤 키와도 일치하지 않을 때 렌더링할 컴포넌트예요."
/>

### 반환 값

<Interface
  name=""
  type="JSX.Element"
  description="케이스에 따라 조건부로 렌더링하는 리액트 컴포넌트예요."
/>


## 예시

```tsx
function App() {
  return (
    <SwitchCase
      value={status}
      // 상태 값에 따라 TypeA, TypeB 또는 TypeC를 렌더링해요.
      caseBy={{
        a: () => <TypeA />, 
        b: () => <TypeB />, 
        c: () => <TypeC />, 
      }}
      // 상태 값이 어떤 케이스와도 일치하지 않으면 Default를 렌더링해요.
      defaultComponent={() => <Default />}
    />
  );
}
```
  
