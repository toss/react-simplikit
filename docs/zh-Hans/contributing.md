# 为 react-simplikit 做贡献

`react-simplikit` 的设计鼓励任何人参与贡献。如果你想参与贡献，请遵循下面的指南。

## 范围

`react-simplikit` 提供能在所有 React 环境（浏览器、服务端渲染和 React Native）中运行的 Hook、组件和工具函数，以及解决浏览器和移动端 Web 浏览器特有问题的 Hook，例如软键盘、安全区域内边距和视觉视口。任何干涉 React 生命周期或依赖其他库的实现都不在范围内，详见[设计原则](./design-principles.md)。

源码位于 `packages/react-simplikit/src` 下的 `hooks/`、`components/` 和 `utils/`。

## 贡献实现

贡献实现时，请根据类型（`components`、`hooks` 或 `utils`）把它放到对应的目录下。每个实现都必须包含以下内容：

- **实现**
- **测试代码**
- **JSDoc**

::: tip
**我需要自己写文档吗？**

不需要，你不用另外写文档。请改为写详细的 JSDoc 注释，然后运行 `yarn docs:gen <name>`，它会根据 JSDoc 生成英文文档；请把生成结果和你的 PR 一起提交。翻译单独维护；在翻译完成之前，该页面会以英文显示并附带提示。
:::

### 编写实现

你必须遵循 `react-simplikit` 的[设计原则](./design-principles.md)。我们不提供依赖特定库或与 React 生命周期紧密耦合的实现。请按照这些设计原则来编写实现。

### 编写 JSDoc

