import type { Insight } from "../types";

const categoryColour: Record<string, string> = {
  trend:        "text-blue-400  bg-blue-950  border-blue-900",
  anomaly:      "text-red-400   bg-red-950   border-red-900",
  forecast:     "text-purple-400 bg-purple-950 border-purple-900",
  recommendation: "text-emerald-400 bg-emerald-950 border-emerald-900",
};

export default function InsightCard({ insight }: { insight: Insight }) {
  const colour = categoryColour[insight.category] ?? "text-gray-400 bg-gray-800 border-gray-700";
  return (
    <div className={`border rounded-lg p-3 ${colour} ${insight.isRead ? "opacity-60" : ""}`}>
      <p className="text-xs font-medium capitalize mb-1">{insight.category}</p>
      <p className="text-white text-xs font-medium">{insight.title}</p>
      {insight.body && <p className="text-xs mt-1 opacity-80">{insight.body}</p>}
    </div>
  );
}