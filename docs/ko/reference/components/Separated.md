# Separated

`Separated`는 각 요소 사이에 반복되는 컴포넌트를 삽입하고자 할 때 사용할 수 있는 컴포넌트에요.

## Props

- `with`: 각 요소 사이에 반복되는 컴포넌트를 삽입해요.
- `children`: 자식 요소들을 렌더링해요. validElement 함수를 사용하여 유효한 요소를 필터링해요.

## Example

```tsx
<Separated with={<Border type="padding24" />}>
  {LIST.map(item => (
    <div>item.title</div>
  ))}
</Separated>
```
