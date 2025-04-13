# Separated

`Separated`는 각 자식 요소 사이에 지정된 컴포넌트를 삽입하는 컴포넌트예요. 리스트에서 구분자, 간격 또는 다른 반복 요소를 추가하는 데 유용해요.

## 인터페이스

```ts
function Separated(children: React.ReactNode, by: React.ReactNode): JSX.Element;
```

### 파라미터

<Interface
  required
  name="children"
  type="React.ReactNode"
  description="렌더링할 자식 요소들이에요. 올바른 리액트 요소(<code>React.isValidElement</code>)만 렌더링돼요."
/>

<Interface
  required
  name="by"
  type="React.ReactNode"
  description="자식 요소들 사이에 삽입할 컴포넌트예요."
/>

### 반환 값

<Interface
  name=""
  type="JSX.Element"
  description="지정한 구분자로 자식을 구분하는 리액트 컴포넌트예요."
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
