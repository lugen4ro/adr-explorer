import { Badge } from "../atoms";

export interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
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

  return (
    <Badge color={getStatusColor(status)} variant="light" size="sm">
      {status}
    </Badge>
  );
}
