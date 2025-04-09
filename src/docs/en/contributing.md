# Contributing to react-simplikit

`react-simplikit` is designed to encourage contributions from anyone. If you'd like to contribute, please follow the guide below.

## Feature Contribution

When contributing features, add them to the appropriate directory based on their type (`components`, `hooks`, or `utils`). Each feature must include the following elements:

- **Feature**
- **Guide Documentation**
- **Test Code**
- **JSDoc**

### Writing Features

Follow the [Design Principles](./design-principles) of `react-simplikit`. Do not create features that depend on specific libraries or are tightly coupled with React's lifecycle. Ensure your feature aligns with these principles.

### Writing Guide Documentation

Every feature must have guide documentation. Use the same name as the feature for the document, as it will automatically be included in the documentation list. Ensure the guide is clear and explains usage thoroughly.

### Writing Test Code

All features must include test code, written with the same name as the feature. Test coverage must always reach 100%. Use the following command to verify coverage:

```bash
yarn test:coverage
```

### Writing JSDoc

Every feature must include JSDoc comments. You can use any JSDoc Block Tags, but the following two tags are mandatory:

- @description: Clearly describe the purpose and functionality of the feature.
- @example: Provide an example code snippet showing how to use the feature.

### Deployment

When changes are merged into the main branch, deployment happens automatically. You can view the deployment results in [GitHub Actions](https://github.com/toss/react-simplikit/actions).

## Documentation Contribution

There are no specific conditions for contributing to documentation. If you find incorrect information or have additional content to add, feel free to make edits. Ensure the documentation is clear, concise, and easy for readers to understand.
