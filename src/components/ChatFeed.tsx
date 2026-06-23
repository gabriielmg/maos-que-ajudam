"use client";

import { MessageCircle } from "lucide-react";
import type { ChatMessage } from "@/types";
import { ProgressBar } from "./ProgressBar";

interface ChatFeedProps {
  messages: ChatMessage[];
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `há ${days} dia${days > 1 ? "s" : ""}`;
  if (hours > 0) return `há ${hours} hora${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  return "agora mesmo";
}

const ALA_INITIALS: Record<string, string> = {
  "Prosind": "PR",
  "Mangabeira 1": "M1",
  "Mangabeira 2": "M2",
  "Geisel": "GE",
  "Rangel": "RA",
  "Miramar": "MI",
  "Paratibe": "PA",
  "Valentina": "VA",
};

const ALA_COLORS: Record<string, string> = {
  "Prosind": "#0D3B8C",
  "Mangabeira 1": "#1E5BB8",
  "Mangabeira 2": "#2E8B57",
  "Geisel": "#B8860B",
  "Rangel": "#C0392B",
  "Miramar": "#7D3C98",
  "Paratibe": "#CA6F1E",
  "Valentina": "#148F77",
};

function getAlaColor(ala: string): string {
  return ALA_COLORS[ala] ?? "#555555";
}

function getAlaInitials(ala: string): string {
  return ALA_INITIALS[ala] ?? ala.substring(0, 2).toUpperCase();
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const color = getAlaColor(message.ala);
  const initials = getAlaInitials(message.ala);
  const percentage = Math.min(100, Math.round((message.totalItem / message.goalItem) * 100));

  return (
    <div className="flex gap-3 items-start group">
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-md"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>

      {/* Bubble */}
      <div className="flex-1 max-w-xs md:max-w-sm">
        <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="font-semibold text-sm" style={{ color }}>
              {message.ala}
            </span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            <span className="text-lg mr-1">{message.emoji}</span>
            Adicionou <span className="font-bold text-gray-900">{message.quantidade}</span>{" "}
            {message.item.toLowerCase()}
          </p>
          <div className="mt-2 pt-2 border-t border-gray-50">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Total: {message.totalItem}/{message.goalItem}</span>
              <span className="font-medium" style={{ color }}>{percentage}%</span>
            </div>
            <ProgressBar percentage={percentage} color={color} height="h-1.5" />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-1">{timeAgo(message.timestamp)}</p>
      </div>
    </div>
  );
}

export function ChatFeed({ messages }: ChatFeedProps) {
  return (
    <div className="bg-[#F8F4E8] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-[#0D3B8C] to-[#1E5BB8] px-4 py-3 flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">Chat de Acompanhamento</h3>
          <p className="text-blue-200 text-xs">Atualizações em tempo real</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-300 text-xs">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhuma atualização ainda</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))
        )}
      </div>
    </div>
  );
}
