# Demo Page Guidelines

Guidelines for writing new demo pages.

## Core Principles

1. **Logic should be visible first** - Style code should not obscure core logic
2. **Consistent structure** - All demos follow the same pattern
3. **Use shared components** - Repeated patterns use shared components

## Demo Page Structure

```tsx
import {
  Button,
  Card,
  CodeBlock,
  InfoBox,
  StatusCard,
  StatusRow,
} from '@examples/shared';
import { useMyHook } from '@react-simplikit/mobile';
import { DemoLayout } from '../../components/DemoLayout';

// 1. Code example constants (separated at top)
const EXAMPLE_CODE = `import { useMyHook } from '@react-simplikit/mobile';
...`;

export function MyHookDemo() {
  // 2. Core hook usage (clearly at top)
  const { value } = useMyHook();

  return (
    <DemoLayout title="useMyHook" description="Hook description">
      {/* 3. Status display */}
      <StatusCard title="State" description="Real-time state">
        <StatusRow label="Value" value={value} monospace />
      </StatusCard>

      {/* 4. Demo area */}
      <Card title="Demo">
        <InfoBox variant="info">
          <strong>Key Pattern:</strong> Core pattern explanation
        </InfoBox>
        {/* Interactive demo */}
      </Card>

      {/* 5. Code example */}
      <Card title="Implementation Code">
        <CodeBlock code={EXAMPLE_CODE} />
      </Card>
    </DemoLayout>
  );
}
```

## Shared Components

### StatusRow

Displays status values in key-value format.

```tsx
<StatusRow
  label="Direction"
  value={direction || 'none'}
  variant="success" // 'default' | 'success' | 'warning' | 'error' | 'muted'
  monospace // Use for code values
/>
```

### StatusCard

Groups multiple StatusRow components.

```tsx
<StatusCard title="Lock State" description="Real-time status">
  <StatusRow label="Locked" value="Yes" variant="error" />
  <StatusRow label="Position" value="100px" monospace />
</StatusCard>
```

### InfoBox

Displays information, tips, and warnings.

```tsx
<InfoBox variant="info">    {/* Blue - Information */}
<InfoBox variant="tip">     {/* Yellow - Tips */}
<InfoBox variant="warning"> {/* Red - Warning */}
<InfoBox variant="neutral"> {/* Gray - Neutral */}
```

### CodeBlock

Displays code examples.

```tsx
const CODE = `function example() {
  return 'hello';
}`;

<CodeBlock code={CODE} />;
```

## File Structure

```
examples/
├── shared/src/components/   # Shared components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── CodeBlock.tsx
│   ├── Dialog.tsx
│   ├── InfoBox.tsx
│   ├── StatusCard.tsx
│   └── StatusRow.tsx
├── with-nextjs/app/demos/   # Next.js demos
│   └── {hook-name}/page.tsx
└── with-vite/src/pages/demos/  # Vite demos
    └── {HookName}Demo.tsx
```

## Checklist

When writing a new demo:

- [ ] Core hook/util usage is clearly visible at top of file
- [ ] StatusCard displays real-time state
- [ ] InfoBox highlights key patterns/tips
- [ ] CodeBlock provides usage examples
- [ ] Same demo exists for both Vite and Next.js
- [ ] Minimize inline styles (use shared components)

## Example: Before vs After

### Before (styles obscure logic)

```tsx
// 220 lines, core logic buried in styles
<div
  style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}
>
  <span style={{ fontWeight: 500 }}>Modal 1:</span>
  <span style={{ color: showModal1 ? '#16a34a' : '#9ca3af' }}>
    {showModal1 ? 'Open' : 'Closed'}
  </span>
</div>
```

### After (logic is clearly visible)

```tsx
// 164 lines, core logic is immediately visible
<StatusRow
  label="Modal 1"
  value={showModal1 ? 'Open' : 'Closed'}
  variant={showModal1 ? 'success' : 'muted'}
/>
```
