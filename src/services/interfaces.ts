import type { ADR, ADRDirectory } from "@/types/adr";

/**
 * Interface for ADR parsing services.
 */
export interface IParseService {
  /**
   * Parses a markdown file into an ADR object.
   *
   * @param content - Raw markdown content of the ADR file
   * @param fileName - Name of the file (used to generate ADR ID)
   * @param filePath - Full path to the file (used for category extraction)
   * @returns Parsed ADR object with extracted metadata
   */
  parseADR(content: string, fileName: string, filePath: string): ADR;
}

/**
 * Interface for file system services that handle ADR discovery and management.
 */
export interface IFileService {
  /**
   * Gets all ADRs in both hierarchical and flattened formats.
   *
   * @returns Promise that resolves to an object containing both the directory structure and flattened array
   */
  getAllADRs(): Promise<{
    directory: ADRDirectory;
    allADRs: ADR[];
  }>;
}

/**
 * Interface for ADR search services.
 */
export interface ISearchService {
  /**
   * Searches ADRs in a directory structure based on a text query.
   *
   * @param directory - The ADR directory structure to search
   * @param query - The search query (case-insensitive)
   * @returns A filtered directory structure containing only matching ADRs
   */
  searchADRs(directory: ADRDirectory, query: string): ADRDirectory;

  /**
   * Counts the total number of ADRs in a directory structure.
   *
   * @param directory - The directory structure to count
   * @returns Total number of ADRs
   */
  countADRs(directory: ADRDirectory): number;
}
