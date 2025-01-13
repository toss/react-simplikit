# useStorageState

`useStorageState`는 React에서 브라우저 스토리지의 데이터를 편리하게 다룰 수 있게 해주는 Hook입니다.

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

- `key`: 스토리지에서 사용할 키 값
- `options`:
  - `storage`: 사용할 스토리지 (기본값: `safeLocalStorage`)
  - `defaultValue`: 초기값

## Returns

[state, setState] 형태의 튜플을 반환합니다:

- `state`: 현재 상태 값
- `setState`: 상태를 업데이트하는 함수

## Notes

- 저장되는 값은 JSON으로 직렬화 가능해야 합니다
- LocalStorage 사용 시 탭 간 자동 동기화
- 잘못된 JSON 데이터가 있는 경우 기본값을 반환
- 파싱 작업을 최소화하기 위한 캐싱 사용
- 탭 간 통신을 위한 스토리지 이벤트 처리

## 예시

### 카운터 예시

```tsx
import { useStorageState } from 'reactie';

function Counter() {
  const [count, setCount] = useStorageState<number>('counter', {
    defaultValue: 0,
  });

  return <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>;
}
```

### 최근 검색어 예시

```tsx
import { useStorageState } from 'reactie';

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
