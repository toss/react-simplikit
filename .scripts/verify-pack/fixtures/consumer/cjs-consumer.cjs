const assert = require('node:assert');

const core = require('react-simplikit');
const mobile = require('@react-simplikit/mobile');

assert.strictEqual(typeof core.useToggle, 'function');
assert.ok(core.ImpressionArea != null);
assert.strictEqual(typeof mobile.useNetworkStatus, 'function');
console.log('CJS smoke OK');
