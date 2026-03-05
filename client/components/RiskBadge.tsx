import { Badge } from "@/components/ui/badge";

interface RiskBadgeProps {
  risk: "LOW" | "MEDIUM" | "HIGH";
  size?: "sm" | "md" | "lg";
}

export const RiskBadge = ({ risk, size = "md" }: RiskBadgeProps) => {
  const variants: Record<string, string> = {
    LOW: "bg-green-500 text-white",
    MEDIUM: "bg-yellow-500 text-white",
    HIGH: "bg-red-500 text-white",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <Badge className={`${variants[risk]} ${sizes[size]} font-semibold`}>
      {risk}
    </Badge>
  );
};

