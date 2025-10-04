/**
 * Central configuration for search term highlighting styles and behavior.
 * This ensures consistent highlighting across sidebar and markdown content.
 */

export const searchHighlightConfig = {
  // Styling for highlighted search terms
  styles: {
    backgroundColor: "rgba(255, 235, 59, 0.3)", // Subtle yellow
    color: "inherit", // Keep original text color
    padding: "1px 3px",
    borderRadius: "3px",
    fontWeight: "500", // Slightly bolder but not too heavy
    boxShadow: "0 0 0 1px rgba(255, 235, 59, 0.5)", // Subtle border
  },

  // Custom styles for Mantine Mark component to match the above
  mantineStyles: {
    root: {
      backgroundColor: "rgba(255, 235, 59, 0.3)",
      color: "inherit",
      padding: "1px 3px",
      borderRadius: "3px",
      fontWeight: "500",
      boxShadow: "0 0 0 1px rgba(255, 235, 59, 0.5)",
    },
  },
} as const;

/**
 * Creates inline styles object for highlighting search terms.
 * Use this for custom mark elements in markdown content.
 */
export function getHighlightStyles(): React.CSSProperties {
  return searchHighlightConfig.styles;
}

/**
 * Gets the Mantine styles for Mark components in sidebar.
 * Use this for Mantine Mark components to match markdown highlighting.
 */
export function getMantineMarkStyles() {
  return searchHighlightConfig.mantineStyles;
}
