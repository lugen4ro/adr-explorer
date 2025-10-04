import type { ADR, ADRDirectory } from "@/types/adr";
import type { ISearchService } from "./interfaces";

/**
 * Service for searching and filtering ADRs based on text queries.
 *
 * Provides functionality to search through ADR titles and content
 * while maintaining the hierarchical directory structure.
 */
export class SearchService implements ISearchService {
  /**
   * Searches ADRs in a directory structure based on a text query.
   *
   * @param directory - The ADR directory structure to search
   * @param query - The search query (case-insensitive)
   * @returns A filtered directory structure containing only matching ADRs
   */
  searchADRs(directory: ADRDirectory, query: string): ADRDirectory {
    const trimmedQuery = query.trim();

    // If query is empty, return the original directory
    if (!trimmedQuery) {
      return directory;
    }

    const searchTerms = trimmedQuery.toLowerCase().split(/\s+/);

    return this.filterDirectory(directory, searchTerms);
  }

  /**
   * Recursively filters a directory structure based on search terms.
   *
   * @param directory - The directory to filter
   * @param searchTerms - Array of search terms (already lowercased)
   * @returns A filtered directory structure
   * @private
   */
  private filterDirectory(
    directory: ADRDirectory,
    searchTerms: string[],
  ): ADRDirectory {
    // Filter ADRs in current directory
    const filteredADRs = directory.adrs.filter((adr) =>
      this.matchesSearchTerms(adr, searchTerms),
    );

    // Recursively filter subdirectories
    const filteredSubdirectories = directory.subdirectories
      .map((subdir) => this.filterDirectory(subdir, searchTerms))
      .filter(
        (subdir) => subdir.adrs.length > 0 || subdir.subdirectories.length > 0,
      );

    return {
      name: directory.name,
      path: directory.path,
      adrs: filteredADRs,
      subdirectories: filteredSubdirectories,
    };
  }

  /**
   * Checks if an ADR matches all search terms.
   *
   * @param adr - The ADR to check
   * @param searchTerms - Array of search terms (already lowercased)
   * @returns True if the ADR matches all search terms
   * @private
   */
  private matchesSearchTerms(adr: ADR, searchTerms: string[]): boolean {
    const searchableText = this.getSearchableText(adr);

    return searchTerms.every((term) => searchableText.includes(term));
  }

  /**
   * Extracts searchable text from an ADR object.
   *
   * @param adr - The ADR to extract text from
   * @returns Lowercased concatenated text from title and content
   * @private
   */
  private getSearchableText(adr: ADR): string {
    const parts = [adr.title, adr.content, adr.category || ""];

    return parts.join(" ").toLowerCase();
  }

  /**
   * Counts the total number of ADRs in a directory structure.
   *
   * @param directory - The directory structure to count
   * @returns Total number of ADRs
   */
  countADRs(directory: ADRDirectory): number {
    let count = directory.adrs.length;

    for (const subdir of directory.subdirectories) {
      count += this.countADRs(subdir);
    }

    return count;
  }
}
