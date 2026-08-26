import assert from 'node:assert';

import { ImpressionArea, useNetworkStatus, useToggle } from 'react-simplikit';

assert.strictEqual(typeof useToggle, 'function');
assert.ok(ImpressionArea != null);
assert.strictEqual(typeof useNetworkStatus, 'function');
console.log('ESM smoke OK');
