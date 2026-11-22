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

export type Span = {
  start: number;
  end: number;
};

export type Splice = Span & {
  text: string;
};
