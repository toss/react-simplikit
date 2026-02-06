# Contributing to react-simplikit

`react-simplikit` is designed to encourage contributions from anyone. If you'd like to contribute, please follow the guide below.

## Implementation Contribution

When contributing implementations, add them to the appropriate directory based on their type (`components`, `hooks`, or `utils`). Each implementation must include the following elements:

- **Implementation**
- **Test Code**
- **JSDoc**

::: tip
**Do I need to write documentation?**

No, you don't need to write documentation separately. Instead, please write detailed JSDoc comments. Once your PR is merged, English and Korean documentation will be automatically generated based on the JSDoc, and a PR for adding the documentation will be automatically created.
:::

### Writing Implementations

You must follow `react-simplikit`'s [Design Principles](./design-principles.md). We don't provide implementations that depend on specific libraries or are tightly coupled with React's lifecycle. Please write implementations that adhere to these design principles.

### Writing JSDoc

All implementations must include [JSDoc](https://jsdoc.app/) comments. These provide hints when using the implementation and play a crucial role in generating documentation.
JSDoc comments must include `@description` and `@example`, and if there are parameters or return values, they should include `@param` and `@returns`.

::: details JSDoc writing rules must be followed for accurate documentation generation. If JSDoc validation fails, CI might fail.

- JSDoc must be written in English.
- `@description`: A required tag that clearly explains the implementation's functionality or role.
- `@example`: A required tag that shows example code demonstrating how to use the implementation.
- `@param`: Write the parameter's name and description. Must be included if the implementation has parameters.

  - For required parameters: `@param {<type>} <parameter name> - <parameter description>`
  - For optional parameters: `@param {<type>} [<parameter name>] - <parameter description>`
  - For object parameters, both the object itself and its properties need `@param` tags.
  - If you want to write a list under a description, use `--` instead of `-`.

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

    This JSDoc will be converted into the following documentation.

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

- `@returns`: Write the return value's name and description. Must be included if the implementation has return values.

  - Format: `@returns {<type>} <return value description>`
  - For object or tuple return values, include descriptions for each member.
  - If additional details are needed for each member, please use `:`.

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

    This JSDoc will be converted into the following documentation.

    <div class='codeblock'>
      <Interface
        name=""
        type="[value: string, onChange: () => void]"
        description="A tuple containing:"
        :nested="[
          {
            name: 'obj',
            type: 'Object',
            description: 'The value of the input. <br />  : label <code>string</code> - The label of the input. <br />  : value <code>string</code> - The value of the input.',
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

    Object-type return values can be written in a similar way.

    ```ts
    type ReturnValue = { value: string; onChange: () => void };

    /**
     * @returns {Object} An object containing:
     * - value `string` - The value of the input.
     * - onChange `() => void` - A function to update the value.
     */
    ```

    This JSDoc will be converted into the following documentation.

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

### Writing Test Code

All implementations must include test code, written with the same name as the implementation. Test coverage must always reach 100%. Use the following command to verify coverage:

```bash
yarn test:coverage
```

::: details Please verify safe operation in SSR environments
All `react-simplikit` implementations use special rendering functions to verify safe operation in SSR environments.

- Component Testing

  ```tsx
  it('is safe on server side rendering', () => {
    // renderSSR.serverOnly is a method that renders the component in the server environment.
    // In this environment, hooks like useEffect are not executed, and objects like window or document are not available, causing errors.
    renderSSR.serverOnly(() => (
      <Component>
        <div>Test Content</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render children correctly', async () => {
    // renderSSR is a method that renders the component in the client environment.
    // However, if the HTML rendered on the server and the HTML rendered on the client are different, hydration mismatch errors will occur.
    await renderSSR(() => (
      <Component>
        <div>Test Content</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should hydration mismatch error occured', async () => {
    // This test code will fail due to a hydration mismatch error.
    await renderSSR(() => (
      <Component>
        <div>Test Content</div>
        <div>{Math.random()}</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  ```

- Hook Testing

  ```ts
  it('is safe on server side rendering', () => {
    // renderHookSSR.serverOnly is a method that renders the hook in the server environment.
    // In this environment, hooks like useEffect are not executed, and objects like window or document are not available, causing errors.
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

### Creating a Changeset

When your code changes affect the package, you need to create a changeset. Changesets are a tool that automates version management and changelog generation.

#### How to Create a Changeset

1. After implementing your changes, run the following command:

```bash
yarn changeset
```

2. Select the type of change:

   - `patch`: Bug fixes or minor changes
   - `minor`: New features (maintaining backward compatibility)
   - `major`: Breaking changes (breaking backward compatibility)

3. Write a brief summary of your changes.

4. Commit the generated changeset file with your PR.

::: tip
Changeset files are created in the `.changeset` folder and must be committed with your PR. When the PR is merged, the version will be automatically updated and a changelog will be generated.
:::

### Release

When changes are merged into the `main` branch, the release process happens automatically:

1. When a PR is merged into the `main` branch, GitHub Actions will run.
2. If there are changesets, a version update PR will be automatically created.
3. When the version update PR is merged, the new version will be published to npm.

You can view the release results in [GitHub Actions](https://github.com/toss/react-simplikit/actions).

## Documentation Contribution

There are no specific conditions for contributing to documentation. If you find incorrect information, poor translations, or have additional content to add, feel free to make edits. Please write documentation clearly and concisely from the reader's perspective.

## Scaffolding

There's a command that creates the minimum skeleton for contributions. Use the following command to create an implementation folder with a basic structure:

```bash
yarn run scaffold <name> --type <type>
```

- `type`: Implementation type, must be one of `component`, `hook`, or `util`.
- `name`: Name of the implementation.

### Example

```bash
yarn run scaffold Button --type component
```

This command creates three files in the `src/components/Button` folder:

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
You can also use these shortcuts:

```bash
yarn run scaffold Button --t c // Create component
yarn run scaffold useButton --t h // Create hook
yarn run scaffold getButton --t u // Create util
```

:::
