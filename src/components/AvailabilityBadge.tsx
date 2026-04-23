import { CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";

interface AvailabilityBadgeProps {
  status?: string | null;
  className?: string;
}

const config: Record<string, { label: string; icon: any; classes: string }> = {
  available: {
    label: "Disponível",
    icon: CheckCircle2,
    classes: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  partial: {
    label: "Parcialmente disponível",
    icon: AlertTriangle,
    classes: "bg-amber-100 text-amber-800 border-amber-200",
  },
  unavailable: {
    label: "Indisponível",
    icon: XCircle,
    classes: "bg-rose-100 text-rose-800 border-rose-200",
  },
  pending: {
    label: "Aguardando confirmação",
    icon: Clock,
    classes: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

const AvailabilityBadge = ({ status, className = "" }: AvailabilityBadgeProps) => {
  const c = config[status || "pending"] || config.pending;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${c.classes} ${className}`}>
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
};

export default AvailabilityBadge;
