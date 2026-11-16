import type { SgRoot } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';
import { useMetricAtom } from 'codemod:metrics';

import { callArguments, createReport, findCalls, propertyKey, propertyName } from '../utils/options.ts';

const manualReview = useMetricAtom('manual-review');

// #534: { edges: ['leading'] } → { leading: true, trailing: false }
const HOOKS: Array<[hook: string, argument: number]> = [
  ['useThrottle', 2],
  ['useThrottledCallback', 0],
];

export default function transform(root: SgRoot<TSX>): string | null {
  const edits = HOOKS.flatMap(([hook, argument]) => {
    const report = createReport(root, manualReview, hook);

    return findCalls(root, hook, report).flatMap(call => {
      const options = callArguments(call)[argument];

      if (options === undefined) {
        return [];
      }

      if (options.kind() !== 'object') {
        report(call, 'options-not-inline');
        return [];
      }

      return options.children().flatMap(property => {
        if (property.kind() === 'spread_element') {
          report(property, 'options-spread');
          return [];
        }

        const isEdges =
          property.kind() === 'shorthand_property_identifier'
            ? property.text() === 'edges'
            : propertyName(propertyKey(property)) === 'edges';

        if (!isEdges) {
          return [];
        }

        const value = property.field('value');
        const items = value?.kind() === 'array' ? value.children().filter(node => node.isNamed()) : [];
        const edges = items.map(item => (item.kind() === 'string' ? item.text().slice(1, -1) : null));

        if (value?.kind() !== 'array' || edges.some(edge => edge !== 'leading' && edge !== 'trailing')) {
          // `{ edges }` or `{ edges: getEdges() }` is only known at runtime.
          report(property, 'edges-not-inline');
          return [];
        }

        return [property.replace(`leading: ${edges.includes('leading')}, trailing: ${edges.includes('trailing')}`)];
      });
    });
  });

  return edits.length === 0 ? null : root.root().commitEdits(edits);
}
