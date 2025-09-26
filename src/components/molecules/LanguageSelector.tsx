import { Select } from "../atoms";

export interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  languages: string[];
}

export function LanguageSelector({
  value,
  onChange,
  languages,
}: LanguageSelectorProps) {
  const languageOptions = languages.map((lang) => ({
    value: lang,
    label: lang.toUpperCase(),
  }));

  return (
    <Select
      value={value}
      onChange={(val) => val && onChange(val)}
      data={languageOptions}
      size="sm"
    />
  );
}
