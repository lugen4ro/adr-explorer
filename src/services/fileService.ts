import { promises as fs } from "node:fs";
import path from "node:path";
import type { ADR, ADRDirectory, ADRFileFilter } from "@/types/adr";
import type { IFileService, IParseService } from "./interfaces";
import { ParseService } from "./parseService";

/**
 * Filesystem service for discovering ADR markdown files and building directory structures.
 *
 * Handles directory scanning and file reading operations, delegating content parsing
 * to the ParseService for clean separation of concerns.
 *
 * @example
 * ```typescript
 * const fsService = new FileService("adr");
 * const directory = await fsService.discoverADRs();
 * console.log(directory.adrs); // Array of parsed ADR objects
 * ```
 */
export class FileService implements IFileService {
  private basePath: string;
  private parseService: IParseService;
  private fileFilter: ADRFileFilter;

  /**
   * Creates a new FileService instance.
   *
   * @param basePath - The base directory name within the content folder to scan for ADRs.
   *                   Defaults to "adr". The full path will be `content/{basePath}`.
   * @param fileFilter - Optional file filtering configuration. If not provided, uses default filters.
   */
  constructor(basePath = "adr", fileFilter?: ADRFileFilter) {
    this.basePath = basePath;
    this.parseService = new ParseService();
    this.fileFilter = fileFilter || {
      allowedExtensions: [".md", ".markdown"],
      excludedFilenames: ["README.md", "readme.md", "_adr_template.md"],
      excludedPatterns: [],
    };
  }

  /**
   * Gets all ADRs in both hierarchical and flattened formats.
   * Also copies any associated images to the public directory during build.
   *
   * @returns Promise that resolves to an object containing both the directory structure and flattened array
   */
  async getAllADRs(): Promise<{
    directory: ADRDirectory;
    allADRs: ADR[];
  }> {
    const directory = await this.discoverADRs();
    const allADRs = this.flattenADRs(directory);

    // Copy images to public directory during build
    await this.copyImagesToPublic();

    return { directory, allADRs };
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
  private async discoverADRs(): Promise<ADRDirectory> {
    const docsPath = path.join(process.cwd(), "content", this.basePath);
    return await this.scanDirectory(docsPath, "root");
  }

  /**
   * Recursively flattens a hierarchical ADR directory structure into a single array.
   *
   * @param directory - The ADR directory structure to flatten
   * @returns A flat array containing all ADR objects from the directory and its subdirectories
   */
  private flattenADRs(directory: ADRDirectory): ADR[] {
    const adrs: ADR[] = [...directory.adrs];

    for (const subdir of directory.subdirectories) {
      adrs.push(...this.flattenADRs(subdir));
    }

    return adrs;
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
      // Scan directory for files
      const files = await fs.readdir(dirPath);
      const validFiles = files.filter((file) => this.shouldIncludeFile(file));

      directory.adrs = await Promise.all(
        validFiles.map((file) => this.loadADR(path.join(dirPath, file), file)),
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
   * Determines if a file should be included based on the configured file filter.
   *
   * @param fileName - Name of the file to check
   * @returns True if the file should be included, false otherwise
   * @private
   */
  private shouldIncludeFile(fileName: string): boolean {
    const fileExt = path.extname(fileName).toLowerCase();

    // Check if extension is allowed
    if (!this.fileFilter.allowedExtensions.includes(fileExt)) {
      return false;
    }

    // Check if filename is explicitly excluded
    if (this.fileFilter.excludedFilenames.includes(fileName)) {
      return false;
    }

    // Check against excluded patterns if any
    if (this.fileFilter.excludedPatterns) {
      for (const pattern of this.fileFilter.excludedPatterns) {
        // Simple wildcard matching for now
        const regex = new RegExp(pattern.replace(/\*/g, ".*"));
        if (regex.test(fileName)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Loads and parses a single ADR markdown file.
   *
   * @param filePath - Absolute path to the ADR markdown file
   * @param fileName - Name of the file (used to generate ADR ID)
   * @returns Promise that resolves to a parsed ADR object
   * @throws Error if the file cannot be read
   * @private
   */
  private async loadADR(filePath: string, fileName: string): Promise<ADR> {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      return this.parseService.parseADR(content, fileName, filePath);
    } catch (_error) {
      throw new Error(`Failed to load ADR: ${filePath}`);
    }
  }

  /**
   * Copies all images from content directories to the public directory
   * maintaining the same relative structure for proper static serving.
   */
  private async copyImagesToPublic(): Promise<void> {
    try {
      const contentPath = path.join(process.cwd(), "content", this.basePath);
      const publicPath = path.join(process.cwd(), "public", this.basePath);

      await this.copyImagesRecursively(contentPath, publicPath);
    } catch (error) {
      console.warn("Failed to copy images to public directory:", error);
    }
  }

  /**
   * Recursively copies image files from source to destination directory.
   */
  private async copyImagesRecursively(
    srcDir: string,
    destDir: string,
  ): Promise<void> {
    try {
      const files = await fs.readdir(srcDir);

      for (const file of files) {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);
        const stat = await fs.stat(srcPath);

        if (stat.isDirectory()) {
          // Recursively copy subdirectories
          await this.copyImagesRecursively(srcPath, destPath);
        } else if (this.isImageFile(file)) {
          // Copy image files
          await fs.mkdir(path.dirname(destPath), { recursive: true });
          await fs.copyFile(srcPath, destPath);
        }
      }
    } catch (_error) {
      // Silently continue if directory doesn't exist or can't be read
    }
  }

  /**
   * Checks if a file is an image based on its extension.
   */
  private isImageFile(fileName: string): boolean {
    const imageExtensions = [
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".svg",
      ".webp",
      ".bmp",
    ];
    const ext = path.extname(fileName).toLowerCase();
    return imageExtensions.includes(ext);
  }
}
