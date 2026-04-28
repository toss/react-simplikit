# React Hook Design Principles

> 상태: Draft (논의 후 확정)

---

## 1. 요구사항

### 배경

react-simplikit을 운영하며 축적한 훅 설계 철학을 **하나의 공통 원칙**으로 정의한다. 이 원칙은 두 가지 용도로 사용된다:

1. **코드 리뷰** — `react-hook-review` 스킬이 이 원칙 기반으로 피드백
2. **코드 작성** — `react-hook-writing` 스킬이 이 원칙 기반으로 가이드

### 원칙의 두 가지 방향

| 방향                         | 출처                            | 범위                                                    |
| ---------------------------- | ------------------------------- | ------------------------------------------------------- |
| **훅 코딩 원칙** (Section 2) | CLAUDE.md, AGENTS.md, 내부 스킬 | 반환값, TypeScript, 성능, 문서화 등 코딩 스타일         |
| **훅 사용 패턴** (Section 3) | React 공식 문서 (react.dev)     | state 설계, effect 사용법, 메모이제이션, 커스텀 훅 설계 |

### 핵심 요구사항

| #   | 요구사항            | 상세                                                           |
| --- | ------------------- | -------------------------------------------------------------- |
| R1  | 리뷰/생성 공통 원칙 | 두 스킬이 동일한 원칙 참조                                     |
| R2  | Why 중심            | 규칙(What)만 나열하지 않고 철학(Why)을 narrative로 설명        |
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

CLAUDE.md + AGENTS.md + 내부 스킬에서 추출한 **코딩 스타일** 원칙.

### 🟢 Best Practice (11개) + 🟡 Opinionated (3개: C1, C7, C14)

> C1과 C7은 React 전역 베스트 프랙티스가 아니라 프로젝트 컨벤션이므로 인라인 🟡로 표기. C14는 아래 별도 🟡 섹션에 위치.

#### C1. 항상 객체 반환 🟡

반환값이 1개여도 `{ value }` 형태. 객체는 순서 무관, 이름으로 의미 전달, 확장 시 breaking change 없음.

```ts
function useDebounce<T>(value: T, delay: number): { value: T };
function useToggle(init: boolean): { value: boolean; toggle: () => void };
function usePagination(): { page: number; next: () => void; prev: () => void };
```

#### C2. SSR-Safe 초기화

`useState(FIXED_VALUE)` + `useEffect(sync)`. 브라우저 API 초기화 금지. 서버에 `window` 없음 → 크래시 또는 hydration mismatch.

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

#### C3. useEffect Cleanup 필수

모든 부수효과에 cleanup 반환. 메모리 누수 방지. StrictMode 이중 마운트가 즉시 노출.

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

#### C4. No `any` Types

제네릭 `<T>` 사용. any 전파 → 타입 시스템 무력화. 정당한 사유(generic callback 등) 시 per-line eslint-disable + 코멘트 허용.

```ts
// ✅ Generic
function useDebounce<T>(value: T, delay: number): T;

// ✅ 정당한 예외 (코멘트 필수)
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic callback
type AnyFunction = (...args: any[]) => unknown;
```

#### C5. Named Exports Only

tree-shaking 보장 + import 명확성. `export default` 금지.

#### C6. Strict Boolean & Nullish Checks

`if (value)` 금지 → 0, "", false falsy 버그 방지. `== null`로 null+undefined 동시 체크.

```ts
if (ref == null) { return; }              // ✅ null + undefined
const controlled = valueProp !== undefined; // ✅ 구분 필요할 때
if (count) { ... }                         // ❌ count=0 통과 못함
```

#### C7. Parameter는 객체로 받기 🟡

훅의 인자를 개별 파라미터 대신 객체(props)로. 순서 무관 + 이름으로 의미 전달 + 확장 시 breaking change 없음.

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

nested if-else 대신 early return. 실패 조건 먼저 걸러내고 성공 로직은 플랫하게.

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

모든 public API에 `@description` + `@param` + `@returns` + `@example`. AI 문서 생성 + IDE 툴팁.

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

고빈도(30+/sec) 이벤트에만 적용. 일반 훅에는 불필요.

| 기법            | 적용 시점                         |
| --------------- | --------------------------------- |
| Throttle (16ms) | scroll, resize, pointer, keyboard |
| Deduplicate     | 값 미변경 시 setState skip        |
| startTransition | 비긴급 파생 계산 (React 18+)      |

#### C11. Function Keyword for Declarations

함수 선언은 `function` 키워드. 화살표는 인라인 콜백(map, filter)에만.

```ts
function toggle(state: boolean) {
  return !state;
} // ✅ 선언
items.filter(item => item != null); // ✅ 인라인
const toggle = (state: boolean) => !state; // ❌ 선언에 화살표
```

#### C12. Zero Runtime Dependencies

프로덕션 코드에 외부 런타임 의존성 금지. `peerDependencies`만 허용. 번들 사이즈 최소화 + 의존성 충돌 방지.

#### C13. 외부 의존성 직접 참조 지양

훅 내부에서 외부 모듈을 직접 호출하지 않고 인자로 주입. 테스트 용이성 + 교체 가능성.

