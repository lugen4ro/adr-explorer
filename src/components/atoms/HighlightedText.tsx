import type { TextProps } from "@mantine/core";
import { Mark, Text } from "@mantine/core";
import { getMantineMarkStyles } from "@/lib/searchHighlight";

export interface HighlightedTextProps extends Omit<TextProps, "children"> {
  text: string;
  searchTerms: string[];
}

export function HighlightedText({
  text,
  searchTerms,
  ...textProps
}: HighlightedTextProps) {
  if (!searchTerms.length || !searchTerms.some((term) => term.trim())) {
    return <Text {...textProps}>{text}</Text>;
  }

  const filteredTerms = searchTerms.filter((term) => term.trim());

  if (!filteredTerms.length) {
    return <Text {...textProps}>{text}</Text>;
  }

  // Create regex pattern for all search terms (case-insensitive)
  const pattern = new RegExp(
    `(${filteredTerms
      .map(
        (term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), // Escape special regex characters
      )
      .join("|")})`,
    "gi",
  );

  const parts = text.split(pattern);

  return (
    <Text {...textProps}>
      {parts.map((part, index) => {
        const isMatch = filteredTerms.some(
          (term) => part.toLowerCase() === term.toLowerCase(),
        );

        return isMatch ? (
          <Mark
            // biome-ignore lint/suspicious/noArrayIndexKey: Highlighting text parts need stable ordering
            key={index}
            styles={getMantineMarkStyles()}
          >
            {part}
          </Mark>
        ) : (
          part
        );
      })}
    </Text>
  );
}
