import { promises as fs } from "node:fs";
import path from "node:path";
import type { ADR, ADRDirectory } from "@/types/adr";

/**
 * Scans the ADR content directory and loads all ADR files into a hierarchical structure.
 *
 * @returns Promise that resolves to an object containing:
 *   - directory: The complete hierarchical directory structure with all ADRs
 *   - allADRs: A flattened array of all ADR objects for easy iteration
 *
 * @throws Error if the content/adr directory cannot be accessed or ADR files cannot be loaded
 *
 * @example
 * ```typescript
 * const { directory, allADRs } = await getAllADRs();
 * console.log(`Found ${allADRs.length} ADRs`);
 * ```
 */
export async function getAllADRs(): Promise<{
  directory: ADRDirectory;
  allADRs: ADR[];
}> {
  const docsPath = path.join(process.cwd(), "content", "adr");
  const directory = await scanDirectory(docsPath, "root");
  const allADRs = flattenADRs(directory);

  return { directory, allADRs };
}

/**
 * Recursively flattens a hierarchical ADR directory structure into a single array.
 *
 * @param directory - The ADR directory structure to flatten
 * @returns A flat array containing all ADR objects from the directory and its subdirectories
 *
 * @example
 * ```typescript
 * const directory = await scanDirectory('/path/to/adrs', 'root');
 * const allADRs = flattenADRs(directory);
 * // Returns all ADRs regardless of their directory nesting level
 * ```
 */
export function flattenADRs(directory: ADRDirectory): ADR[] {
  const adrs: ADR[] = [...directory.adrs];

  for (const subdir of directory.subdirectories) {
    adrs.push(...flattenADRs(subdir));
  }

  return adrs;
}

/**
 * Recursively scans a directory for ADR markdown files and subdirectories.
 *
 * @param dirPath - The absolute path to the directory to scan
 * @param name - The display name for this directory level
 * @returns Promise that resolves to an ADRDirectory object containing all ADRs and subdirectories
 *
 * @remarks
 * - Only includes subdirectories that contain ADR files or other non-empty subdirectories
 * - Filters for .md files only
 * - Gracefully handles directory access errors by logging warnings
 *
 * @internal This function is used internally by getAllADRs()
 */
async function scanDirectory(
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
      mdFiles.map((file) => loadADR(path.join(dirPath, file), file)),
    );

    // Check for subdirectories
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        const subdirectory = await scanDirectory(fullPath, file);
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
 * Loads and parses a single ADR markdown file into an ADR object.
 *
 * @param filePath - The absolute path to the ADR markdown file
 * @param fileName - The filename (including .md extension) of the ADR file
 * @returns Promise that resolves to a complete ADR object with parsed metadata
 *
 * @throws Error if the file cannot be read or parsed
 *
 * @remarks
 * - Extracts metadata (title, status, date) from markdown content
 * - Generates an ID by removing the .md extension from the filename
 * - Automatically determines category based on file path
 *
 * @internal This function is used internally by scanDirectory()
 */
async function loadADR(filePath: string, fileName: string): Promise<ADR> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const { title, status, date } = parseADRMetadata(content);

    return {
      id: fileName.replace(".md", ""),
      title,
      status,
      date,
      path: filePath,
      content,
      category: extractCategory(filePath),
    };
  } catch (_error) {
    throw new Error(`Failed to load ADR: ${filePath}`);
  }
}

/**
 * Parses metadata from ADR markdown content using simple pattern matching.
 *
 * @param content - The raw markdown content of the ADR file
 * @returns Object containing extracted title, status, and optional date
 *
 * @remarks
 * - Title: Extracted from the first line starting with "# "
 * - Status: Extracted from the line following any line containing "status" (case-insensitive)
 * - Date: Extracted from the line following any line containing "date" (case-insensitive)
 * - Falls back to default values if metadata cannot be found
 *
 * @example
 * ```typescript
 * const metadata = parseADRMetadata(`
 * # My ADR Title
 * Status
 * Accepted
 * Date
 * 2024-01-15
 * `);
 * // Returns: { title: "My ADR Title", status: "Accepted", date: "2024-01-15" }
 * ```
 *
 * @internal This function is used internally by loadADR()
 */
function parseADRMetadata(content: string): {
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
    } else if (line.toLowerCase().includes("status")) {
      const nextLineIndex = lines.indexOf(line) + 1;
      if (nextLineIndex < lines.length) {
        status = lines[nextLineIndex].trim();
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
 * Extracts the category name from an ADR file path based on its parent directory.
 *
 * @param filePath - The absolute path to the ADR file
 * @returns The category name (parent directory) or undefined if the file is in the root ADR directory
 *
 * @remarks
 * - Returns the immediate parent directory name as the category
 * - Returns undefined for files directly in the root content/adr directory
 * - Used to organize ADRs by their directory structure
 *
 * @example
 * ```typescript
 * extractCategory('/path/to/content/adr/backend/api-design.md')
 * // Returns: "backend"
 *
 * extractCategory('/path/to/content/adr/simple-adr.md')
 * // Returns: undefined
 * ```
 *
 * @internal This function is used internally by loadADR()
 */
function extractCategory(filePath: string): string | undefined {
  const pathParts = filePath.split(path.sep);
  if (pathParts.length > 2) {
    return pathParts[pathParts.length - 2];
  }
  return undefined;
}
