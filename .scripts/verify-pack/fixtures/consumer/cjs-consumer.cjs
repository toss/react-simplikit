const assert = require('node:assert');

const core = require('react-simplikit');

assert.strictEqual(typeof core.useToggle, 'function');
assert.ok(core.ImpressionArea != null);
assert.strictEqual(typeof core.useNetworkStatus, 'function');
console.log('CJS smoke OK');
