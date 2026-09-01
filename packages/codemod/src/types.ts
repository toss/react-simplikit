export type ChangeKind = 'import' | 'export' | 'require' | 'dynamic-import' | 'import-type' | 'mock' | 'merge';

export type SourceChange = {
  line: number;
  kind: ChangeKind;
};

export type SourceNote = {
  line: number;
  reason: string;
};

export type TransformSourceResult = {
  code: string;
  changes: SourceChange[];
  notes: SourceNote[];
};

export type Splice = {
  start: number;
  end: number;
  text: string;
};

export type PackageJsonChange = {
  field: string;
  removed: string;
  added: string | undefined;
};

export type FileResult = {
  file: string;
  changes: SourceChange[];
  dependencies: PackageJsonChange[];
};

export type ManualNote = {
  file: string;
  line: number | undefined;
  reason: string;
};

export type FileFailure = {
  file: string;
  reason: string;
};

export type RunResult = {
  scanned: number;
  changed: FileResult[];
  manual: ManualNote[];
  failed: FileFailure[];
};
