# useTimeout

`useTimeout`은 지정된 지연 시간 후에 콜백 함수를 실행하는 리액트 훅이에요. 리액트 생명 주기에 따라 `setTimeout`을 관리하며, 언마운트 시 또는 의존성이 변경될 때 정리가 보장돼요.

## 인터페이스

```ts
function useTimeout(options: Object): void;
```

### 파라미터

<Interface
  required
  name="options"
  type="Object"
  description="타임아웃 동작을 설정해요."
  :nested="[
    {
      name: 'options.onTimeout',
      type: '() => void',
      required: true,
      description: '지연 후 실행될 함수예요.',
    },
    {
      name: 'options.delayMs',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: '<code>onTimeout</code>을 실행하기 전에 대기할 시간(밀리초)이에요.',
    },
  ]"
/>

### 반환 값

이 함수는 아무것도 반환하지 않아요.

## 예시

```tsx
// 지연 후 제목 업데이트
import { useTimeout } from 'react-simplikit';
import { useState } from 'react';

function Example() {
  const [title, setTitle] = useState('');

  useTimeout({
    onTimeout: () => setTitle('제품을 검색 중이에요...'),
    delayMs: 2000,
  });

  useTimeout({
    onTimeout: () => setTitle('거의 완료됐어요...'),
    delayMs: 4000,
  });

  return <div>{title}</div>;
}
```
