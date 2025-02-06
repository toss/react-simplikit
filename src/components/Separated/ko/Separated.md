# Separated

`Separated`는 여러 요소를 나열할 때 각 요소 사이에 특정 컴포넌트를 삽입할 수 있도록 도와주는 컴포넌트예요.
예를 들어, 리스트 항목 사이에 구분선을 넣거나 간격을 조정할 때 유용하게 사용할 수 있어요.

## Props

- `with`: 각 요소 사이에 반복되는 컴포넌트를 삽입해요.
- `children`: 자식 요소들을 렌더링해요. `React.isValidElement` 함수를 사용하여 유효한 요소를 필터링해요.

## Example

```tsx
<Separated with={<Border type="padding24" />}>
  {LIST.map(item => (
    <div>item.title</div>
  ))}
</Separated>
```
