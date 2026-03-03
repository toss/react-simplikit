# 기여하기

이 가이드는 [core 기여 가이드](/ko/core/contributing)를 확장한 것이에요.

## 패키지 범위

`@react-simplikit/mobile`은 **모바일 웹 환경에서 겪는 문제를 해결**하기 위한 전용 패키지예요.

다음과 같은 영역을 다뤄요:

- 뷰포트 관리 (visual viewport, safe area)
- 키보드 처리 (키보드에 가려지는 콘텐츠 방지)
- iOS Safari와 Android Chrome에서 발생하는 레이아웃 이슈
- 모바일 브라우저의 스크롤 동작

이 패키지는 모든 브라우저 API 의존 유틸리티를 위한 것이 **아니에요**. 브라우저 API를 사용하더라도 데스크톱이나 범용적인 문제를 해결하는 훅(예: 키보드 단축키, 마우스 좌표)은 여기에 속하지 않아요.

## 개발 워크플로우

```
스캐폴딩 → 구현 → 테스트 → 문서화 → 리뷰 → Changeset → 병합
```

### 1. 스캐폴딩

새로운 훅을 위한 기본 구조를 생성해요:

```bash
yarn scaffold useNewHook --type h   # 훅
```

### 2. 구현

[설계 원칙](/ko/mobile/design-principles)을 따라주세요:

- named export만 사용
- TypeScript 추론 최대화
- SSR 안전 패턴 적용

```typescript
// ✅ SSR 안전 패턴
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;
```

### 3. 문서화

모든 export된 함수는 4가지 필수 태그가 포함된 JSDoc을 포함해야 해요:

```typescript
/**
 * @description 한 줄 요약. (필수)
 * @param {Type} name - 설명. (파라미터가 있는 경우 필수)
 * @returns {Type} 설명. (반환 값이 있는 경우 필수)
 * @example
 * const result = useHook(input); // (필수)
 */
```

::: tip
**문서는 쓰지 않아도 되나요?**

맞아요. 문서는 따로 쓰지 않아도 돼요. 대신, JSDoc을 꼼꼼하게 작성해 주세요. 문서는 기여를 위해 올려주신 PR이 병합되면 JSDoc을 기반으로 자동으로 영문, 한글 문서를 생성하여, 문서를 추가하는 PR이 자동 생성돼요.
:::

### 4. 테스트

100% 커버리지가 필수예요:

```bash
yarn test:spec      # 단일 테스트 실행
yarn test:coverage  # 커버리지 확인
```

#### SSR 테스트 (필수)

```typescript
it('is safe on server side rendering', () => {
  const result = renderHookSSR.serverOnly(() => useHook());
  expect(result.current).toBeDefined();
});
```

#### 커버리지 체크리스트

- [ ] 모든 if/else 브랜치
- [ ] 모든 switch case
- [ ] 모든 early return
- [ ] cleanup 함수 (useEffect return)

### 5. Changeset 작성

코드 변경 사항이 패키지에 영향을 미치는 경우 changeset을 작성해야 해요:

```bash
yarn changeset
```

변경 유형을 선택하세요:

- `patch`: 버그 수정이나 작은 변경사항
- `minor`: 새로운 기능 추가 (하위 호환성 유지)
- `major`: 주요 변경사항 (하위 호환성 깨짐)

## 모바일 특화 가이드라인

### 실제 기기 테스트

- iOS Safari와 Android Chrome에서 테스트하는 것을 권장해요
- Visual Viewport API 동작은 실제 기기에서 확인해야 해요

### 플랫폼 차이

구현 시 다음 플랫폼 차이를 고려해주세요:

| 기능                       | iOS                         | Android               |
| -------------------------- | --------------------------- | --------------------- |
| `visualViewport.offsetTop` | 키보드가 나타나면 음수가 됨 | 일반적으로 0 유지     |
| 키보드 동작                | 뷰포트가 밀려 올라감        | 레이아웃을 리사이즈함 |

### window/document 접근 패턴

브라우저 API에 접근할 때는 항상 SSR 안전 패턴을 사용해주세요:

```typescript
// ✅ SSR 안전 패턴
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;

// 이제 window/document를 안전하게 사용할 수 있어요
window.visualViewport?.addEventListener('resize', handler);
```

## 문서 기여

문서에 기여할 때 특별한 조건은 없어요. 잘못된 내용이 있거나 오역 혹은 아쉬운 번역이 있거나, 추가할 내용이 있다면 자유롭게 수정해 주세요. 문서는 독자 입장에서 쉽게 이해할 수 있도록 명확하고 간결하게 작성해 주세요.
