"use client";

import { Heart, RefreshCw, Wifi } from "lucide-react";

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  loading: boolean;
}

export function Header({ lastUpdated, onRefresh, loading }: HeaderProps) {
  const formatTime = (date: Date | null) => {
    if (!date) return "—";
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0D3B8C] to-[#1E5BB8] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Título */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-[#0D3B8C] fill-[#0D3B8C]" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm md:text-lg leading-tight">
                Mãos que Ajudam
              </h1>
              <p className="text-blue-200 text-xs md:text-sm">
                Estaca Rangel 2026
              </p>
            </div>
          </div>

          {/* Status + Refresh */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
              <Wifi className="w-3 h-3 text-green-300 animate-pulse" />
              <span className="text-blue-100 text-xs">
                {lastUpdated ? `Atualizado às ${formatTime(lastUpdated)}` : "Conectando..."}
              </span>
            </div>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
              title="Atualizar dados"
            >
              <RefreshCw className={`w-4 h-4 text-white ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Subtítulo */}
        <div className="mt-1 text-center">
          <p className="text-blue-200 text-xs">
            Acompanhamento da arrecadação em tempo real · Associação Donos do Amanhã
          </p>
        </div>
      </div>
    </header>
  );
}
