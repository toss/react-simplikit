export type ChangeKind = 'import' | 'export' | 'require' | 'dynamic-import' | 'import-type' | 'mock' | 'merge';

export type SourceChange = {
  line: number;
  kind: ChangeKind;
};

export type TransformSourceResult = {
  code: string;
  changes: SourceChange[];
};

export type Splice = {
  start: number;
  end: number;
  text: string;
};

export type PackageJsonChange = {
  field: string;
  removed: string;
  // `undefined` when the manifest already depended on the root package, so the
  // codemod only removed the old entry.
  added: string | undefined;
};
