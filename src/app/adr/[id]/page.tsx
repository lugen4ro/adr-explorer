import type { Metadata } from "next";
import { FileService } from "@/services/fileService";
import { ADRPageContent } from "./ADRPageContent";

interface ADRPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const fileService = new FileService("adr");
  const { allADRs } = await fileService.getAllADRs();

  return allADRs.map((adr) => ({
    id: encodeURIComponent(adr.id),
  }));
}

export async function generateMetadata({
  params,
}: ADRPageProps): Promise<Metadata> {
  const fileService = new FileService("adr");
  const { allADRs } = await fileService.getAllADRs();
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const adr = allADRs.find((adr) => adr.id === decodedId);

  return {
    title: adr ? `${adr.title} - ADR Explorer` : "ADR Not Found - ADR Explorer",
    description: adr
      ? `Architectural Decision Record: ${adr.title}`
      : "ADR not found",
  };
}

export default async function ADRPage({ params }: ADRPageProps) {
  const fileService = new FileService("adr");
  const { allADRs } = await fileService.getAllADRs();
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const adr = allADRs.find((adr) => adr.id === decodedId);

  return <ADRPageContent adr={adr || null} />;
}
