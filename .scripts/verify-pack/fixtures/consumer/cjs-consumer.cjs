const assert = require('node:assert');

const simplikit = require('react-simplikit');

assert.strictEqual(typeof simplikit.useToggle, 'function');
assert.ok(simplikit.ImpressionArea != null);
assert.strictEqual(typeof simplikit.useNetworkStatus, 'function');
console.log('CJS smoke OK');
