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

export type FileResult = {
  file: string;
  // Source specifier edits. Empty for package.json files.
  changes: SourceChange[];
  // Dependency field edits. Empty for source files.
  dependencies: PackageJsonChange[];
};

export type ManualNote = {
  file: string;
  reason: string;
};

export type RunResult = {
  scanned: number;
  changed: FileResult[];
  manual: ManualNote[];
};
