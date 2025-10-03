import { getStatusAbbreviation, getStatusColor } from "@/lib/statusColors";
import { Badge } from "../atoms";

export interface StatusBadgeProps {
  status: string;
  compact?: boolean;
}

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
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
