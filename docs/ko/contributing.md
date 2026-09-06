# 기여하기

`react-simplikit`에는 누구나 쉽게 기여할 수 있어요. 기여하고 싶다면 아래 가이드를 참고해 주세요.

## 범위

`react-simplikit`은 브라우저, 서버 렌더링, React Native 등 모든 React 환경에서 동작하는 훅, 컴포넌트, 유틸리티를 제공해요. 여기에 온스크린 키보드, 안전 영역 인셋, 비주얼 뷰포트처럼 브라우저와 모바일 웹 브라우저에서만 생기는 문제를 해결하는 훅도 포함돼요. React의 생명주기에 간섭하거나 다른 라이브러리에 의존하는 구현은 범위 밖이에요. [설계 원칙](./design-principles.md)을 참고해 주세요.

소스는 `packages/react-simplikit/src` 아래 `hooks/`, `components/`, `utils/`에 있어요.

## 구현체 기여

구현체에 기여할 때는 구현체의 유형에 따라 `components`, `hooks`, `utils` 디렉터리에 추가해 주세요. 모든 구현체는 아래 요소를 반드시 포함해야 해요.

- **구현체**
- **테스트 코드**
- **JSDoc**

::: tip
**문서는 쓰지 않아도 되나요?**

맞아요. 문서는 따로 쓰지 않아도 돼요. 대신 JSDoc을 꼼꼼하게 작성한 뒤 `yarn docs:gen <name>`을 실행하면 JSDoc을 기반으로 영문 문서가 생성되니, 그 결과를 PR에 함께 커밋해 주세요. 번역은 별도로 관리되며, 번역이 준비되기 전까지는 해당 페이지가 안내 문구와 함께 영어로 보여요.
:::

### 구현체 작성

`react-simplikit`의 [설계 원칙](./design-principles.md)을 따라야 해요. 특정 라이브러리에 의존하거나 React 생명 주기와 밀접하게 관련된 구현체는 제공하지 않아요. 설계 원칙을 준수해 구현체를 작성해 주세요.

### JSDoc 작성

모든 구현체는 [JSDoc](https://jsdoc.app/) 주석을 포함해야 해요. 이는 구현체 사용 시 힌트를 제공하기도 하고, 문서를 생성하는 데에도 중요한 역할을 해요.
JSDoc 주석은 `@description`과 `@example`을 반드시 포함해야 하고, 파라미터나 반환 값이 있다면 `@param`과 `@returns`를 포함해야 해요.

::: details JSDoc 작성 규칙이 지켜져야 정확한 문서가 생성돼요. 만약 JSDoc 검증이 실패하면 CI가 실패할 수도 있어요.

- JSDoc은 영문으로 작성되어야 해요.
- `@description`: 필수 태그로써 구현체의 기능이나 역할을 명확히 설명해요.
- `@example`: 필수 태그로써 구현체의 사용 방법을 예시 코드로 작성해요.
- `@param`: 파라미터의 이름과 설명을 작성해요. 구현체에 파라미터가 존재한다면 작성해야 해요.

  - 필수 파라미터의 경우 `@param {<타입>} <파라미터 이름> - <파라미터 설명>` 형태로 작성해요.
  - 선택 파라미터의 경우 `@param {<타입>} [<파라미터 이름>] - <파라미터 설명>` 형태로 작성해요.
  - 객체 형태의 값을 받는 파라미터의 경우 객체 자체와 하위 요소들에 대한 `@param` 태그가 모두 필요해요.
  - 설명 아래에 목록을 쓰려면 `-` 대신 `--`를 사용해요.

    ```ts
    type Props = {
      name: string;
      age: number;
      nickname?: string;
      company: {
        name: string;
        address?: string;
      };
      paymentMethod?: {
        type: 'card' | 'account';
        number?: string;
      };
    };

    /**
     * @param {string} name - Name of the user.
     * @param {number} age - Age of the user.
     * @param {string} [nickname] - Nickname of the user.
     * @param {Object} company - Company information of the user.
     * @param {string} company.name - Name of the company.
     * @param {string} [company.address] - Address of the company.
     * @param {Object} [paymentMethod] - Payment information of the user.
     * @param {string} [paymentMethod.type] - Payment method.
     * @param {string} [paymentMethod.number] - Card or account number.
     *   -- Card or account number without `-`.
     *   -- If the number is a card number, it should be 15 or 16 digits.
     */
    ```

    이 파라미터 JSDoc은 다음과 같은 문서로 변환돼요.

    <div class='codeblock'>
      <Interface
        required
        name="name"
        type="string"
        description="Name of the user."
      />
      <Interface
        required
        name="age"
        type="number"
        description="Age of the user."
      />
      <Interface
        name="nickname"
        type="string"
        description="Nickname of the user."
      />
      <Interface
        required
        name="company"
        type="Object"
        description="Company information of the user."
        :nested="[
          {
            name: 'company.name',
            type: 'string',
            description: 'Name of the company.',
            required: true,
          },
          {
            name: 'company.address',
            type: 'string',
            description: 'Address of the company.',
          },  
        ]"
      />
      <Interface
        name="paymentMethod"
        type="Object"
        description="Payment information of the user."
        :nested="[
          {
            name: 'paymentMethod.type',
            type: 'string',
            description: 'Payment method.',
            required: true,
          },
          {
            name: 'paymentMethod.number',
            type: 'string',
            description: 'Card or account number.<br/>- Card or account number without `-`.<br/>- If the number is a card number, it should be 15 or 16 digits.',
          },
        ]"
      />
    </div>

