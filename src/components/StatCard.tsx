import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ label, value, icon: Icon, trend, trendUp }: StatCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow duration-200 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl bg-accent/10">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold font-body px-2 py-0.5 rounded-full ${
            trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {trend}
          </span>
        )}
      </div>
      <span className="font-display text-2xl font-bold text-foreground block">{value}</span>
      <span className="text-xs text-muted-foreground font-body">{label}</span>
    </div>
  );
};

export default StatCard;
