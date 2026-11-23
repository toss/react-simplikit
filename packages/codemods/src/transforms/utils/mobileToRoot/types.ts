export type SourceNote = {
  line: number;
  reason: string;
};

export type TransformSourceResult = {
  code: string;
  notes: SourceNote[];
};

export type Span = {
  start: number;
  end: number;
};

export type Comment = Span & {
  type: string;
};

export type Splice = Span & {
  text: string;
};
