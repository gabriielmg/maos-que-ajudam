export interface SheetRow {
  ala: string;
  item: string;
  quantidade: number;
}

export interface DashboardData {
  alaCollected: Record<string, number>;
  totalCollected: number;
  totalGoal: number;
  lastUpdated: string;
}

export interface AlaProgress {
  name: string;
  color: string;
  percentage: number;
  totalCollected: number;
}

export interface ItemProgress {
  itemId: string;
  itemName: string;
  collected: number;
  goal: number;
  remaining: number;
  percentage: number;
}

export interface ChatMessage {
  id: string;
  ala: string;
  item: string;
  quantidade: number;
  totalItem: number;
  goalItem: number;
  emoji: string;
  timestamp: Date;
}
