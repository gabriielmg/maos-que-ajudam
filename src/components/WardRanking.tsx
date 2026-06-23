"use client";

import { Trophy, Users } from "lucide-react";
import type { AlaProgress } from "@/types";
import { ProgressBar } from "./ProgressBar";

interface WardRankingProps {
  alaProgress: AlaProgress[];
  onCelebrate?: (alaName: string) => void;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export function WardRanking({ alaProgress, onCelebrate }: WardRankingProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0D3B8C] to-[#1E5BB8] px-4 py-3 flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
          <Trophy className="w-4 h-4 text-yellow-300" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">Ranking por Ala</h3>
          <p className="text-blue-200 text-xs">Ordenado por percentual atingido</p>
        </div>
      </div>

      {/* Ranking list */}
      <div className="divide-y divide-gray-50">
        {alaProgress.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhuma ala registrada ainda</p>
          </div>
        ) : (
          alaProgress.map((ala, index) => {
            const medal = MEDALS[index] ?? `${index + 1}°`;
            const isComplete = ala.percentage >= 100;

            return (
              <div
                key={ala.name}
                className={`px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-default ${isComplete ? "bg-green-50 hover:bg-green-50" : ""}`}
                onClick={() => isComplete && onCelebrate?.(ala.name)}
              >
                {/* Rank */}
                <div className="text-2xl w-8 text-center flex-shrink-0">{medal}</div>

                {/* Color dot */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: ala.color }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800 text-sm truncate">
                      {ala.name}
                      {isComplete && <span className="ml-1 text-green-500">✓</span>}
                    </span>
                    <span
                      className="font-bold text-sm ml-2 flex-shrink-0"
                      style={{ color: isComplete ? "#2E8B57" : ala.color }}
                    >
                      {ala.percentage}%
                    </span>
                  </div>
                  <ProgressBar
                    percentage={ala.percentage}
                    color={ala.color}
                    height="h-2"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {ala.totalCollected} itens arrecadados
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
