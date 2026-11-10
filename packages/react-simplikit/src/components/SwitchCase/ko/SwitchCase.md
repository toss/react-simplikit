# SwitchCase

`SwitchCase`는 주어진 값에 따라 선언적으로 컴포넌트를 렌더링할 수 있는 컴포넌트예요. `switch-case` 문과 비슷해요. 특정 상태에 따라 다른 컴포넌트를 조건부로 렌더링해야 할 때 유용해요.

## 인터페이스

```ts
function SwitchCase<Case>(
  value: Case,
  caseBy: Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>,
  defaultComponent?: () => ReactElement | null
): ReactElement | null;
```

### 파라미터

<Interface
  required
  name="value"
  type="Case"
  description="비교할 값이에요. <code>caseBy</code>에서 이 값과 일치하는 키에 연결된 컴포넌트를 렌더링해요."
/>

<Interface
  required
  name="caseBy"
  type="Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>"
  description="값마다 렌더링할 컴포넌트를 연결한 객체예요. 키에는 <code>value</code>가 가질 수 있는 값을, 값에는 그 컴포넌트를 반환하는 함수를 넣어요."
/>

<Interface
  name="defaultComponent"
  type="() => ReactElement | null"
  description="<code>value</code>가 <code>caseBy</code>의 어떤 키와도 일치하지 않을 때 렌더링할 컴포넌트예요."
/>

### 반환 값

<Interface
  name=""
  type="ReactElement | null"
  description="케이스에 따라 조건부로 렌더링되는 React 컴포넌트예요."
/>

## 예시

```tsx
function App() {
  return (
    <SwitchCase
      value={status}
      // status 값에 따라 TypeA, TypeB, 또는 TypeC를 렌더링해요.
      caseBy={{
        a: () => <TypeA />,
        b: () => <TypeB />,
        c: () => <TypeC />,
      }}
      // status 값이 어떤 케이스와도 일치하지 않을 때 Default를 렌더링해요.
      defaultComponent={() => <Default />}
    />
  );
}
```
