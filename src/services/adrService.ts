import { promises as fs } from "node:fs";
import path from "node:path";
import type { ADR, ADRDirectory } from "@/types/adr";

/**
 * Service for discovering, parsing, and managing Architectural Decision Records (ADRs).
 * 
 * This service scans the filesystem for markdown files containing ADR content,
 * parses their metadata, and provides a hierarchical directory structure.
 * 
 * @example
 * ```typescript
 * const adrService = new ADRService("adr");
 * const directory = await adrService.discoverADRs();
 * console.log(directory.adrs); // Array of parsed ADR objects
 * ```
 */
export class ADRService {
  private basePath: string;

  /**
   * Creates a new ADRService instance.
   * 
   * @param basePath - The base directory name within the content folder to scan for ADRs.
   *                   Defaults to "adr". The full path will be `content/{basePath}`.
   */
  constructor(basePath = "adr") {
    this.basePath = basePath;
  }

  /**
   * Discovers all ADR files in the configured base path and returns a hierarchical directory structure.
   * 
   * Scans the `content/{basePath}` directory recursively for markdown files,
   * parsing each one as an ADR and organizing them into a tree structure.
   * 
   * @returns Promise that resolves to the root ADRDirectory containing all discovered ADRs
   * @throws Error if the base path cannot be accessed or parsed
   */
  async discoverADRs(): Promise<ADRDirectory> {
    const docsPath = path.join(process.cwd(), "content", this.basePath);
    return await this.scanDirectory(docsPath, "root");
  }

  /**
   * Recursively scans a directory for ADR files and subdirectories.
   * 
   * @param dirPath - Absolute path to the directory to scan
   * @param name - Display name for this directory level
   * @returns Promise that resolves to an ADRDirectory with parsed ADRs and subdirectories
   * @private
   */
  private async scanDirectory(
    dirPath: string,
    name: string,
  ): Promise<ADRDirectory> {
    const directory: ADRDirectory = {
      name,
      path: dirPath,
      adrs: [],
      subdirectories: [],
    };

    try {
      // Scan directory for .md files
      const files = await fs.readdir(dirPath);
      const mdFiles = files.filter((file) => file.endsWith(".md"));

      directory.adrs = await Promise.all(
        mdFiles.map((file) => this.loadADR(path.join(dirPath, file), file)),
      );

      // Check for subdirectories
      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          const subdirectory = await this.scanDirectory(fullPath, file);
          if (
            subdirectory.adrs.length > 0 ||
            subdirectory.subdirectories.length > 0
          ) {
            directory.subdirectories.push(subdirectory);
          }
        }
      }
    } catch (_error) {
      console.warn(`Failed to scan directory ${dirPath}:`, _error);
    }

    return directory;
  }

  /**
   * Loads and parses a single ADR markdown file.
   * 
   * @param filePath - Absolute path to the ADR markdown file
   * @param fileName - Name of the file (used to generate ADR ID)
   * @returns Promise that resolves to a parsed ADR object
   * @throws Error if the file cannot be read or parsed
   * @private
   */
  private async loadADR(filePath: string, fileName: string): Promise<ADR> {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const { title, status, date } = this.parseADRMetadata(content);

      return {
        id: fileName.replace(".md", ""),
        title,
        status,
        date,
        path: filePath,
        content,
        category: this.extractCategory(filePath),
      };
    } catch (_error) {
      throw new Error(`Failed to load ADR: ${filePath}`);
    }
  }

  /**
   * Parses ADR metadata from markdown content.
   * 
   * Extracts title (from H1 header), status (from "## Status" section),
   * and date (from lines containing "date") from the markdown content.
   * 
   * @param content - Raw markdown content of the ADR file
   * @returns Object containing extracted metadata with default fallbacks
   * @private
   */
  private parseADRMetadata(content: string): {
    title: string;
    status: string;
    date?: string;
  } {
    const lines = content.split("\n");

    let title = "Untitled ADR";
    let status = "Unknown";
    let date: string | undefined;

    for (const line of lines) {
      if (line.startsWith("# ")) {
        title = line.substring(2).trim();
      } else if (line.toLowerCase().startsWith("## status")) {
        const nextLineIndex = lines.indexOf(line) + 1;
        if (nextLineIndex < lines.length) {
          const statusLine = lines[nextLineIndex].trim();
          if (statusLine && !statusLine.startsWith("#")) {
            status = statusLine;
          }
        }
      } else if (line.toLowerCase().includes("date")) {
        const nextLineIndex = lines.indexOf(line) + 1;
        if (nextLineIndex < lines.length) {
          date = lines[nextLineIndex].trim();
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
   * @private
   */
  private extractCategory(filePath: string): string | undefined {
    const pathParts = filePath.split(path.sep);
    if (pathParts.length > 2) {
      return pathParts[pathParts.length - 2];
    }
    return undefined;
  }
}
