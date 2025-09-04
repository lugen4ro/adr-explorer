"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useI18n } from "@/hooks/useI18n";
import type { ADRDirectory } from "@/types/adr";

interface NavigationProps {
	directory: ADRDirectory;
	onSearch?: (query: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = React.useState("");
	const { t, language, changeLanguage, availableLanguages } = useI18n();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch?.(searchQuery);
	};

	return (
		<nav className="bg-white dark:bg-gray-800 shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Link
							href="/"
							className="text-xl font-bold text-gray-900 dark:text-white"
						>
							ADR Explorer
						</Link>
					</div>

					<div className="flex-1 max-w-lg mx-8">
						<form onSubmit={handleSearch} className="relative">
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder={t("search")}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<button
								type="submit"
								className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
							>
								🔍
							</button>
						</form>
					</div>

					<div className="flex items-center space-x-4">
						<select
							value={language}
							onChange={(e) => changeLanguage(e.target.value)}
							className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
						>
							{availableLanguages.map((lang) => (
								<option key={lang} value={lang}>
									{lang.toUpperCase()}
								</option>
							))}
						</select>
						<button type="button" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
							🌓
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

interface SidebarProps {
	directory: ADRDirectory;
	isOpen: boolean;
	onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
	directory,
	isOpen,
	onToggle,
}) => {
	const pathname = usePathname();
	const { t } = useI18n();

	const renderDirectory = (dir: ADRDirectory, level = 0) => (
		<div key={dir.path} className={`${level > 0 ? "ml-4" : ""}`}>
			{level > 0 && (
				<h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">
					{dir.name}
				</h3>
			)}

			<ul className="space-y-1">
				{dir.adrs.map((adr) => (
					<li key={adr.id}>
						<Link
							href={`/adr/${adr.id}`}
							className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
								pathname === `/adr/${adr.id}`
									? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
									: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
							}`}
						>
							<div className="font-medium">{adr.title}</div>
							<div className="text-xs opacity-75">{adr.status}</div>
						</Link>
					</li>
				))}
			</ul>

			{dir.subdirectories.map((subdir) => (
				<div key={subdir.path} className="mt-4">
					{renderDirectory(subdir, level + 1)}
				</div>
			))}
		</div>
	);

	return (
		<>
			<button
				type="button"
				onClick={onToggle}
				className="fixed top-20 left-4 z-50 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg lg:hidden"
			>
				{isOpen ? "✕" : "☰"}
			</button>

			<aside
				className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 lg:w-[30vw] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
			>
				<div className="p-6 h-full overflow-y-auto">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						{t("architectureDecisions")}
					</h2>
					{renderDirectory(directory)}
				</div>
			</aside>

			{isOpen && (
				<div
					role="button"
					tabIndex={0}
					className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
					onClick={onToggle}
					onKeyDown={(e) => e.key === 'Escape' && onToggle()}
				/>
			)}
		</>
	);
};
