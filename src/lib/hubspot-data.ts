import Papa from "papaparse";

export type HubspotRow = Record<string, any>;

const AMOUNT_KEYS = ["Amount", "Deal Amount", "Deal amount", "amount"];
const STAGE_KEYS = ["Deal Stage", "Stage", "dealstage", "Pipeline Stage"];
const CLOSEDATE_KEYS = ["Close Date", "Close date", "Closedate", "CloseDate"];

function pick(row: HubspotRow, keys: string[]) {
  for (const k of keys) {
    const v = row?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
}

function toNumber(val: any): number {
  if (!val) return 0;
  const cleaned = String(val).replace(/[€,₹$,\s]/g, "");
  return Number.isFinite(parseFloat(cleaned)) ? parseFloat(cleaned) : 0;
}

function toDate(val: any): Date | null {
  if (!val) return null;
  const d = new Date(val);
  if (!Number.isNaN(d.getTime())) return d;
  return null;
}

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabel(d: Date) {
  const mon = d.toLocaleString("en-US", { month: "short" });
  return `${mon} ${d.getFullYear()}`;
}

export async function loadHubspotCsv(): Promise<HubspotRow[]> {
  const res = await fetch("/data/hubspot-clean.csv", { cache: "no-store" });
  if (!res.ok) throw new Error("CSV not found. Put it at public/data/hubspot-clean.csv");

  const text = await res.text();

  const parsed = Papa.parse<HubspotRow>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data || [];
}

export type HubspotComputed = {
  totalPipeline: number;
  activePipeline: number;
  weightedPipeline: number;
  avgDealSize: number;
  dealCount: number;

  cvByMonth: { labels: string[]; values: number[] };
};

export function computeFromRows(rows: HubspotRow[]): HubspotComputed {
  const deals = rows.map((r) => {
    const amount = toNumber(pick(r, AMOUNT_KEYS));
    const stage = String(pick(r, STAGE_KEYS) || "").toLowerCase();
    const closeDate = toDate(pick(r, CLOSEDATE_KEYS));

    return { amount, stage, closeDate };
  });

  // KPIs
  const totalPipeline = deals.reduce((s, d) => s + d.amount, 0);

  const activePipeline = deals.filter((d) => !d.stage.includes("closed lost")).reduce((s, d) => s + d.amount, 0);

  const weightedPipeline = 0; // not used here
  const dealCount = deals.filter((d) => d.amount > 0).length;
  const avgDealSize = dealCount ? totalPipeline / dealCount : 0;

  // CV by Month (Close Date)
  const monthMap = new Map<string, { label: string; sortKey: string; total: number }>();

  for (const d of deals) {
    if (!d.closeDate) continue;

    const sk = monthKey(d.closeDate);
    const lb = monthLabel(d.closeDate);

    if (!monthMap.has(sk)) monthMap.set(sk, { label: lb, sortKey: sk, total: 0 });

    const item = monthMap.get(sk)!;
    item.total += d.amount;
  }

  const monthsSorted = Array.from(monthMap.values()).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  const cvByMonth = {
    labels: monthsSorted.map((m) => m.label),
    values: monthsSorted.map((m) => m.total),
  };

  return {
    totalPipeline,
    activePipeline,
    weightedPipeline,
    avgDealSize,
    dealCount,
    cvByMonth,
  };
}
