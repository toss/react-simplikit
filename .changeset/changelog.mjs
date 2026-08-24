// @changesets/apply-release-plan resolves the changelog generator with
// `import-meta-resolve`, which is not Yarn PnP-aware, so the bare package name
// fails under `nodeLinker: pnp`. A relative path resolves as a file URL instead.
export { default } from '@changesets/changelog-github';
