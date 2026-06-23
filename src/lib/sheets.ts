import type { SheetRow } from "@/types";

export const ITEMS_META = [
  { id: "fralda-geriatrica-xxg",    name: "Fralda Geriátrica XXG",       category: "fralda"    },
  { id: "fralda-geriatrica-xg",     name: "Fralda Geriátrica XG",        category: "fralda"    },
  { id: "fralda-infantil",          name: "Fralda Infantil P/M",          category: "fralda"    },
  { id: "fralda-geriatrica-pm",     name: "Fralda Geriátrica P/M",        category: "fralda"    },
  { id: "desinfetante-dragao",      name: "Desinfetante Dragão",           category: "higiene"   },
  { id: "sabonete-liquido-maos",    name: "Sabonete Líquido p/ Mãos",     category: "higiene"   },
  { id: "sabonete-liquido-infantil",name: "Sabonete Líquido Infantil",     category: "higiene"   },
  { id: "farinha-lactea",           name: "Farinha Láctea e Aveia",        category: "alimento"  },
  { id: "neston",                   name: "Neston",                        category: "alimento"  },
  { id: "biscoito-maria",           name: "Biscoitos / Cream Cracker",     category: "alimento"  },
] as const;

export const ALA_ASSIGNMENTS = [
  { ala: "Prosind",       item: "Fralda Geriátrica XXG",      goal: 60  },
  { ala: "Valentina",     item: "Fralda Geriátrica XG",       goal: 60  },
  { ala: "Paratibe",      item: "Fralda Infantil P/M",        goal: 60  },
  { ala: "José Américo",  item: "Fralda Geriátrica P/M",      goal: 60  },
  { ala: "Rangel",        item: "Desinfetante Dragão",         goal: 60  },
  { ala: "Mangabeira 1",  item: "Sabonete Líquido p/ Mãos",   goal: 60  },
  { ala: "Mangabeira 2",  item: "Sabonete Líquido Infantil",   goal: 60  },
  { ala: "Geisel",        item: "Farinha Láctea e Aveia",      goal: 60  },
  { ala: "Ramo Conde",    item: "Desinfetante Dragão",         goal: 60  },
  { ala: "Parque do Sol", item: "Neston",                      goal: 60  },
  { ala: "ORM",           item: "Biscoitos / Cream Cracker",   goal: 100 },
] as const;

export const TOTAL_GOAL = ALA_ASSIGNMENTS.reduce((s, a) => s + a.goal, 0);

export function processRows(rows: SheetRow[]): {
  alaCollected: Record<string, number>;
  totalCollected: number;
} {
  const alaCollected: Record<string, number> = {};
  for (const row of rows) {
    alaCollected[row.ala] = (alaCollected[row.ala] ?? 0) + row.quantidade;
  }
  const totalCollected = Object.values(alaCollected).reduce((a, b) => a + b, 0);
  return { alaCollected, totalCollected };
}

export function getMockData(): SheetRow[] {
  return [
    { ala: "Prosind",       item: "Fralda Geriátrica XXG",    quantidade: 17 },
    { ala: "Valentina",     item: "Fralda Geriátrica XG",     quantidade: 20 },
    { ala: "Paratibe",      item: "Fralda Infantil P/M",      quantidade: 30 },
    { ala: "José Américo",  item: "Fralda Geriátrica P/M",    quantidade: 5  },
    { ala: "Rangel",        item: "Desinfetante Dragão",       quantidade: 45 },
    { ala: "Mangabeira 1",  item: "Sabonete Líquido p/ Mãos", quantidade: 33 },
    { ala: "Mangabeira 2",  item: "Sabonete Líquido Infantil", quantidade: 15 },
    { ala: "Geisel",        item: "Farinha Láctea e Aveia",   quantidade: 60 },
    { ala: "Ramo Conde",    item: "Desinfetante Dragão",       quantidade: 22 },
    { ala: "Parque do Sol", item: "Neston",                    quantidade: 36 },
    { ala: "ORM",           item: "Biscoitos / Cream Cracker", quantidade: 73 },
  ];
}
