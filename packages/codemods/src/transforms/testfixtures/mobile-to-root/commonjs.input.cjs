const { isIOS } = require('@react-simplikit/mobile');
jest.mock('@react-simplikit/mobile');
module.exports = { isIOS, actual: jest.requireActual('@react-simplikit/mobile') };
