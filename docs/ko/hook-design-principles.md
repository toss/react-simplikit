# React Hook Design Principles

> 상태: Draft (논의 후 확정)

---

## 1. 요구사항

### 배경

react-simplikit을 운영하며 축적한 훅 설계 철학을 **하나의 공통 원칙**으로 정의해요. 훅을 리뷰할 때와 작성할 때 모두 이 원칙을 기준으로 삼아요.

### 원칙의 두 가지 방향

| 방향                         | 출처                            | 범위                                                    |
| ---------------------------- | ------------------------------- | ------------------------------------------------------- |
| **훅 코딩 원칙** (Section 2) | CLAUDE.md, AGENTS.md, 내부 스킬 | 반환값, TypeScript, 성능, 문서화 등 코딩 스타일         |
| **훅 사용 패턴** (Section 3) | React 공식 문서 (react.dev)     | state 설계, effect 사용법, 메모이제이션, 커스텀 훅 설계 |

### 핵심 요구사항

| #   | 요구사항            | 상세                                                           |
| --- | ------------------- | -------------------------------------------------------------- |
| R1  | 리뷰/생성 공통 원칙 | 두 스킬이 동일한 원칙 참조                                     |
| R2  | Why 중심            | 규칙(What)만 나열하지 않고 철학(Why)을 서술형으로 설명         |
| R3  | Opinionated 투명성  | 🟢 Best Practice vs 🟡 Opinionated 명시                        |
| R4  | 프로젝트 무관       | react-simplikit 경로/명령어/유틸 없이 범용 원칙만              |
| R5  | Cross-tool          | Claude Code 플러그인 + Codex(AGENTS.md) + Cursor(.cursorrules) |

### 결정 필요 사항

| #   | 질문                                           | 선택지                                |
| --- | ---------------------------------------------- | ------------------------------------- |
| Q1  | C14(Named useEffect)를 포함할지?               | A) "Recommended"로 포함 B) 제외       |
| Q2  | C2(SSR-Safe)를 비-SSR 프로젝트에도 권장할지?   | A) 항상 B) SSR 사용 시만              |
| Q3  | C9(JSDoc)의 @example을 필수로 할지?            | A) 4-tag 전부 필수 B) @example은 권장 |
| Q4  | 추가할 원칙이 있는지?                          | —                                     |
| Q5  | 원칙 먼저 확정할지, 바로 플러그인 구조로 갈지? | A) 원칙 먼저 B) 바로 플러그인         |
| Q6  | 플러그인 배포 채널                             | A) git-subdir B) npm C) 미정          |

---

## 2. 훅 코딩 원칙 (Direction 1)

CLAUDE.md, AGENTS.md, 내부 스킬에서 추출한 **코딩 스타일** 원칙이에요.

### 🟢 Best Practice (11개) + 🟡 Opinionated (3개: C1, C7, C14)

> C1과 C7은 React 전반의 베스트 프랙티스가 아니라 프로젝트 컨벤션이라서 제목 옆에 🟡를 붙였어요. C14는 아래 별도 🟡 섹션에 있어요.

#### C1. 항상 객체 반환 🟡

반환값이 하나여도 `{ value }` 형태의 객체로 반환해요. 객체는 순서와 상관없이 필드 이름으로 의미를 전달하고, 필드를 추가해도 breaking change가 생기지 않아요.

