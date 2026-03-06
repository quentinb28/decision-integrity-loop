import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'keep' | 'kneel' | 'kill';
}

const config = {
  keep: { label: 'Keep', className: 'bg-success/10 text-success' },
  kneel: { label: 'Kneel', className: 'bg-warning/10 text-warning' },
  kill: { label: 'Kill', className: 'bg-danger/10 text-danger' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const c = config[status];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", c.className)}>
      {c.label}
    </span>
  );
}
