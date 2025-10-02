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
   * Discovers all ADR files in the configured base path and returns a hierarchical directory structure.
   *
   * @returns Promise that resolves to the root ADRDirectory containing all discovered ADRs
   */
  discoverADRs(): Promise<ADRDirectory>;

  /**
   * Gets all ADRs in both hierarchical and flattened formats.
   *
   * @returns Promise that resolves to an object containing both the directory structure and flattened array
   */
  getAllADRs(): Promise<{
    directory: ADRDirectory;
    allADRs: ADR[];
  }>;

  /**
   * Recursively flattens a hierarchical ADR directory structure into a single array.
   *
   * @param directory - The ADR directory structure to flatten
   * @returns A flat array containing all ADR objects from the directory and its subdirectories
   */
  flattenADRs(directory: ADRDirectory): ADR[];
}
