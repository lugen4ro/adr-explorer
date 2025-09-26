import { Badge } from "../atoms";

export interface StatusBadgeProps {
  status: string;
  compact?: boolean;
}

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      case "deprecated":
        return "orange";
      case "superseded":
        return "purple";
      case "proposed":
        return "blue";
      default:
        return "gray";
    }
  };

  const getStatusAbbreviation = (status: string) => {
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
      default:
        return "UNK";
    }
  };

  const displayText = compact ? getStatusAbbreviation(status) : status;

  return (
    <Badge
      color={getStatusColor(status)}
      variant="light"
      size={compact ? "xs" : "sm"}
    >
      {displayText}
    </Badge>
  );
}
