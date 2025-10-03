import type { ADRStatus } from "@/types/adr";

/**
 * Internationalization configuration for ADR parsing
 *
 * This module provides comprehensive language support for parsing ADR files
 * in multiple languages and formats. It includes field name translations
 * and status value variants across different languages.
 */

export interface I18nConfig {
  fieldNames: {
    status: Record<string, string[]>;
    date: Record<string, string[]>;
  };
  statusValues: {
    [key in keyof typeof ADRStatus]: Record<string, string[]>;
  };
}

/**
 * Complete internationalization configuration for ADR parsing
 *
 * Supports English (en), Japanese (ja), Spanish (es), French (fr),
 * Chinese (zh), and Korean (ko) with multiple aliases per language.
 */
export const i18nConfig: I18nConfig = {
  fieldNames: {
    status: {
      en: ["status"],
      ja: ["ステータス"],
      es: ["estado"],
      fr: ["statut"],
      zh: ["状态"],
      ko: ["상태"],
    },
    date: {
      en: ["date", "created", "updated"],
      ja: ["日付", "作成日", "更新日"],
      es: ["fecha", "creado", "actualizado"],
      fr: ["date", "créé", "mis à jour"],
      zh: ["日期", "创建时间", "更新时间"],
      ko: ["날짜", "생성일", "수정일"],
    },
  },
  statusValues: {
    ACCEPTED: {
      en: ["accepted", "approved", "active", "adopted"],
      ja: ["承認", "採用", "承諾", "受諾"],
      es: ["aceptado", "aprobado", "adoptado"],
      fr: ["accepté", "approuvé", "adopté"],
      zh: ["接受", "批准", "采用"],
      ko: ["승인", "수락", "채택"],
    },
    DEPRECATED: {
      en: ["deprecated", "obsolete", "outdated"],
      ja: ["非推奨", "廃止予定", "旧式"],
      es: ["obsoleto", "desaprobado", "anticuado"],
      fr: ["déprécié", "obsolète", "périmé"],
      zh: ["已弃用", "过时", "废弃"],
      ko: ["사용 중단", "폐기 예정", "구식"],
    },
    SUPERSEDED: {
      en: ["superseded", "replaced", "substituted"],
      ja: ["置換", "代替", "更新"],
      es: ["reemplazado", "sustituido", "superado"],
      fr: ["remplacé", "substitué", "supplanté"],
      zh: ["已替代", "已取代", "已更新"],
      ko: ["대체됨", "교체됨", "갱신됨"],
    },
    REJECTED: {
      en: ["rejected", "declined", "refused"],
      ja: ["却下", "拒否", "否決"],
      es: ["rechazado", "denegado", "rehusado"],
      fr: ["rejeté", "refusé", "décliné"],
      zh: ["拒绝", "否决", "驳回"],
      ko: ["거부", "반려", "기각"],
    },
    PROPOSED: {
      en: ["proposed", "draft", "pending", "under review"],
      ja: ["提案", "下書き", "保留中", "検討中"],
      es: ["propuesto", "borrador", "pendiente", "en revisión"],
      fr: ["proposé", "brouillon", "en attente", "en révision"],
      zh: ["提议", "草案", "待定", "审核中"],
      ko: ["제안", "초안", "보류", "검토 중"],
    },
    UNKNOWN: {
      en: ["unknown", "undefined", "unclear"],
      ja: ["不明", "未定義", "不明確"],
      es: ["desconocido", "indefinido", "incierto"],
      fr: ["inconnu", "indéfini", "incertain"],
      zh: ["未知", "未定义", "不明确"],
      ko: ["알 수 없음", "정의되지 않음", "불분명"],
    },
  },
};

/**
 * Utility functions for internationalization
 */

/**
 * Flattens all field name variants into a single array
 *
 * @param fieldType - The type of field to get keywords for
 * @returns Array of all possible field name variants across all languages
 */
export function getAllFieldKeywords(
  fieldType: keyof I18nConfig["fieldNames"],
): string[] {
  return Object.values(i18nConfig.fieldNames[fieldType]).flat();
}

/**
 * Flattens all status value variants into a single array for a given status
 *
 * @param status - The status type to get keywords for
 * @returns Array of all possible status value variants across all languages
 */
export function getAllStatusKeywords(
  status: keyof I18nConfig["statusValues"],
): string[] {
  return Object.values(i18nConfig.statusValues[status]).flat();
}

/**
 * Flattens all status values from all statuses into a single array
 * (Available for future extensibility)
 *
 * @returns Array of all possible status values across all languages and statuses
 */
export function getAllStatusValues(): string[] {
  return Object.values(i18nConfig.statusValues).flatMap((statusObj) =>
    Object.values(statusObj).flat(),
  );
}

/**
 * Gets all field keywords by language
 *
 * @param fieldType - The type of field to get keywords for
 * @param language - The language code (en, ja, es, fr, zh, ko)
 * @returns Array of field name variants for the specified language
 */
export function getFieldKeywordsByLanguage(
  fieldType: keyof I18nConfig["fieldNames"],
  language: string,
): string[] {
  return i18nConfig.fieldNames[fieldType][language] || [];
}

/**
 * Gets all status keywords by language
 *
 * @param status - The status type to get keywords for
 * @param language - The language code (en, ja, es, fr, zh, ko)
 * @returns Array of status value variants for the specified language
 */
export function getStatusKeywordsByLanguage(
  status: keyof I18nConfig["statusValues"],
  language: string,
): string[] {
  return i18nConfig.statusValues[status][language] || [];
}

/**
 * Gets all supported languages
 *
 * @returns Array of supported language codes
 */
export function getSupportedLanguages(): string[] {
  return ["en", "ja", "es", "fr", "zh", "ko"];
}
