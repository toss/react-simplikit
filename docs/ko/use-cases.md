---
description: 해결하려는 문제에 맞는 React 유틸리티 선택하기
---

# 문제별 사용법

필요한 동작에 맞는 API를 고른 뒤, 레퍼런스에서 파라미터와 예외 상황을 확인하세요. 예제를 실행하기 전에 [react-simplikit을 설치하세요](/ko/installation).

## API 선택하기

| 문제                          | API                                                      | 제공하는 기능                                      |
| ----------------------------- | -------------------------------------------------------- | -------------------------------------------------- |
| 콘텐츠를 보이거나 숨기기      | [useToggle](/ko/hooks/useToggle)                         | 불리언 상태와 토글 함수                            |
| 입력이 멈출 때까지 기다리기   | [useDebouncedValue](/ko/hooks/useDebouncedValue)         | 입력은 즉시 반영하면서 상태의 사본을 늦게 갱신해요 |
| 콜백 호출을 늦추기            | [useDebounce](/ko/hooks/useDebounce)                     | `.cancel()` 메서드가 있는 호출 가능한 함수         |
| 콜백 호출 빈도 제한하기       | [useThrottledCallback](/ko/hooks/useThrottledCallback)   | 설정한 간격으로 호출 빈도를 제한하는 콜백          |
| 새로고침 후에도 상태 유지하기 | [useStorageState](/ko/hooks/useStorageState)             | 브라우저 저장소에 유지되는 상태                    |
| 요소 바깥 클릭에 반응하기     | [useOutsideClickEffect](/ko/hooks/useOutsideClickEffect) | 요소 바깥 클릭 구독                                |
| 입력창을 키보드 위에 유지하기 | [useAvoidKeyboard](/ko/hooks/useAvoidKeyboard)           | 고정 요소의 위치를 조절하는 스타일                 |
| 자식 요소 사이에 구분자 넣기  | [Separated](/ko/components/Separated)                    | 마지막 요소 뒤에는 붙지 않는 구분자                |
| 한 요소에 여러 ref 연결하기   | [mergeRefs](/ko/utils/mergeRefs)                         | 각 ref로 전달하는 하나의 ref 콜백                  |

## 상세 내용 보이거나 숨기기

React 앱에서 `<Details />`를 렌더링하세요. 버튼을 누르면 콘텐츠 표시 여부와 펼침 상태가 함께 바뀌어요.

```tsx
import { useToggle } from 'react-simplikit';

export function Details() {
  const [open, toggle] = useToggle(false);

  return (
    <section>
      <button type="button" aria-expanded={open} onClick={toggle}>
        Details
      </button>
      {open && <p>Delivery takes 3–5 days.</p>}
    </section>
  );
}
```

## 입력이 멈춘 뒤 필터링하기

React 앱에서 `<FruitSearch />`를 렌더링하세요. `ap`를 입력하면 입력창은 즉시 갱신되고, 추가 입력 없이 300ms가 지나면 목록에 Apple이 표시돼요. 로컬 데이터를 사용하므로 서버가 필요하지 않아요.

```tsx
import { useState } from 'react';
import { useDebouncedValue } from 'react-simplikit';

const fruits = ['Apple', 'Banana', 'Orange'];

export function FruitSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const results = fruits.filter(fruit =>
    fruit.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <section>
      <label>
        Search fruit
        <input value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      <ul aria-live="polite">
        {results.map(fruit => (
          <li key={fruit}>{fruit}</li>
        ))}
      </ul>
    </section>
  );
}
```

렌더링에 사용할 값이 필요하면 [useDebouncedValue](/ko/hooks/useDebouncedValue)를 사용하세요. 이벤트에서 콜백 실행을 예약하려면 [useDebounce](/ko/hooks/useDebounce)를 사용하세요. 디바운스 자체가 무거운 계산을 빠르게 만들지는 않아요.

## SSR과 정리 동작

- 훅은 React 컴포넌트나 커스텀 훅의 최상위에서 호출하세요. 서버 컴포넌트를 사용하는 프레임워크에서는 상호작용이 있는 이 예제를 클라이언트 컴포넌트(`'use client'`)에 넣으세요.

- `useDebouncedValue`는 서버와 첫 렌더에서 전달받은 값을 그대로 반환해요. 서버와 클라이언트에 같은 초기값을 전달하고, 그 값을 만들기 위해 렌더 도중 `window`나 저장소를 읽지 마세요.

- `useStorageState`는 서버 스냅샷과 hydration에 `defaultValue`를 사용한 뒤 클라이언트에서 브라우저 저장소를 읽어요. 언마운트 시 저장소 리스너를 제거해요.

- `useDebounce`는 컴포넌트가 언마운트되거나 디바운스 인스턴스가 바뀌면 대기 중인 호출을 취소해요. 이미 시작한 네트워크 요청은 취소하지 않으므로, 요청 취소나 오래된 응답 처리는 애플리케이션에서 담당해야 해요.

- 브라우저 측정값은 마운트 후에 바뀔 수 있어요. 초기값과 플랫폼 제약은 [모바일 웹](/ko/mobile-web) 가이드와 개별 API 레퍼런스에서 확인하세요.

## 다음 단계

다른 도구는 [전체 API 레퍼런스](/ko/reference)에서 찾을 수 있어요. 에이전트도 같은 문서를 찾도록 [AI 연동](/ko/ai-integration)을 설정할 수 있어요.
