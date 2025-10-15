import type { Metadata } from "next";
import { Suspense } from "react";
import { FileService } from "@/services/fileService";
import { ADRPageContent } from "./ADRPageContent";

interface ADRPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const fileService = new FileService("adr");
    const { allADRs } = await fileService.getAllADRs();

    return allADRs.map((adr) => ({
      id: encodeURIComponent(adr.id),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: ADRPageProps): Promise<Metadata> {
  try {
    const fileService = new FileService("adr");
    const { allADRs } = await fileService.getAllADRs();
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const adr = allADRs.find((adr) => adr.id === decodedId);

    return {
      title: adr
        ? `${adr.title} - ADR Explorer`
        : "ADR Not Found - ADR Explorer",
      description: adr
        ? `Architectural Decision Record: ${adr.title}`
        : "ADR not found",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "ADR Explorer",
      description: "Architectural Decision Records",
    };
  }
}

export default async function ADRPage({ params }: ADRPageProps) {
  try {
    const fileService = new FileService("adr");
    const { allADRs } = await fileService.getAllADRs();
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const adr = allADRs.find((adr) => adr.id === decodedId);

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ADRPageContent adr={adr || null} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading ADR page:", error);
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ADRPageContent adr={null} />
      </Suspense>
    );
  }
}
