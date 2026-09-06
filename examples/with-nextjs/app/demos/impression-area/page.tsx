import { ImpressionArea } from 'react-simplikit';

import { DemoLayout } from '../../../components/DemoLayout.tsx';

// Deliberately no 'use client' directive: this page stays a server component so the
// build fails if react-simplikit's "use client" banner is ever missing from its output.
export default function ImpressionAreaPage() {
  return (
    <DemoLayout title="ImpressionArea" description="ImpressionArea renders across the RSC boundary">
      <ImpressionArea>
        <p>This paragraph is wrapped by ImpressionArea, a client component imported from react-simplikit.</p>
      </ImpressionArea>
    </DemoLayout>
  );
}
