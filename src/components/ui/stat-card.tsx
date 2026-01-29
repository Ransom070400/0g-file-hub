import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subValue?: string;
  variant?: "primary" | "accent" | "default";
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  variant = "default",
}: StatCardProps) {
  const iconBgClasses = {
    primary: "bg-primary/10",
    accent: "bg-accent/10",
    default: "bg-secondary",
  };

  const iconTextClasses = {
    primary: "text-primary",
    accent: "text-accent",
    default: "text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5"
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-11 h-11 rounded-lg ${iconBgClasses[variant]} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-5 h-5 ${iconTextClasses[variant]}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
