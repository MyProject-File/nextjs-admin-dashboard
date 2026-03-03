import fs from "fs";
import Papa from "papaparse";
import path from "path";

export type DealRow = {
  dealName: string;
  amount: number;
  weightedAmount: number;
  closeDate: string;
  dealStage: string;
};

function toNumber(v: any): number {
  const n = Number(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function pick(obj: any, keys: string[]) {
  for (const k of keys) {
    if (obj && obj[k] != null && String(obj[k]).trim() !== "") return obj[k];
  }
  return "";
}

function parseDateAny(s: string): Date | null {
  const v = String(s ?? "").trim();
  if (!v) return null;

  const mdy = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy) return new Date(Number(mdy[3]), Number(mdy[1]) - 1, Number(mdy[2]));

  const ymd = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (ymd) return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));

  const t = Date.parse(v);
  return Number.isFinite(t) ? new Date(t) : null;
}

function monthKey(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}

export function loadDealsFromCsv(): DealRow[] {
  // ✅ YOUR CSV is in src/data
  const filePath = path.join(process.cwd(), "src", "data", "hubspot-clean.csv");

  const csv = fs.readFileSync(filePath, "utf8");
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });

  const rows = (parsed.data as any[]) || [];

  return rows.map((r) => {
    // These key lists are flexible (it will pick the first match)
    const dealName = String(pick(r, ["Deal Name", "dealName", "name", "hs_dealname", "Dealname"]));

    const amount = toNumber(pick(r, ["Amount", "amount", "Deal Amount", "hs_amount", "value"]));

    const weightedAmount = toNumber(pick(r, ["Weighted Amount", "weightedAmount", "hs_weighted_amount", "Weighted"]));

    const closeDate = String(pick(r, ["Close Date", "closeDate", "Closedate", "hs_closedate", "Close date"]));

    const dealStage = String(pick(r, ["Deal Stage", "dealStage", "hs_dealstage", "Stage"]));

    return {
      dealName,
      amount,
      weightedAmount,
      closeDate,
      dealStage,
    };
  });
}

export function buildDashboardData(deals: DealRow[]) {
  const totalPipeline = deals.reduce((s, d) => s + d.amount, 0);

  const weightedPipeline = deals.reduce((s, d) => s + d.weightedAmount, 0);

  const activePipeline = deals
    .filter((d) => d.dealStage.toLowerCase() !== "closed lost")
    .reduce((s, d) => s + d.amount, 0);

  const avgDealSize = deals.length ? totalPipeline / deals.length : 0;

  // Slide-1: Funnel CV by Month (Amount)
  const amountByMonth = new Map<string, number>();

  // Slide-2 left: Funnel Weighted CV by Month (Weighted Amount)
  const weightedByMonth = new Map<string, number>();

  // Slide-2 right: Funnel CV by Account (Top 10 by Amount)
  // PPT note: Use Deal Name as account proxy
  const amountByAccount = new Map<string, number>();

  for (const d of deals) {
    const account = d.dealName?.trim() || "(Unnamed)";
    amountByAccount.set(account, (amountByAccount.get(account) ?? 0) + d.amount);

    const dt = parseDateAny(d.closeDate);
    if (dt) {
      const k = monthKey(dt);
      amountByMonth.set(k, (amountByMonth.get(k) ?? 0) + d.amount);
      weightedByMonth.set(k, (weightedByMonth.get(k) ?? 0) + d.weightedAmount);
    }
  }

  const funnelCvByMonth = Array.from(amountByMonth.entries())
    .map(([month, value]) => ({ month, value }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const funnelWeightedCvByMonth = Array.from(weightedByMonth.entries())
    .map(([month, value]) => ({ month, value }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const funnelCvByAccountTop10 = Array.from(amountByAccount.entries())
    .map(([account, value]) => ({ account, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return {
    totalPipeline,
    activePipeline,
    weightedPipeline,
    avgDealSize,
    funnelCvByMonth,
    funnelWeightedCvByMonth,
    funnelCvByAccountTop10,
  };
}
