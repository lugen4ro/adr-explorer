import type { ADR } from "@/types/adr";
import type { IParseService } from "./interfaces";

/**
 * Service for parsing ADR markdown content and extracting metadata.
 *
 * Handles the parsing of markdown files to extract structured ADR information
 * including title, status, date, and category from file content and paths.
 */
export class ParseService implements IParseService {
  /**
   * Parses a markdown file into an ADR object.
   *
   * @param content - Raw markdown content of the ADR file
   * @param fileName - Name of the file (used to generate ADR ID)
   * @param filePath - Full path to the file (used for category extraction)
   * @returns Parsed ADR object with extracted metadata
   */
  parseADR(content: string, fileName: string, filePath: string): ADR {
    const { title, status, date } = this.parseMetadata(content);

    return {
      id: fileName.replace(".md", ""),
      title,
      status,
      date,
      path: filePath,
      content,
      category: this.extractCategory(filePath),
    };
  }

  /**
   * Parses ADR metadata from markdown content using improved pattern matching.
   *
   * Extracts title (from H1 header), status (from lines containing "status"),
   * and date (from lines containing "date") from the markdown content.
   *
   * @param content - Raw markdown content of the ADR file
   * @returns Object containing extracted metadata with default fallbacks
   *
   * @remarks
   * - Title: Extracted from the first line starting with "# "
   * - Status: Extracted from the next non-empty line following any line containing "status" (case-insensitive)
   * - Date: Extracted from the next non-empty line following any line containing "date" (case-insensitive)
   * - Falls back to default values if metadata cannot be found
   */
  private parseMetadata(content: string): {
    title: string;
    status: string;
    date?: string;
  } {
    const lines = content.split("\n");

    let title = "Untitled ADR";
    let status = "Unknown";
    let date: string | undefined;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("# ")) {
        title = line.substring(2).trim();
      } else if (line.toLowerCase().includes("status")) {
        // Look for the next non-empty line after "status"
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine.length > 0) {
            status = nextLine;
            break;
          }
        }
      } else if (line.toLowerCase().includes("date")) {
        // Look for the next non-empty line after "date"
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine.length > 0) {
            date = nextLine;
            break;
          }
        }
      }
    }

    return { title, status, date };
  }

  /**
   * Extracts the category from an ADR file path.
   *
   * Uses the parent directory name as the category.
   * For example, "/content/adr/backend/decision.md" would return "backend".
   *
   * @param filePath - Absolute path to the ADR file
   * @returns Category name or undefined if path is too shallow
   */
  private extractCategory(filePath: string): string | undefined {
    const pathParts = filePath.split(/[/\\]/); // Handle both Unix and Windows separators
    if (pathParts.length > 2) {
      return pathParts[pathParts.length - 2];
    }
    return undefined;
  }
}
