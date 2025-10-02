/**
 * Status of an Architectural Decision Record.
 */
export enum ADRStatus {
  PROPOSED = "Proposed",
  ACCEPTED = "Accepted",
  DEPRECATED = "Deprecated",
  SUPERSEDED = "Superseded",
  REJECTED = "Rejected",
}

/**
 * Represents an Architectural Decision Record (ADR) with its metadata and content.
 */
export interface ADR {
  /** Unique identifier for the ADR, typically extracted from the filename */
  id: string;
  /** Human-readable title of the architectural decision */
  title: string;
  /** Current status of the decision */
  status: ADRStatus;
  /** Optional date when the decision was made or last updated */
  date?: string;
  /** File system path to the ADR markdown file */
  path: string;
  /** Full markdown content of the ADR document */
  content: string;
  /** Optional category or classification for grouping related ADRs */
  category?: string;
}

/**
 * Configuration for filtering files during ADR discovery.
 */
export interface ADRFileFilter {
  /** File extensions to include (e.g., ['.md', '.markdown']) */
  allowedExtensions: string[];
  /** Specific filenames to exclude (e.g., ['README.md', 'TEMPLATE.md']) */
  excludedFilenames: string[];
  /** Patterns to exclude (e.g., ['*.template.md', 'draft-*']) */
  excludedPatterns?: string[];
}

/**
 * Represents a directory structure containing ADRs and subdirectories.
 * Used for organizing and navigating hierarchical ADR collections.
 */
export interface ADRDirectory {
  /** Display name of the directory */
  name: string;
  /** File system path to the directory */
  path: string;
  /** Array of ADRs directly contained in this directory */
  adrs: ADR[];
  /** Array of subdirectories for nested organization */
  subdirectories: ADRDirectory[];
}
