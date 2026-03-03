"use client";

import StageBarChart from "@/components/StageBarChart";
import StageDoughnutChart from "@/components/StageDoughnutChart";
import { useHubspot } from "@/lib/useHubspot";

export default function SlideThree() {
  const { data, loading, error } = useHubspot();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6">No data</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-lg bg-slate-800 text-white px-6 py-4 text-2xl font-bold">
        CV BY STAGE & STAGE DISTRIBUTION
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart */}
        <div className="rounded-lg border bg-white p-6">
          <StageBarChart labels={data.cvByStage.labels} values={data.cvByStage.values} />
        </div>

        {/* Right Chart */}
        <div className="rounded-lg border bg-white p-6">
          <StageDoughnutChart labels={data.cvByStage.labels} values={data.cvByStage.values} />
        </div>
      </div>
    </div>
  );
}
