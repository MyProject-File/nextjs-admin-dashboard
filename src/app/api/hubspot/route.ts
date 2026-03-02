import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "hubspot-clean.csv"
  );

  const csv = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });

  return NextResponse.json(parsed.data);
}