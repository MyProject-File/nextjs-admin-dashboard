"use client";

type Props = {
  value: string;
  label: string;
  sub?: string;
  color?: "cyan" | "green" | "orange" | "purple";
};

const colorMap = {
  cyan: { strip: "bg-cyan-500", text: "text-cyan-600" },
  green: { strip: "bg-green-500", text: "text-green-600" },
  orange: { strip: "bg-orange-500", text: "text-orange-600" },
  purple: { strip: "bg-purple-500", text: "text-purple-600" },
};

export default function KpiCard({ value, label, sub, color = "cyan" }: Props) {
  const c = colorMap[color];

  return (
    <div className="rounded-lg bg-white shadow-md border">
      {/* top color strip */}
      <div className={`h-2 rounded-t-lg ${c.strip}`} />

      <div className="p-6 text-center">
        <div className={`text-5xl font-extrabold ${c.text}`}>{value}</div>
        <div className="mt-3 text-lg font-bold text-slate-900">{label}</div>
        {sub ? <div className="mt-2 text-sm text-slate-600">{sub}</div> : null}
      </div>
    </div>
  );
}
