"use client";

import FunnelCvByMonthChart from "@/components/FunnelCvByMonthChart";
import KpiCard from "@/components/KpiCard";
import { formatK, useHubspot } from "@/lib/useHubspot";

export default function SlideOne() {
  const { data, loading, error } = useHubspot();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-6">No data found</div>;

  const totalPipeline = data?.kpis?.totalPipeline ?? 0;
  const activePipeline = data?.kpis?.activePipeline ?? 0;
  const weightedPipeline = data?.kpis?.weightedPipeline ?? 0;
  const avgDealSize = data?.kpis?.avgDealSize ?? 0;
  const dealCount = data?.kpis?.dealCount ?? 0;

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <div className="rounded-lg bg-slate-800 text-white px-6 py-4 text-2xl font-bold">
        KPI CARDS & FUNNEL CV BY MONTH
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          color="cyan"
          value={`€${formatK(totalPipeline)}`}
          label="Total Pipeline (TCV)"
          sub="Sum of all deal amounts"
        />
        <KpiCard color="green" value={`€${formatK(activePipeline)}`} label="Active Pipeline" sub="Excl. Closed Lost" />
        <KpiCard
          color="orange"
          value={`€${formatK(weightedPipeline)}`}
          label="Weighted Pipeline"
          sub="Sum of weighted amounts"
        />
        <KpiCard
          color="purple"
          value={`€${formatK(avgDealSize)}`}
          label="Avg Deal Size"
          sub={`Across ${dealCount} deals`}
        />
      </div>

      {/* Spec + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-white p-6">
          <div className="rounded bg-slate-800 text-white px-4 py-2 font-bold">SPEC: FUNNEL CV BY MONTH</div>
          <div className="mt-4 text-sm text-slate-700 space-y-1">
            <div>Chart Type: Vertical bar chart</div>
            <div>X-Axis: Close Date grouped by month</div>
            <div>Y-Axis: Sum of Amount (€)</div>
            <div>Data Source: Amount + Close Date fields</div>
            <div>Logic: Parse Close Date → extract month → SUM(Amount) per month</div>
          </div>
          <div className="mt-6 text-xs text-slate-500">
            KPI Cards: Direct aggregation — no transformation needed. CV by Month: requires date parsing and monthly
            grouping.
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <FunnelCvByMonthChart labels={data?.cvByMonth?.labels ?? []} values={data?.cvByMonth?.values ?? []} />
        </div>
      </div>
    </div>
  );
}
