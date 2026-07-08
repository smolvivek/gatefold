type StatusType = "development" | "production" | "completed";

interface BadgeProps {
  status: StatusType;
}

const statusConfig: Record<
  StatusType,
  { label: string; dotColor: string; textColor: string; borderColor: string; pulse: boolean }
> = {
  development: {
    label: "Development",
    dotColor: "bg-status-looking",
    textColor: "text-status-looking",
    borderColor: "border-status-looking",
    pulse: true,
  },
  production: {
    label: "Production",
    dotColor: "bg-status-progress",
    textColor: "text-status-progress",
    borderColor: "border-status-progress",
    pulse: false,
  },
  completed: {
    label: "Completed",
    dotColor: "bg-status-complete",
    textColor: "text-status-complete",
    borderColor: "border-status-complete",
    pulse: false,
  },
};

function Badge({ status }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-[8px] border bg-transparent px-[10px] py-[6px] ${config.borderColor}`}
    >
      <span
        className={`inline-flex h-[6px] w-[6px] rounded-full ${config.dotColor}${config.pulse ? " led-pulse" : ""}`}
        aria-hidden="true"
      />
      <span
        className={`font-mono text-[10px] leading-[14px] tracking-[0.2em] uppercase ${config.textColor}`}
      >
        {config.label}
      </span>
    </span>
  );
}

export { Badge };
export type { BadgeProps, StatusType };
