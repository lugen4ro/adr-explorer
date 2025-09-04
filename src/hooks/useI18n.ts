"use client";

import { useEffect, useState } from "react";

interface I18nConfig {
	[language: string]: {
		[key: string]: string;
	};
}

const defaultConfig: I18nConfig = {
	en: {
		status: "Status",
		context: "Context",
		decision: "Decision",
		consequences: "Consequences",
		date: "Date",
		category: "Category",
		search: "Search ADRs...",
		totalAdrs: "Total ADRs",
		categories: "Categories",
		accepted: "Accepted",
		recentDecisions: "Recent Decisions",
		browseBycategory: "Browse by Category",
		decisionStatus: "Decision Status",
		architectureDecisions: "Architecture Decisions",
		loading: "Loading ADRs...",
		errorLoading: "Error Loading ADRs",
		noAdrsFound: "No ADRs found",
		adrNotFound: "ADR Not Found",
		adrNotFoundMessage: "The requested ADR could not be found.",
		general: "General",
	},
	ja: {
		status: "ステータス",
		context: "コンテキスト",
		decision: "決定",
		consequences: "結果",
		date: "日付",
		category: "カテゴリ",
		search: "ADRを検索...",
		totalAdrs: "総ADR数",
		categories: "カテゴリ数",
		accepted: "承認済み",
		recentDecisions: "最近の決定",
		browseBycategory: "カテゴリ別に閲覧",
		decisionStatus: "決定状況",
		architectureDecisions: "アーキテクチャ決定記録",
		loading: "ADRを読み込み中...",
		errorLoading: "ADR読み込みエラー",
		noAdrsFound: "ADRが見つかりません",
		adrNotFound: "ADRが見つかりません",
		adrNotFoundMessage: "要求されたADRが見つかりませんでした。",
		general: "一般",
	},
};

export const useI18n = () => {
	const [language, setLanguage] = useState("en");
	const [config, setConfig] = useState<I18nConfig>(defaultConfig);

	useEffect(() => {
		const loadConfig = async () => {
			try {
				const response = await fetch("/config/i18n.json");
				if (response.ok) {
					const customConfig = await response.json();
					setConfig({ ...defaultConfig, ...customConfig });
				}
			} catch {
				// Use default config if custom config fails to load
			}
		};

		loadConfig();
	}, []);

	const t = (key: string): string => {
		return config[language]?.[key] || config.en[key] || key;
	};

	const changeLanguage = (newLanguage: string) => {
		if (config[newLanguage]) {
			setLanguage(newLanguage);
			if (typeof window !== "undefined") {
				localStorage.setItem("adr-explorer-language", newLanguage);
			}
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedLanguage = localStorage.getItem("adr-explorer-language");
			if (savedLanguage && config[savedLanguage]) {
				setLanguage(savedLanguage);
			}
		}
	}, [config]);

	const availableLanguages = Object.keys(config);

	return {
		t,
		language,
		changeLanguage,
		availableLanguages,
	};
};
