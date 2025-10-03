/**
 * Unified status color mapping for ADR statuses across the application
 */
export function getStatusColor(status: string): string {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "accepted":
      return "green";
    case "rejected":
      return "red";
    case "deprecated":
      return "purple";
    case "superseded":
      return "orange";
    case "proposed":
      return "blue";
    case "unknown":
      return "gray";
    default:
      return "gray";
  }
}

/**
 * Get status abbreviation for compact display
 */
export function getStatusAbbreviation(status: string): string {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "accepted":
      return "ACC";
    case "rejected":
      return "REJ";
    case "deprecated":
      return "DEP";
    case "superseded":
      return "SUP";
    case "proposed":
      return "PRO";
    case "unknown":
      return "UNK";
    default:
      return "UNK";
  }
}