所有实现都必须包含 [JSDoc](https://jsdoc.app/) 注释。它们在使用实现时提供提示，在生成文档的过程中也起着关键作用。
JSDoc 注释必须包含 `@description` 和 `@example`；如果有参数或返回值，还应该包含 `@param` 和 `@returns`。

::: details 为了准确生成文档，必须遵守 JSDoc 的编写规则。如果 JSDoc 校验失败，CI 也可能失败。

- JSDoc 必须用英文编写。
- `@description`：必填标签，用于清楚说明该实现的功能或作用。
- `@example`：必填标签，用于展示如何使用该实现的示例代码。
- `@param`：写明参数的名称和说明。如果实现带有参数，就必须包含这个标签。

  - 必填参数：`@param {<类型>} <参数名> - <参数说明>`
  - 可选参数：`@param {<类型>} [<参数名>] - <参数说明>`
  - 对象类型的参数，对象本身和它的属性都需要 `@param` 标签。
  - 如果想在说明下面写列表，请用 `--` 代替 `-`。

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

    这段 JSDoc 会转换成下面这样的文档。

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

- `@returns`：写明返回值的名称和说明。如果实现有返回值，就必须包含这个标签。

  - 格式：`@returns {<类型>} <返回值说明>`
  - 如果返回值是对象或元组，请为每个成员写上说明。
  - 如果某个成员需要补充说明，请使用 `:`。

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

    这段 JSDoc 会转换成下面这样的文档。

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

    对象类型的返回值也可以用类似的方式书写。

    ```ts
    type ReturnValue = { value: string; onChange: () => void };

    /**
     * @returns {Object} An object containing:
     * - value `string` - The value of the input.
     * - onChange `() => void` - A function to update the value.
     */
    ```

    这段 JSDoc 会转换成下面这样的文档。

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

### 编写测试代码

所有实现都必须包含测试代码，文件名与实现同名。测试覆盖率必须始终达到 100%。可以用下面的命令确认覆盖率：

```bash
yarn test:coverage
```

::: details 请确认在 SSR 环境中能安全运行
`react-simplikit` 的所有实现都使用特殊的渲染函数，来验证它们在 SSR 环境中能否安全运行。

- 组件测试

  ```tsx
  it('is safe on server side rendering', () => {
    // renderSSR.serverOnly 是在服务端环境中渲染组件的方法。
    // 在这个环境中，useEffect 这类 Hook 不会执行，window、document 这类对象也无法使用，用到它们就会报错。
    renderSSR.serverOnly(() => (
      <Component>
        <div>Test Content</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render children correctly', async () => {
    // renderSSR 是在客户端环境中渲染组件的方法。
    // 不过，如果服务端渲染出的 HTML 和客户端渲染出的 HTML 不一致，就会出现 hydration 不匹配的错误。
    await renderSSR(() => (
      <Component>
        <div>Test Content</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should hydration mismatch error occurred', async () => {
    // 这段测试代码会因为 hydration 不匹配的错误而失败。
    await renderSSR(() => (
      <Component>
        <div>Test Content</div>
        <div>{Math.random()}</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  ```

- Hook 测试

  ```ts
  it('is safe on server side rendering', () => {
    // renderHookSSR.serverOnly 是在服务端环境中渲染 Hook 的方法。
    // 在这个环境中，useEffect 这类 Hook 不会执行，window、document 这类对象也无法使用，用到它们就会报错。
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

### 创建 Changeset

当你的代码改动会影响这个包时，就需要创建一个 changeset。Changesets 是一个把版本管理和 changelog 生成自动化的工具。

#### 如何创建 Changeset

1. 实现改动之后，运行下面的命令：

```bash
yarn changeset
```

2. 选择改动的类型：

   - `patch`：修复 bug 或小改动
   - `minor`：新增功能（保持向后兼容）
   - `major`：破坏性变更（打破向后兼容）

3. 简要写下这次改动的内容。

::: tip
这个包目前处于 `0.x` 阶段。在这个阶段，大多数改动都应该使用 `patch`。
如果你不确定该用哪种版本类型，请与维护者讨论。
:::

4. 把生成的 changeset 文件和 PR 一起提交。

::: tip
Changeset 文件会创建在 `.changeset` 文件夹中，必须和 PR 一起提交。PR 合并后，版本会自动更新，并生成 changelog。
:::

### 发布

当改动合并到 `main` 分支后，发布流程会自动执行：

1. PR 合并到 `main` 分支后，GitHub Actions 会运行。
2. 如果存在 changeset，系统会自动创建一个更新版本的 PR。
3. 更新版本的 PR 合并后，新版本会发布到 npm。

你可以在 [GitHub Actions](https://github.com/toss/react-simplikit/actions) 中查看发布结果。

## 贡献文档

贡献文档没有特别的条件。如果你发现了错误的信息、质量不佳的翻译，或者有想补充的内容，欢迎随时修改。请从读者的角度出发，把文档写得清晰、简洁。

## 脚手架

我们提供了一个命令，用来生成贡献所需的最小骨架。用下面的命令可以创建一个带有基本结构的实现文件夹：

```bash
yarn run scaffold <name> --type <type>
```

- `type`：实现的类型，必须是 `component`、`hook` 或 `util` 之一。
- `name`：实现的名称。

### 示例

```bash
yarn run scaffold Button --type component
```

这个命令会在 `src/components/Button` 文件夹中创建三个文件：

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
你也可以使用这些简写：

```bash
yarn run scaffold Button --t c // 创建组件
yarn run scaffold useButton --t h // 创建 Hook
yarn run scaffold getButton --t u // 创建工具函数
```

:::

## 贡献流程

脚手架 → 实现 → 测试 → 文档 → 评审 → Changeset → 合并

### 覆盖率检查清单

- [ ] 所有 if/else 分支
- [ ] 所有 switch case
- [ ] 所有提前 return
- [ ] 清理函数（useEffect 返回的函数）

### 实现规范

- 只使用具名导出
- 最大限度地利用 TypeScript 的类型推断
- 必填参数放在前面，可选参数放在最后；可选参数达到三个或更多时使用选项对象
- 只有一个值时直接返回该值，状态和操作成对时返回 `[state, action]` 元组，成员更多或形态将来会扩展时（例如键盘高度、安全区域内边距这类浏览器测量值）返回对象
- 应用下面的 SSR 安全模式

### SSR 安全模式

不要在渲染期间读取浏览器 API：服务端没有 `window`，而客户端的值一旦和服务端不一致就会导致 hydration 不匹配。从一个固定的初始值开始，在 effect 中同步：

```ts
const [state, setState] = useState(FIXED_INITIAL_VALUE);

useEffect(function syncBrowserState() {
  if (isServer()) {
    return;
  }

  setState(readBrowserApi());
}, []);
```

### 浏览器和移动端 Web Hook

- 对高频事件（`scroll`、`resize`、`visualViewport` 变化）按约 16ms 节流，值没有变化时跳过更新，非紧急的更新使用 `startTransition`
- 处理函数从不调用 `preventDefault` 时，使用被动事件监听器
- 处理平台差异，而不是只照顾某一个平台：

  | 特性                       | iOS                  | Android        |
  | -------------------------- | -------------------- | -------------- |
  | `visualViewport.offsetTop` | 键盘出现时会变成负数 | 通常保持为 0   |
  | 键盘行为                   | 视口被整体向上顶起   | 布局被重新调整 |

- jsdom 无法重现视觉视口和软键盘，所以除了测试之外，还要在真实的 iOS Safari 和 Android Chrome 设备上验证这些 Hook
