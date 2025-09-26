import type { Metadata } from "next";
import { getAllADRs } from "@/lib/staticGeneration";
import { ADRPageContent } from "./ADRPageContent";

interface ADRPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const { allADRs } = await getAllADRs();

  return allADRs.map((adr) => ({
    id: adr.id,
  }));
}

export async function generateMetadata({
  params,
}: ADRPageProps): Promise<Metadata> {
  const { allADRs } = await getAllADRs();
  const { id } = await params;
  const adr = allADRs.find((adr) => adr.id === id);

  return {
    title: adr ? `${adr.title} - ADR Explorer` : "ADR Not Found - ADR Explorer",
    description: adr
      ? `Architectural Decision Record: ${adr.title}`
      : "ADR not found",
  };
}

export default async function ADRPage({ params }: ADRPageProps) {
  const { allADRs } = await getAllADRs();
  const { id } = await params;
  const adr = allADRs.find((adr) => adr.id === id);

  return <ADRPageContent adr={adr || null} />;
}
