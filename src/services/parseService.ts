import {
  getAllFieldKeywords,
  getAllStatusKeywords,
  type I18nConfig,
  i18nConfig,
} from "@/lib/i18n";
import type { ADR } from "@/types/adr";
import { ADRStatus } from "@/types/adr";
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
    const { title, status, date } = this.parseMetadata(content, fileName);

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
  private parseMetadata(
    content: string,
    fileName: string,
  ): {
    title: string;
    status: ADRStatus;
    date?: string;
  } {
    const lines = content.split("\n");

    let title = "Untitled ADR";
    let status = ADRStatus.UNKNOWN;
    let date: string | undefined;
    let inCodeBlock = false;
    let hasSeenH2 = false;

    // First, try to extract date from filename
    date = this.extractDateFromFilename(fileName);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Track code blocks - ignore everything inside them
      if (trimmedLine.startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      // Skip processing if we're inside a code block
      if (inCodeBlock) {
        continue;
      }

      // Check for title (H1 header)
      if (trimmedLine.startsWith("# ")) {
        title = trimmedLine.substring(2).trim();
      }
      // Check for H2 headers
      else if (trimmedLine.startsWith("## ")) {
        hasSeenH2 = true; // Mark that we've seen the first H2
        const heading = trimmedLine.substring(3).trim();

        if (status === ADRStatus.UNKNOWN && this.isStatusHeading(heading)) {
          // Look for the next non-empty line after status heading
          for (let j = i + 1; j < lines.length; j++) {
            const nextLine = lines[j].trim();
            if (nextLine.length > 0) {
              status = this.parseStatusFromString(nextLine);
              break;
            }
          }
        }
      }
      // Only look for date in content if not found in filename AND before first H2
      else if (!hasSeenH2 && !date && this.isDateHeading(trimmedLine)) {
        // Try to extract date from the same line first (e.g., "Date: 2025-09-06")
        const dateFromSameLine = this.extractDateFromLine(trimmedLine);
        if (dateFromSameLine) {
          date = dateFromSameLine;
        } else {
          // Fallback: Look for the next non-empty line after date keyword
          for (let j = i + 1; j < lines.length; j++) {
            const nextLine = lines[j].trim();
            if (nextLine.length > 0) {
              date = nextLine;
              break;
            }
          }
        }
      }

      // Early exit: if we have found all the metadata we need, stop parsing
      if (title !== "Untitled ADR" && status !== ADRStatus.UNKNOWN && date) {
        break;
      }
    }

    return { title, status, date };
  }

  /**
   * Checks if a line contains any field keywords (case-insensitive).
   * Uses the i18n configuration for comprehensive language support.
   */
  /**
   * Checks if a heading text indicates a status field
   */
  private isStatusHeading(heading: string): boolean {
    const keywords = getAllFieldKeywords("status");
    const lowercaseHeading = heading.toLowerCase();
    return keywords.some((keyword) =>
      lowercaseHeading.includes(keyword.toLowerCase()),
    );
  }

  /**
   * Checks if a heading text indicates a date field
   */
  private isDateHeading(heading: string): boolean {
    const keywords = getAllFieldKeywords("date");
    const lowercaseHeading = heading.toLowerCase();
    const isMatch = keywords.some((keyword) =>
      lowercaseHeading.includes(keyword.toLowerCase()),
    );

    return isMatch;
  }

  /**
   * Extracts date value from a line that contains both keyword and value
   * Examples: "Date: 2025-09-06", "Created: 2023-01-15", etc.
   */
  private extractDateFromLine(line: string): string | undefined {
    const keywords = getAllFieldKeywords("date");
    const lowercaseLine = line.toLowerCase();

    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      if (lowercaseLine.includes(keywordLower)) {
        // Look for patterns like "keyword: value" or "keyword value"
        const patterns = [
          new RegExp(`${keywordLower}\\s*:\\s*(.+)`, "i"),
          new RegExp(`${keywordLower}\\s+(.+)`, "i"),
        ];

        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match && match[1]) {
            return match[1].trim();
          }
        }
      }
    }

    return undefined;
  }

  /**
   * Extracts date from filename using common ADR date patterns
   * Supports formats like: YYYY-MM-DD, YYYYMMDD, etc.
   */
  private extractDateFromFilename(fileName: string): string | undefined {
    // Remove .md extension for pattern matching
    const nameWithoutExt = fileName.replace(/\.md$/, "");

    // Common date patterns in ADR filenames
    const datePatterns = [
      // YYYY-MM-DD format (most common)
      /^(\d{4}-\d{2}-\d{2})/,
      // YYYYMMDD format
      /^(\d{8})/,
      // YYYY_MM_DD format
      /^(\d{4}_\d{2}_\d{2})/,
      // Date after number: 0001-2023-01-15-title
      /^\d+-?(\d{4}-\d{2}-\d{2})/,
      // Date in middle: 0001_2023_01_15_title
      /^\d+[_-]?(\d{4}[_-]\d{2}[_-]\d{2})/,
    ];

    for (const pattern of datePatterns) {
      const match = nameWithoutExt.match(pattern);
      if (match) {
        // Normalize date format to YYYY-MM-DD
        let dateStr = match[1];
        if (dateStr.length === 8) {
          // Convert YYYYMMDD to YYYY-MM-DD
          dateStr = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
        } else if (dateStr.includes("_")) {
          // Convert YYYY_MM_DD to YYYY-MM-DD
          dateStr = dateStr.replace(/_/g, "-");
        }
        return dateStr;
      }
    }

    return undefined;
  }

  /**
   * Converts a string status to ADRStatus enum.
   * Uses the i18n configuration for comprehensive language support.
   * Falls back to UNKNOWN if no match is found.
   */
  private parseStatusFromString(statusString: string): ADRStatus {
    const normalized = statusString.toLowerCase().trim();

    // Check each status type against all its international variants
    for (const statusKey of Object.keys(i18nConfig.statusValues)) {
      const keywords = getAllStatusKeywords(
        statusKey as keyof I18nConfig["statusValues"],
      );

      if (
        keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))
      ) {
        return ADRStatus[statusKey as keyof typeof ADRStatus];
      }
    }

    return ADRStatus.UNKNOWN;
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
