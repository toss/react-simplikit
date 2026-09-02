export const MOBILE_PACKAGE_NAME = '@react-simplikit/mobile';

export const ROOT_PACKAGE_NAME = 'react-simplikit';

export const TRANSFORM_NAME = 'mobile-to-root';

// Must name a version that is actually published: a range nothing satisfies breaks every
// migrated install with ETARGET. Check `npm view react-simplikit version` before releasing.
export const MIN_RUNTIME_VERSION = '0.2.0';
