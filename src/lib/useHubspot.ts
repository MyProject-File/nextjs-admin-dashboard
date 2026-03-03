"use client";

import { useEffect, useMemo, useState } from "react";

import Papa from "papaparse";

type DealRow = {
  rowId?: string;
  recordId?: string;
  dealName?: string;
  dealOwner?: string;
  dealStage?: string;
  amount?: string | number;
  dealProbability?: string | number;
  weightedAmount?: string | number;
  lastActivityDate?: string;
  closeDate?: string;
};

export function formatK(num: number): string {
  const n = Number(num || 0);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(3)}M`.replace(/0+M$/, "M");
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${Math.round(n)}`;
}

function toNumber(v: any): number {
  if (v === null || v === undefined) return 0;
  const s = String(v)
    .replace(/[,₹$€\s]/g, "")
    .trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function parseDate(value: any): Date | null {
  if (!value) return null;

  // if numeric timestamp
  const asNum = Number(value);
  if (Number.isFinite(asNum) && String(value).trim().length >= 10) {
    const ms = asNum > 10_000_000_000 ? asNum : asNum * 1000;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function toMonthKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function useHubspot() {
  const [rows, setRows] = useState<DealRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/data/hubspot-clean.csv");
        if (!res.ok) throw new Error(`CSV fetch failed (${res.status})`);
        const text = await res.text();

        const parsed = Papa.parse<DealRow>(text, {
          header: true,
          skipEmptyLines: true,
        });

        if (parsed.errors?.length) throw new Error(parsed.errors[0].message || "CSV parse error");

        const data = (parsed.data || []).filter((r) => r && Object.keys(r).length > 0);
        if (!cancelled) setRows(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const data = useMemo(() => {
    if (!rows) return null;

    let totalPipeline = 0;
    let activePipeline = 0;
    let weightedPipeline = 0;

    let dealCount = 0;

    const cvMonthMap = new Map<string, number>();
    const weightedMonthMap = new Map<string, number>();
    const accountMap = new Map<string, number>();
    const stageMap = new Map<string, number>();

    for (const r of rows) {
      const amount = toNumber(r.amount);
      const weighted = toNumber(r.weightedAmount);
      const stage = String(r.dealStage ?? "").toLowerCase();
      const dealName = String(r.dealName ?? "Unknown");
      const close = parseDate(r.closeDate);

      if (amount > 0) dealCount += 1;

      totalPipeline += amount;

      const isClosedLost = stage.includes("closed lost") || stage.includes("lost");
      if (!isClosedLost) activePipeline += amount;

      // Weighted pipeline uses weightedAmount column
      weightedPipeline += weighted > 0 ? weighted : amount;

      // CV by Month (ALL deals)
      if (close) {
        const key = toMonthKey(close);
        cvMonthMap.set(key, (cvMonthMap.get(key) || 0) + amount);
        weightedMonthMap.set(key, (weightedMonthMap.get(key) || 0) + (weighted > 0 ? weighted : amount));
      }

      // Account (Top 10) using dealName as proxy
      accountMap.set(dealName, (accountMap.get(dealName) || 0) + amount);

      // Stage totals
      const stageLabel = String(r.dealStage ?? "Unknown");
      stageMap.set(stageLabel, (stageMap.get(stageLabel) || 0) + amount);
    }

    const avgDealSize = dealCount > 0 ? totalPipeline / dealCount : 0;

    // CV by Month
    const cvLabels = Array.from(cvMonthMap.keys()).sort();
    const cvValues = cvLabels.map((k) => cvMonthMap.get(k) || 0);

    // Weighted by Month
    const wLabels = Array.from(weightedMonthMap.keys()).sort();
    const wValues = wLabels.map((k) => weightedMonthMap.get(k) || 0);

    // Top 10 accounts
    const topAccounts = Array.from(accountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const accLabels = topAccounts.map((x) => x[0]);
    const accValues = topAccounts.map((x) => x[1]);

    // Stage chart
    const stageEntries = Array.from(stageMap.entries()).sort((a, b) => b[1] - a[1]);
    const stageLabels = stageEntries.map((x) => x[0]);
    const stageValues = stageEntries.map((x) => x[1]);

    return {
      kpis: {
        totalPipeline,
        activePipeline,
        weightedPipeline,
        avgDealSize,
        dealCount,
      },
      cvByMonth: { labels: cvLabels, values: cvValues },
      weightedByMonth: { labels: wLabels, values: wValues },
      cvByAccount: { labels: accLabels, values: accValues },
      cvByStage: { labels: stageLabels, values: stageValues },
    };
  }, [rows]);

  return { data, loading, error };
}
