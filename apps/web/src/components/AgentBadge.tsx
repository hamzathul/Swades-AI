"use client";

const AGENT_CONFIG: Record<
  string,
  { color: string; icon: string; label: string }
> = {
  support: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "💬",
    label: "Support",
  },
  order: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "📦",
    label: "Order",
  },
  billing: {
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "💳",
    label: "Billing",
  },
};

interface AgentBadgeProps {
  intent: string;
  size?: "sm" | "md";
}

export function AgentBadge({ intent, size = "sm" }: AgentBadgeProps) {
  const config = AGENT_CONFIG[intent] || {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "🤖",
    label: intent,
  };

  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.color} ${sizeClasses}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
