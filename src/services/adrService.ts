import { promises as fs } from "node:fs";
import path from "node:path";
import type { ADR, ADRDirectory } from "@/types/adr";

export class ADRService {
  private basePath: string;

  constructor(basePath = "adr") {
    this.basePath = basePath;
  }

  async discoverADRs(): Promise<ADRDirectory> {
    const docsPath = path.join(process.cwd(), "content", this.basePath);
    return await this.scanDirectory(docsPath, "root");
  }

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

  private extractCategory(filePath: string): string | undefined {
    const pathParts = filePath.split(path.sep);
    if (pathParts.length > 2) {
      return pathParts[pathParts.length - 2];
    }
    return undefined;
  }
}
