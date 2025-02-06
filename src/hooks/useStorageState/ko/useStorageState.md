# useStorageState

`useStorageState`는 React에서 브라우저 스토리지의 데이터를 편리하게 관리할 수 있도록 도와주는 React 훅이에요.
이 훅을 사용하면 `localStorage` 또는 `sessionStorage`를 쉽게 상태처럼 사용할 수 있어요.

## Interface

```ts
function useStorageState<T>(
  key: string
): readonly [Serializable<T> | undefined, (value: SetStateAction<Serializable<T> | undefined>) => void];

function useStorageState<T>(
  key: string,
  options: StorageStateOptions<T>
): readonly [Serializable<T> | undefined, (value: SetStateAction<Serializable<T> | undefined>) => void];
```

## Parameters

- `key` (`string`): 브라우저 스토리지에서 사용할 키 값이에요.
- `options` (`StorageStateOptions<T>`, 선택 사항):
  - `storage` (`Storage`): 사용할 스토리지 (`localStorage` 또는 `sessionStorage`). 기본값은 `localStorage`예요.
  - `defaultValue` (`T`): 초기 값이에요. 스토리지에 값이 없을 경우 사용돼요.

## Returns

`[state, setState]` 형태의 튜플을 반환해요:

- `state` (`Serializable<T> | undefined`): 현재 스토리지에서 가져온 상태 값이에요.
- `setState` (`(value: SetStateAction<Serializable<T> | undefined>) => void`): 상태를 업데이트하는 함수예요.

## Notes

- 저장되는 값은 JSON으로 직렬화될 수 있어야 해요.
- `localStorage`를 사용할 경우, 같은 키를 사용하는 탭 간 자동 동기화가 지원돼요.
- JSON 데이터가 잘못 저장되어 있으면 기본값을 반환해요.
- 불필요한 JSON 파싱을 최소화하기 위해 캐싱을 활용해요.
- 스토리지 이벤트를 처리해 여러 탭에서도 상태가 동기화돼요.

## 예시

### 카운터 예시

```tsx
import { useStorageState } from 'reactive-kit';

function Counter() {
  const [count, setCount] = useStorageState<number>('counter', {
    defaultValue: 0,
  });

  return <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>;
}
```

### 최근 검색어 예시

최근 검색어를 `localStorage`에 저장하고, 최대 5개까지만 유지하는 예제예요.

```tsx
import { useStorageState } from 'reactive-kit';

function SearchHistory() {
  const [recentSearches, setRecentSearches] = useStorageState<string[]>('recent-searches', {
    defaultValue: [],
  });

  const addSearch = (term: string) => {
    setRecentSearches(prev => {
      const newSearches = [term, ...prev.filter(s => s !== term)];
      return newSearches.slice(0, 5); // 최근 5개만 유지
    });
  };

  return (
    <div>
      <h3>최근 검색어</h3>
      <ul>
        {recentSearches.map((term, index) => (
          <li key={index}>{term}</li>
        ))}
      </ul>
    </div>
  );
}
```
