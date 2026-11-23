const { isIOS } = require('react-simplikit');
jest.mock('react-simplikit');
module.exports = { isIOS, actual: jest.requireActual('react-simplikit') };