- `@returns`: 반환 값의 이름과 설명을 작성해요. 구현체에 반환 값이 존재한다면 작성해야 해요.

  - `@returns {<타입>} <반환 값 설명>` 형태로 작성해요.
  - 만약 객체나 튜플 형태의 반환 값이 있다면 하위 요소들에 대한 설명이 한 줄씩 포함되어야 해요.
  - 각 하위 요소에 부연 설명이 필요하면 `:`를 사용해요.

    ```ts
    type ReturnValue = [Object, () => void];

    /**
     * @returns {[Object, () => void]} A tuple containing:
     * - obj `Object` - An object containing:
     *   : label `string` - The label of the input.
     *   : value `string` - The value of the input.
     * - onChange `() => void` - A function to update the value.
     */
    ```

    이 반환 값 JSDoc은 다음과 같은 문서로 변환돼요.

    <div class='codeblock'>
      <Interface
        name=""
        type="[obj: Object, onChange: () => void]"
        description="A tuple containing:"
        :nested="[
          {
            name: 'obj',
            type: 'Object',
            description: 'An object containing: <br />  : label <code>string</code> - The label of the input. <br />  : value <code>string</code> - The value of the input.',
          },
          {
            name: 'onChange',
            type: '() => void',
            description: 'A function to update the value.',
          },
        ]"
      />
    </div>

    <br />

    반환 값이 객체인 경우에도 비슷하게 작성할 수 있어요.

    ```ts
    type ReturnValue = { value: string; onChange: () => void };

    /**
     * @returns {Object} An object containing:
     * - value `string` - The value of the input.
     * - onChange `() => void` - A function to update the value.
     */
    ```

    이 반환 값 JSDoc은 다음과 같은 문서로 변환돼요.

    <div class='codeblock'>
      <Interface
        name=""
        type="Object"
        description="An object containing:"
        :nested="[
          {
            name: 'value',
            type: 'string',
            description: 'The value of the input.',
          },
          {
            name: 'onChange',
            type: '() => void',
            description: 'A function to update the value.',
          },
        ]"
      />
    </div>

  :::

### 테스트 코드 작성

모든 구현체에는 테스트 코드가 반드시 포함되어야 하며, 구현체와 동일한 이름으로 작성해야 해요. 테스트 커버리지는 항상 100%를 만족해야 해요. 아래 명령어로 테스트 커버리지를 확인할 수 있어요.

```bash
yarn test:coverage
```

::: details SSR 환경에서 안전하게 동작하는지 확인해주세요
`react-simplikit`의 모든 구현체는 SSR 환경에서 안전하게 동작하는지 확인하기 위해 특별한 렌더링 함수를 사용해 테스트해요.

