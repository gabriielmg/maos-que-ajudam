import { NextResponse } from "next/server";
import { fetchSheetData } from "@/lib/sheets-server";
import { processRows, TOTAL_GOAL } from "@/lib/sheets";

export const revalidate = 60;

export async function GET() {
  try {
    const rows = await fetchSheetData();
    const { alaCollected, totalCollected } = processRows(rows);
    return NextResponse.json({
      alaCollected,
      totalCollected,
      totalGoal: TOTAL_GOAL,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Sheets] Erro:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
