"use client";

import AccountBarChart from "@/components/AccountBarChart";
import WeightedByMonthBarChart from "@/components/WeightedByMonthBarChart";
import { useHubspot } from "@/lib/useHubspot";

export default function SlideTwo() {
  const { data, loading, error } = useHubspot();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6">No data</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-lg bg-slate-800 text-white px-6 py-4 text-2xl font-bold">WEIGHTED CV & CV BY ACCOUNT</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weighted CV by Month */}
        <div className="rounded-lg border bg-white p-6">
          <WeightedByMonthBarChart labels={data.weightedByMonth.labels} values={data.weightedByMonth.values} />
        </div>

        {/* CV by Account */}
        <div className="rounded-lg border bg-white p-6">
          <AccountBarChart labels={data.cvByAccount.labels} values={data.cvByAccount.values} />
        </div>
      </div>
    </div>
  );
}