- 컴포넌트 테스트

  ```tsx
  it('is safe on server side rendering', () => {
    // renderSSR.serverOnly 메소드는 서버 환경에서 컴포넌트를 렌더링해요.
    // 이 환경에서는 useEffect와 같은 훅을 실행하지 않고, 렌더링 과정에서 window나 document와 같은 브라우저 단의 객체 및 API들이 사용되었다면 오류가 발생해요.
    renderSSR.serverOnly(() => (
      <Component>
        <div>Test Content</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render children correctly', async () => {
    // renderSSR 메소드는 클라이언트에서 컴포넌트를 렌더링해요.
    // 단, 서버에서 정적으로 렌더링 된 HTML과 클라이언트에서 최초에 렌더링 된 HTML이 다르다면 하이드레이션 불일치 오류가 발생해요.
    await renderSSR(() => (
      <Component>
        <div>Test Content</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should hydration mismatch error occurred', async () => {
    // 이 테스트 코드는 하이드레이션 오류가 발생하여 테스트가 실패해요.
    await renderSSR(() => (
      <Component>
        <div>Test Content</div>
        <div>{Math.random()}</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  ```

- 훅 테스트

  ```ts
  it('is safe on server side rendering', () => {
    // renderHookSSR.serverOnly는 클라이언트 단에서 발생하는 동적인 로직들은 수행하지 않기 때문에
    // 최초 렌더링 결과에 의도한 값들을 반환하는 지, 불필요한 호출이 발생하지는 않는지 확인해요.
    const result = renderHookSSR.serverOnly(() => useToggle(true));
    const [bool] = result.current;
    expect(bool).toBe(true);
  });

  it('should initialize with the default value true', async () => {
    const { result } = await renderHookSSR(() => useToggle(true));
    const [bool] = result.current;
    expect(bool).toBe(true);
  });
  ```

  :::

### Changeset 작성

코드 변경 사항이 패키지에 영향을 미치는 경우 changeset을 작성해야 해요. Changeset은 버전 관리와 changelog 생성을 자동화하는 도구예요.

#### Changeset 생성 방법

1. 변경 사항을 구현한 후, 다음 명령어를 실행하세요:

```bash
yarn changeset
```

2. 변경 유형을 선택하세요:

   - `patch`: 버그 수정이나 작은 변경사항
   - `minor`: 새로운 기능 추가 (하위 호환성 유지)
   - `major`: 주요 변경사항 (하위 호환성 깨짐)

3. 변경 사항에 대한 간단한 설명을 작성하세요.

::: tip
이 패키지는 `0.x` 단계예요. 이 단계에서는 대부분의 변경에 `patch`를 사용해요.
버전 유형이 헷갈리면 메인테이너와 상의해 주세요.
:::

4. 생성된 changeset 파일을 PR에 포함하여 커밋하세요.

::: tip
Changeset 파일은 `.changeset` 폴더에 생성되며, 이 파일은 PR과 함께 커밋되어야 해요. PR이 병합되면 자동으로 버전이 업데이트되고 changelog가 생성돼요.
:::

### 배포

`main` 브랜치에 병합되면 자동으로 배포가 진행돼요. 배포 과정은 다음과 같아요:

1. PR이 `main` 브랜치에 병합되면 GitHub Actions가 실행돼요.
2. Changeset이 있는 경우, 버전 업데이트 PR이 자동으로 생성돼요.
3. 버전 업데이트 PR이 병합되면 새로운 버전이 npm에 배포돼요.

