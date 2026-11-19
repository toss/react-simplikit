import type { SgRoot } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';
import { useMetricAtom } from 'codemod:metrics';

import { renameOptionKeys } from '../utils/options.ts';

const manualReview = useMetricAtom('manual-review');

// #535: useDoubleClick({ click, doubleClick, delay }) → useDoubleClick({ onClick, onDoubleClick, delayMs })
export default function transform(root: SgRoot<TSX>): string | null {
  const edits = renameOptionKeys(root, manualReview, 'useDoubleClick', 0, {
    click: 'onClick',
    doubleClick: 'onDoubleClick',
    delay: 'delayMs',
  });

  return edits.length === 0 ? null : root.root().commitEdits(edits);
}
