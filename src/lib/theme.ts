import { createTheme } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "var(--font-geist-sans)",
  fontFamilyMonospace: "var(--font-geist-mono)",
  headings: {
    fontFamily: "var(--font-geist-sans)",
  },
  other: {
    markdownHeadings: {
      h1: { color: "var(--mantine-color-text)" },
      h2: { color: "var(--mantine-color-text)" },
      h3: { color: "var(--mantine-color-text)" },
    },
  },
});