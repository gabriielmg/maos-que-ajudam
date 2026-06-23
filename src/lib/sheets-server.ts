import { google } from "googleapis";
import type { SheetRow } from "@/types";
import { getMockData, findCanonicalAla } from "./sheets";

function getCredentials(): { email: string; key: string } | null {
  // Primary: single base64-encoded JSON (avoids all newline/encoding issues on Vercel)
  const b64 = process.env.GOOGLE_CREDENTIALS_B64;
  if (b64) {
    try {
      const json = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
      if (json.client_email && json.private_key) {
        return { email: json.client_email, key: json.private_key };
      }
    } catch {
      console.error("[Sheets] Erro ao decodificar GOOGLE_CREDENTIALS_B64");
    }
  }

  // Fallback: individual env vars
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (email && rawKey) {
    const key = rawKey.replace(/\\n/g, "\n");
    return { email, key };
  }

  return null;
}

export async function fetchSheetData(): Promise<SheetRow[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = process.env.GOOGLE_SHEET_RANGE ?? "Lancamentos!A2:C";
  const creds = getCredentials();

  if (!spreadsheetId || !creds) {
    return getMockData();
  }

  const auth = new google.auth.JWT({
    email: creds.email,
    key: creds.key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  await auth.authorize();

  const sheets = google.sheets({ version: "v4", auth });
  console.log("[Sheets] Buscando:", spreadsheetId, range);
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const values = response.data.values ?? [];
  console.log("[Sheets] Linhas recebidas:", values.length);

  // col A = doador, col B = "Ala - Item", col C = quantidade
  const parsed = values
    .map((row) => {
      const alaItem = String(row[1] ?? "").trim();
      const dashIdx = alaItem.indexOf(" - ");
      const rawAla = dashIdx >= 0 ? alaItem.substring(0, dashIdx).trim() : alaItem;
      const ala = findCanonicalAla(rawAla) ?? rawAla;
      const item = dashIdx >= 0 ? alaItem.substring(dashIdx + 3).trim() : "";
      const quantidade = parseInt(String(row[2] ?? "0").replace(/\./g, "").replace(",", ""), 10) || 0;
      return { ala, item, quantidade };
    })
    .filter((row) => row.ala && row.item && row.quantidade > 0);
  console.log("[Sheets] Linhas válidas:", parsed.length, parsed.map((r) => `${r.ala}=${r.quantidade}`).join(", "));
  return parsed;
}