배포 결과는 [GitHub Actions](https://github.com/toss/react-simplikit/actions)에서 확인할 수 있어요.

## 문서 기여

문서에 기여할 때 특별한 조건은 없어요. 잘못된 내용이 있거나 오역 혹은 아쉬운 번역이 있거나, 추가할 내용이 있다면 자유롭게 수정해 주세요. 문서는 독자 입장에서 쉽게 이해할 수 있도록 명확하고 간결하게 작성해 주세요.

## 스캐폴딩

기여를 하기 위한 최소한의 골격을 만들어 주는 명령어가 있어요. 아래 명령어를 사용하면 기본적인 구조가 잡힌 구현체 폴더를 생성할 수 있어요.

```bash
yarn run scaffold <name> --type <type>
```

- `type`: 구현체의 유형으로, `component`, `hook`, `util` 중 하나를 선택해야 해요.
- `name`: 구현체의 이름이에요.

### 예시

```bash
yarn run scaffold Button --type component
```

이 명령어는 `src/components/Button` 폴더에 세 개의 파일을 생성해요.

::: code-group

```tsx [Button.tsx]
/**
 * @description
 * <description-here>
 *
 * @param {<param-type>} <param-name> - <param-description>
 * @param {<param-type>} [<param-name>] - <optional-param-description>
 *
 * @returns {<return-type>} <return-description>
 * - <member-description> `<member-name>` - <member-description>
 *
 * @example
 * <example-code>
 */
export function Button() {
  // TODO: Implement Button
}
```

```tsx [Button.spec.ts]
import { describe, expect, it } from 'vitest';

import { renderSSR } from '../../_internal/test-utils/renderSSR.tsx';

import { Button } from './Button.tsx';

describe('Button', () => {
  it('is safe on server side rendering', async () => {
    const result = renderSSR.serverOnly(() => <Button />);

    expect(true).toBe(true);
  });

  it('should work', async () => {
    const result = renderSSR.serverOnly(() => <Button />);

    expect(true).toBe(true);
  });
});
```

```ts [index.ts]
export { Button } from './Button.tsx';
```

:::

::: tip
이렇게도 쓸 수 있어요.

```bash
yarn run scaffold Button --t c // 컴포넌트 생성
yarn run scaffold useButton --t h // 훅 생성
yarn run scaffold getButton --t u // 유틸 생성
```

:::

## 기여 워크플로우

스캐폴딩 → 구현 → 테스트 → 문서화 → 리뷰 → Changeset → 병합

### 커버리지 체크리스트

- [ ] 모든 if/else 브랜치
- [ ] 모든 switch case
- [ ] 모든 early return
- [ ] cleanup 함수 (useEffect return)

### 구현 규칙

- named export만 써요
- TypeScript 추론을 최대한 활용해요
- 필수 파라미터를 먼저, 선택 파라미터를 뒤에 둬요. 선택 파라미터가 3개 이상이면 옵션 객체를 써요
- 값이 하나면 그 값을, 상태와 액션 한 쌍이면 `[state, action]` 튜플을, 멤버가 더 많거나 앞으로 늘어날 형태(키보드 높이, 안전 영역 인셋 같은 브라우저 측정값)면 객체를 반환해요
- 아래 SSR 안전 패턴을 적용해요

### SSR 안전 패턴

렌더링 중에 브라우저 API를 읽지 마세요. 서버에는 `window`가 없고, 클라이언트 값이 서버 값과 다르면 hydration mismatch가 생겨요. 고정된 초기값에서 시작해서 effect에서 동기화하세요:

```ts
const [state, setState] = useState(FIXED_INITIAL_VALUE);

useEffect(function syncBrowserState() {
  if (isServer()) {
    return;
  }

  setState(readBrowserApi());
}, []);
```

### 브라우저·모바일 웹 훅

- 고빈도 이벤트(`scroll`, `resize`, `visualViewport` 변화)는 약 16ms로 쓰로틀링하고, 값이 바뀌지 않았으면 업데이트를 건너뛰고, 급하지 않은 업데이트에는 `startTransition`을 써요
- 핸들러가 `preventDefault`를 호출하지 않는다면 패시브 이벤트 리스너를 써요
- 한 플랫폼만 고르지 말고 플랫폼 차이를 처리해요:

  | 기능                       | iOS                         | Android               |
  | -------------------------- | --------------------------- | --------------------- |
  | `visualViewport.offsetTop` | 키보드가 나타나면 음수가 됨 | 일반적으로 0 유지     |
  | 키보드 동작                | 뷰포트가 밀려 올라감        | 레이아웃을 리사이즈함 |

- jsdom은 비주얼 뷰포트나 온스크린 키보드를 재현하지 못하니, 이런 훅은 테스트뿐 아니라 실제 iOS Safari와 Android Chrome 기기에서도 확인해요
