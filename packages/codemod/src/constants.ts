export const MOBILE_PACKAGE_NAME = '@react-simplikit/mobile';

export const ROOT_PACKAGE_NAME = 'react-simplikit';

export const TRANSFORM_NAME = 'mobile-to-root';

// The first react-simplikit release that re-exports `SafeAreaInset` from the root
// barrel. Rewriting imports to an older release leaves that one type unresolved.
// Provisional until #453 ships — confirm with `npm view react-simplikit version`
// before this CLI is published.
export const MIN_RUNTIME_VERSION = '0.2.0';
