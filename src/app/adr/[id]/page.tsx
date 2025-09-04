import type { Metadata } from "next";
import React from "react";
import { flattenADRs, getAllADRs } from "@/lib/staticGeneration";
import { ADRPageContent } from "./ADRPageContent";

interface ADRPageProps {
	params: {
		id: string;
	};
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
	const adr = allADRs.find((adr) => adr.id === params.id);

	return {
		title: adr ? `${adr.title} - ADR Explorer` : "ADR Not Found - ADR Explorer",
		description: adr
			? `Architectural Decision Record: ${adr.title}`
			: "ADR not found",
	};
}

export default async function ADRPage({ params }: ADRPageProps) {
	const { directory, allADRs } = await getAllADRs();
	const adr = allADRs.find((adr) => adr.id === params.id);

	return <ADRPageContent directory={directory} adr={adr || null} />;
}
