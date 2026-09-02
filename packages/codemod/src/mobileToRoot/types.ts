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
