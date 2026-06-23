import { google } from "googleapis";
import type { SheetRow } from "@/types";
import { getMockData } from "./sheets";

export async function fetchSheetData(): Promise<SheetRow[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = process.env.GOOGLE_SHEET_RANGE ?? "Planilha1!A2:C";

  if (!spreadsheetId || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    return getMockData();
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  await auth.authorize();

  const sheets = google.sheets({ version: "v4", auth });
  console.log("[Sheets] Buscando:", spreadsheetId, range);
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const values = response.data.values ?? [];
  console.log("[Sheets] Linhas recebidas:", values.length);

  // Planilha: col A = doador, col B = "Ala - Item", col C = quantidade
  return values
    .map((row) => {
      const alaItem = String(row[1] ?? "").trim();
      const dashIdx = alaItem.indexOf(" - ");
      const ala = dashIdx >= 0 ? alaItem.substring(0, dashIdx).trim() : alaItem;
      const item = dashIdx >= 0 ? alaItem.substring(dashIdx + 3).trim() : "";
      const quantidade = parseInt(String(row[2] ?? "0").replace(/\./g, "").replace(",", ""), 10) || 0;
      return { ala, item, quantidade };
    })
    .filter((row) => row.ala && row.item && row.quantidade > 0);
}
