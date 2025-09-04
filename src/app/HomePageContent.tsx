"use client";

import type React from "react";
import { useState } from "react";
import { HomePage } from "@/components/HomePage";
import { Navigation, Sidebar } from "@/components/Navigation";
import type { ADRDirectory } from "@/types/adr";

interface HomePageContentProps {
	directory: ADRDirectory;
}

export const HomePageContent: React.FC<HomePageContentProps> = ({
	directory,
}) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

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
					<HomePage directory={directory} />
				</main>
			</div>
		</div>
	);
};