```ts
// ✅ 의존성 주입
function useFetch<T>(fetcher: (url: string) => Promise<T>, url: string) { ... }

// ❌ 외부 모듈 직접
function useFetch<T>(url: string) { const res = await axios.get(url); ... }
```

### 🟡 Opinionated (C14)

#### C14. Named useEffect Functions

`useEffect(function handleResize() {...})`. 에러 스택에서 "handleResize" vs "anonymous". Trade-off: 화살표보다 장황. cleanup 이름은 "Recommended" (필수 아님).

### 제외 (프로젝트별 결정)

| 항목                        | 이유              |
| --------------------------- | ----------------- |
| Import extensions (.js/.ts) | 빌드 도구 의존적  |
| 100% test coverage          | 프로젝트 정책     |
| 파일 구조/커밋 컨벤션       | 훅 설계 철학 아님 |

---

## 3. 훅 사용 패턴 (Direction 2)

> 별도 문서: [react-hook-usage-patterns.md](./react-hook-usage-patterns.md)

React 공식 문서(react.dev) 기반 16개 패턴 (U1-U17, U4 제거):

| 카테고리     | 개수               | 핵심                                                           |
| ------------ | ------------------ | -------------------------------------------------------------- |
| State Design | U1-U3, U5-U7 (6개) | 파생값 계산, props 복사 금지, useRef, union type, state 그룹화 |
| Effect Usage | U8-U14             | effect는 외부 동기화 전용, 체인 금지, key 리셋, 비동기 cleanup |
| Memoization  | U15-U16            | useMemo 1ms+, useCallback + memo() 조합만                      |
| Hook Design  | U17                | lifecycle wrapper 금지, 구체적 목적 훅만                       |

---

## 4. 플러그인 아키텍처

### 파생 흐름

```
이 문서 (principles, 원칙 정의)
    ↓ 압축
react-hook-review/SKILL.md (체크리스트)
react-hook-writing/SKILL.md (가이드)
    ↓ 추가 압축
AGENTS.md Part 1 (Codex용)
    ↓ 참조
.cursorrules (Cursor용)
```

### 디렉토리 구조

```
packages/plugin/  (planned)
├── .claude-plugin/plugin.json
├── .codex-plugin/plugin.json
├── principles/                      ← 공통 원칙 Single Source
├── skills/
│   ├── react-hook-review/SKILL.md   ← C1-C14 + U1-U17 체크리스트
│   └── react-hook-writing/
│       ├── SKILL.md                 ← 테마별 가이드
│       └── references/patterns.md   ← 구현 예시 3개
└── README.md
```

### Cross-Tool 지원

| 도구                   | 파일               | 현재     | 변경                                     |
| ---------------------- | ------------------ | -------- | ---------------------------------------- |
| Claude Code (내부)     | `.claude/skills/`  | ✅ 10개  | 유지                                     |
| Claude Code (플러그인) | `packages/plugin/` | ❌       | Phase 1-5로 생성                         |
| Codex                  | `AGENTS.md`        | ✅ 162줄 | Part 1(Universal) + Part 2(Project) 분리 |
| Cursor                 | `.cursorrules`     | ✅ 28줄  | AGENTS.md 참조 유지                      |

### 추출 규칙

| 추출됨 (철학)                              | 남겨짐 (구현)                     |
| ------------------------------------------ | --------------------------------- |
| "항상 객체 반환"                           | `packages/core/src/hooks/` 경로   |
| "Named useEffect improves stack traces"    | `yarn test`, `yarn fix` 명령      |
| "SSR-safe: fixed initial + useEffect sync" | `renderHookSSR.serverOnly()` 유틸 |
| "4 JSDoc tags for AI doc generation"       | `100%` coverage 기준              |

### 일반화 변환

| Before (프로젝트 전용)       | After (범용)                    |
| ---------------------------- | ------------------------------- |
| `renderHookSSR.serverOnly()` | Vitest + `delete global.window` |
| `yarn test` / `yarn fix`     | "Run your test suite"           |
| `packages/core/` 경로        | "your source directory"         |
| `react-simplikit` 언급       | 제거                            |

---

## 5. 실행 로드맵

| Phase | 내용                                      | 산출물                      |
| ----- | ----------------------------------------- | --------------------------- |
| 1     | 디렉토리 + plugin.json + README           | `packages/plugin/` 구조     |
| 2     | react-hook-review SKILL.md                | C1-C14 + U1-U17 체크리스트  |
| 3     | react-hook-writing SKILL.md + patterns.md | 테마별 가이드 + 3개 훅 예시 |
| 4     | 일반화 검증 (grep)                        | 프로젝트 참조 0건           |
| 5     | 플러그인 validate + 로컬 테스트           | 동작 확인                   |

### 검증 기준

| 항목               | 통과 기준                                 |
| ------------------ | ----------------------------------------- |
| 플러그인 구조      | `claude plugin validate .` 에러 0         |
| 범용성             | 다른 React 프로젝트에서 프로젝트 참조 0건 |
| 철학 깊이          | 각 규칙의 Why가 narrative                 |
| Opinionated 투명성 | 🟡 패턴에 trade-off 존재                  |

### 향후 확장

- Codex/Gemini 대응 (AGENTS.md Part 1 활용)
- Component 설계 철학 추가
- Marketplace 전환 (Plugin 3개+ 시)