> 참고: 이 원칙은 **프로젝트 컨벤션**이에요. React 문서는 "Hooks may return arbitrary values"라고 하고, React의 `useState`도 튜플을 반환해요. 이 프로젝트는 확장성을 위해 객체를 선택했어요.
> 📖 [react.dev — Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

```ts
function useDebounce<T>(value: T, delay: number): { value: T };
function useToggle(init: boolean): { value: boolean; toggle: () => void };
function usePagination(): { page: number; next: () => void; prev: () => void };
```

#### C2. SSR-Safe 초기화

`useState(FIXED_VALUE)` + `useEffect(sync)` 패턴을 써요. state를 브라우저 API로 초기화하지 않아요. 서버에는 `window`가 없어서 크래시나 hydration mismatch가 생겨요.

> 📖 [react.dev — hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)

```ts
// ✅ SSR 안전
const [width, setWidth] = useState(0);
useEffect(function syncWidth() {
  setWidth(window.innerWidth);
}, []);

// ❌ SSR 크래시
const [width, setWidth] = useState(window.innerWidth);

// ⚠️ 클라이언트 전용 앱에서만 허용
const [width, setWidth] = useState(() => {
  if (typeof window === 'undefined') return 0;
  return window.innerWidth;
});
```

#### C3. 구독할 때는 useEffect Cleanup 반환

effect에서 구독, 리스너, 타이머, 지속 연결을 설정하면 cleanup을 반환해요. React 문서에 따르면 cleanup은 모든 effect에 필요하지는 않지만, 외부 시스템과 동기화할 때는 반드시 반환해야 해요. cleanup을 빠뜨리면 메모리 누수가 생기고, StrictMode의 이중 마운트에서 바로 드러나요.

> 📖 [react.dev — useEffect](https://react.dev/reference/react/useEffect) > _"Your setup function may also optionally return a cleanup function."_

```ts
// 이벤트 리스너
useEffect(function subscribe() {
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);

// AbortController (비동기)
useEffect(
  function fetchData() {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal }).then(/* ... */);
    return () => controller.abort();
  },
  [url]
);

// 타이머
useEffect(function tick() {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}, []);
```

#### C4. No `any` in Implementation

제네릭 `<T>`를 써요. `any`는 다른 타입으로 퍼져 타입 시스템을 무력화하므로 구현 코드의 `any`는 lint가 거부해요. 유일한 예외는 호출자가 넘기는 함수의 파라미터 목록이에요. 함수 파라미터는 반공변적으로 비교하기 때문에 `unknown[]`을 쓰면 타입을 명시한 콜백이 거부돼요. 이 자리에는 `any`를 직접 쓰지 말고 `_internal/types.ts`의 공용 타입 `CallerTypedArgs`를 써요.

```ts
// ✅ 제네릭
function useDebounce<T>(value: T, delay: number): T;

// ✅ 호출자의 함수: 파라미터 타입은 호출자가 명시한 타입을 따름
function useThrottle<F extends (...args: CallerTypedArgs) => unknown>(
  callback: F,
  wait: number
);

// ❌ `_internal/types.ts` 밖에서 `any`를 직접 씀 (eslint-disable 주석이 있어도 금지)
type AnyFunction = (...args: any[]) => unknown;
```

#### C5. Named Exports Only

tree-shaking을 보장하고 import를 명확하게 해요. `export default`는 쓰지 않아요.

#### C6. Strict Boolean & Nullish Checks

`if (value)`처럼 암묵적으로 검사하지 않아요. `0`, `""`, `false`에서 조용히 생기는 버그를 막아요. nullish 검사는 `== null`로 null과 undefined를 함께 확인해요.

```ts
if (ref == null) { return; }              // ✅ null + undefined
const controlled = valueProp !== undefined; // ✅ 구분 필요할 때
if (count) { ... }                         // ❌ count=0 통과 못함
```

#### C7. Parameter는 객체로 받기 🟡

훅의 인자를 위치 기반 파라미터 대신 객체(props)로 받아요. 순서와 상관없이 이름으로 의미를 전달하고, 인자를 추가해도 breaking change가 생기지 않아요.

```ts
// ✅ 객체
function useDebounce<T>({
  value,
  delay,
  leading,
}: {
  value: T;
  delay: number;
  leading?: boolean;
}): { value: T };

// ❌ 위치 기반
function useDebounce<T>(
  value: T,
  delay: number,
  leading?: boolean
): { value: T };
```

#### C8. Guard Clauses (Early Return)

중첩된 if-else 대신 early return을 써요. 실패 조건을 먼저 걸러 내고 성공 로직은 중첩 없이 이어 가요.

```ts
// ✅
function process(value: string | null) {
  if (value == null) {
    return DEFAULT;
  }
  return transform(value);
}

// ❌
function process(value: string | null) {
  if (value != null) {
    return transform(value);
  } else {
    return DEFAULT;
  }
}
```

#### C9. JSDoc 4-Tag

모든 public API에 `@description` + `@param` + `@returns` + `@example`을 달아요. 이 태그로 AI가 문서를 생성하고 IDE가 툴팁을 보여 줘요.

```ts
/**
 * @description 값의 변경을 지연시킨다.
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (ms)
 * @returns 디바운스된 값
 * @example
 * const debouncedQuery = useDebounce(query, 300);
 */
```

#### C10. Performance Patterns

초당 30회 이상 발생하는 고빈도 이벤트에만 적용해요. 일반 훅에는 필요하지 않아요.

| 기법            | 적용 시점                         |
| --------------- | --------------------------------- |
| Throttle (16ms) | scroll, resize, pointer, keyboard |
| Deduplicate     | 값이 그대로면 setState 생략       |
| startTransition | 비긴급 파생 계산 (React 18+)      |

#### C11. Function Keyword for Declarations

함수를 선언할 때는 `function` 키워드를 써요. 화살표 함수는 인라인 콜백(map, filter)에만 써요.

```ts
function toggle(state: boolean) {
  return !state;
} // ✅ 선언
items.filter(item => item != null); // ✅ 인라인
const toggle = (state: boolean) => !state; // ❌ 선언에 화살표
```

#### C12. Zero Runtime Dependencies

프로덕션 코드에는 외부 런타임 의존성을 두지 않고 `peerDependencies`만 허용해요. 번들 크기를 최소화하고 의존성 충돌을 막아요.

#### C13. 외부 의존성 직접 참조 지양

훅 안에서 외부 모듈을 직접 import하지 않고 인자로 주입해요. 테스트하기 쉬워지고 의존성을 쉽게 교체할 수 있어요.

```ts
// ✅ 의존성 주입
function useFetch<T>(fetcher: (url: string) => Promise<T>, url: string) { ... }

// ❌ 외부 모듈 직접
function useFetch<T>(url: string) { const res = await axios.get(url); ... }
```

### 🟡 Opinionated (C14)

#### C14. Named useEffect Functions

`useEffect(function handleResize() {...})`처럼 effect 함수에 이름을 붙여요. 에러 스택에 "anonymous" 대신 "handleResize"가 표시돼요. 화살표 함수보다 장황하다는 단점이 있어요. cleanup 함수의 이름은 필수가 아니라 "Recommended"예요.

### 제외 (프로젝트별 결정)

| 항목                        | 이유              |
| --------------------------- | ----------------- |
| Import extensions (.js/.ts) | 빌드 도구 의존적  |
| 100% test coverage          | 프로젝트 정책     |
| 파일 구조/커밋 컨벤션       | 훅 설계 철학 아님 |

---

## 3. 훅 사용 패턴 (Direction 2)

> 별도 문서: [react-hook-usage-patterns.md](./react-hook-usage-patterns.md)

React 공식 문서(react.dev)를 바탕으로 정리한 16개 패턴(U1-U17, U4 제외)이고, 패턴마다 출처 URL과 인용문을 함께 담았어요.

| 카테고리     | 개수               | 핵심                                                           |
| ------------ | ------------------ | -------------------------------------------------------------- |
| State Design | U1-U3, U5-U7 (6개) | 파생값 계산, props 복사 금지, useRef, union type, state 그룹화 |
| Effect Usage | U8-U14             | effect는 외부 동기화 전용, 체인 금지, key 리셋, 비동기 cleanup |
| Memoization  | U15-U16            | useMemo 1ms+, useCallback + memo() 조합만                      |
| Hook Design  | U17                | lifecycle wrapper 금지, 재사용할 상태 로직만 추출              |
