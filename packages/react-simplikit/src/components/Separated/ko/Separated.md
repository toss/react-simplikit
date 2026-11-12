# Separated

`Separated`는 자식 요소 사이사이에 지정한 컴포넌트를 넣는 컴포넌트예요. 리스트에 구분자나 간격처럼 반복되는 요소를 추가할 때 유용해요.

## 인터페이스

```ts
function Separated(children: React.ReactNode, by: React.ReactNode): JSX.Element;
```

### 파라미터

<Interface
  required
  name="children"
  type="React.ReactNode"
  description="렌더링할 자식 요소예요. 유효한 React 요소(<code>React.isValidElement</code>)만 렌더링돼요."
/>

<Interface
  required
  name="by"
  type="React.ReactNode"
  description="자식 요소 사이에 넣을 컴포넌트예요."
/>

### 반환 값

<Interface
  name=""
  type="JSX.Element"
  description="자식 요소 사이를 지정한 구분자로 나누는 React 컴포넌트예요."
/>

## 예시

```tsx
function App() {
  return (
    <Separated by={<Border type="padding24" />}>
      {['hello', 'react', 'world'].map(item => (
        <div key={item}>{item}</div>
      ))}
    </Separated>
  );
  // 예상 출력:
  // <div>hello</div>
  // <Border type="padding24" />
  // <div>react</div>
  // <Border type="padding24" />
  // <div>world</div>
}
```
