"use client";

import Image from "next/image";
import { CheckCircle2, Package } from "lucide-react";
import type { ItemProgress } from "@/types";
import { ITEMS_META } from "@/lib/sheets";
import { ProgressBar } from "./ProgressBar";

interface ItemsGridProps {
  itemProgress: ItemProgress[];
}

const ITEM_IMAGES: Record<string, string> = {
  "fralda-geriatrica-xxg":
    "https://images.unsplash.com/photo-1559181567-c3190ca9d222?w=400&h=300&fit=crop&q=80",
  "fralda-geriatrica-xg":
    "https://images.unsplash.com/photo-1559181567-c3190ca9d222?w=400&h=300&fit=crop&q=80",
  "fralda-infantil":
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop&q=80",
  "desinfetante-dragao":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80",
  "sabonete-liquido-maos":
    "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400&h=300&fit=crop&q=80",
  "sabonete-liquido-infantil":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80",
  "farinha-lactea":
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&q=80",
  "neston":
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=300&fit=crop&q=80",
  "biscoito-maria":
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop&q=80",
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  fralda: { bg: "from-blue-50 to-blue-100", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
  higiene: { bg: "from-teal-50 to-teal-100", text: "text-teal-700", badge: "bg-teal-100 text-teal-700" },
  alimento: { bg: "from-orange-50 to-orange-100", text: "text-orange-700", badge: "bg-orange-100 text-orange-700" },
};

const CATEGORY_LABELS: Record<string, string> = {
  fralda: "Fralda",
  higiene: "Higiene",
  alimento: "Alimento",
};

function getProgressColor(pct: number): string {
  if (pct >= 100) return "#2E8B57";
  if (pct >= 75) return "#1E5BB8";
  if (pct >= 50) return "#F4C430";
  return "#E74C3C";
}

interface ItemCardProps {
  progress: ItemProgress;
}

function ItemCard({ progress }: ItemCardProps) {
  const meta = ITEMS_META.find((m) => m.id === progress.itemId);
  const imageUrl = ITEM_IMAGES[progress.itemId] ?? "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop&q=80";
  const category = (meta?.category ?? "higiene") as "fralda" | "higiene" | "alimento";
  const colors = CATEGORY_COLORS[category];
  const progressColor = getProgressColor(progress.percentage);
  const isComplete = progress.percentage >= 100;

  return (
    <div className={`relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${isComplete ? "border-green-300 ring-2 ring-green-200" : "border-gray-100"}`}>
      {/* Complete badge */}
      {isComplete && (
        <div className="absolute top-2 right-2 z-10 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1 shadow-md">
          <CheckCircle2 className="w-3 h-3" />
          Completo!
        </div>
      )}

      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-gray-50">
        <Image
          src={imageUrl}
          alt={progress.itemName}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
          unoptimized
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent`} />
        <div className="absolute bottom-2 left-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge} bg-white/90`}>
            {CATEGORY_LABELS[category]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">
          {progress.itemName}
        </h3>

        {/* Numbers */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs text-gray-400">Arrecadado</p>
            <p className="text-xl font-bold" style={{ color: progressColor }}>
              {progress.collected}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Meta</p>
            <p className="text-lg font-semibold text-gray-600">{progress.goal}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Faltam</p>
            <p className="text-sm font-medium text-orange-500">
              {isComplete ? "✓" : progress.remaining}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">{progress.collected}/{progress.goal}</span>
            <span className="font-bold" style={{ color: progressColor }}>
              {progress.percentage}%
            </span>
          </div>
          <ProgressBar percentage={progress.percentage} color={progressColor} height="h-2" />
        </div>
      </div>
    </div>
  );
}

export function ItemsGrid({ itemProgress }: ItemsGridProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-[#0D3B8C] rounded-xl flex items-center justify-center">
          <Package className="w-4 h-4 text-white" />
        </div>
        <h2 className="font-bold text-gray-800 text-lg">Itens da Campanha</h2>
      </div>

      {/* Category legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["fralda", "higiene", "alimento"] as const).map((cat) => (
          <span key={cat} className={`text-xs px-3 py-1 rounded-full font-medium ${CATEGORY_COLORS[cat].badge}`}>
            {CATEGORY_LABELS[cat]}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {itemProgress.map((item) => (
          <ItemCard key={item.itemId} progress={item} />
        ))}
      </div>
    </div>
  );
}
