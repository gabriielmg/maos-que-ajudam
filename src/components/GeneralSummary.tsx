"use client";

import { Package, Target, TrendingUp, Clock } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

interface GeneralSummaryProps {
  totalCollected: number;
  totalGoal: number;
  lastUpdated: Date | null;
}

export function GeneralSummary({ totalCollected, totalGoal, lastUpdated }: GeneralSummaryProps) {
  const percentage = Math.min(100, Math.round((totalCollected / totalGoal) * 100));
  const remaining = Math.max(0, totalGoal - totalCollected);

  const formatTime = (d: Date | null) => {
    if (!d) return "—";
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-gradient-to-br from-[#0D3B8C] to-[#1E5BB8] rounded-3xl p-6 text-white shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h2 className="font-bold text-lg">Resumo Geral da Campanha</h2>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white/10 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Package className="w-4 h-4 text-yellow-300" />
          </div>
          <p className="text-2xl font-bold text-yellow-300">{totalCollected}</p>
          <p className="text-blue-200 text-xs mt-0.5">Arrecadados</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-green-300" />
          </div>
          <p className="text-2xl font-bold text-green-300">{totalGoal}</p>
          <p className="text-blue-200 text-xs mt-0.5">Meta Total</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Package className="w-4 h-4 text-orange-300" />
          </div>
          <p className="text-2xl font-bold text-orange-300">{remaining}</p>
          <p className="text-blue-200 text-xs mt-0.5">Faltam</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2 flex justify-between items-center">
        <span className="text-blue-100 text-sm font-medium">Progresso total</span>
        <span className="text-yellow-300 font-bold text-xl">{percentage}%</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, #F4C430, #FFD700)",
            boxShadow: "0 0 12px rgba(244, 196, 48, 0.5)",
          }}
        >
          {percentage > 15 && (
            <span className="text-[#0D3B8C] text-xs font-bold">{percentage}%</span>
          )}
        </div>
      </div>
      <p className="text-center text-blue-200 text-xs mt-2">
        {totalCollected} / {totalGoal} itens arrecadados
      </p>

      {lastUpdated && (
        <div className="flex items-center justify-center gap-1 mt-3 text-blue-300 text-xs">
          <Clock className="w-3 h-3" />
          <span>Última atualização: {formatTime(lastUpdated)}</span>
        </div>
      )}
    </div>
  );
}
