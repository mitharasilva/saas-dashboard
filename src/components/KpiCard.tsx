type Accent = "emerald" | "amber" | "red";

interface Props {
  label: string;
  value: string;
  accent: Accent;
}

const accentBar: Record<Accent, string> = {
  emerald: "bg-emerald-500",
  amber:   "bg-amber-500",
  red:     "bg-red-500",
};

export default function KpiCard({ label, value, accent }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentBar[accent]}`} />
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}