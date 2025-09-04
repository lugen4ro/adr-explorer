"use client";

import type React from "react";
import { useState } from "react";
import { ADRRenderer } from "@/components/ADRRenderer";
import { Navigation, Sidebar } from "@/components/Navigation";
import { useI18n } from "@/hooks/useI18n";
import type { ADR, ADRDirectory } from "@/types/adr";

interface ADRPageContentProps {
	directory: ADRDirectory;
	adr: ADR | null;
}

export const ADRPageContent: React.FC<ADRPageContentProps> = ({
	directory,
	adr,
}) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { t } = useI18n();

	if (!adr) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<Navigation directory={directory} />
				<div className="flex items-center justify-center h-96">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
							{t("adrNotFound")}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							{t("adrNotFoundMessage")}
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<Navigation directory={directory} />

			<div>
				<Sidebar
					directory={directory}
					isOpen={sidebarOpen}
					onToggle={() => setSidebarOpen(!sidebarOpen)}
				/>

				<main className="lg:fixed lg:left-[30vw] lg:w-[70vw] lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto flex justify-center">
					<ADRRenderer adr={adr} />
				</main>
			</div>
		</div>
	);
};
