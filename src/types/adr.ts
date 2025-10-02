export interface ADR {
  id: string;
  title: string;
  status: string;
  date?: string;
  path: string;
  content: string;
  category?: string;
}

export interface ADRDirectory {
  name: string;
  path: string;
  adrs: ADR[];
  subdirectories: ADRDirectory[];
}
