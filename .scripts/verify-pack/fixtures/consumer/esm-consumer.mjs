import assert from 'node:assert';

import { useNetworkStatus } from '@react-simplikit/mobile';
import { ImpressionArea, useToggle } from 'react-simplikit';

assert.strictEqual(typeof useToggle, 'function');
assert.ok(ImpressionArea != null);
assert.strictEqual(typeof useNetworkStatus, 'function');
console.log('ESM smoke OK');
