"use client";

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar,
} from "recharts";
import { BarChart2 } from "lucide-react";
import type { AlaProgress, ItemProgress } from "@/types";

interface ChartsProps {
  alaProgress: AlaProgress[];
  itemProgress: ItemProgress[];
  totalCollected: number;
  totalGoal: number;
}

const COLORS = ["#0D3B8C", "#1E5BB8", "#2E8B57", "#F4C430", "#E74C3C", "#9B59B6", "#E67E22", "#1ABC9C"];

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  payload?: { name: string; value: number; percentage: number };
}

const CustomPieTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100 text-sm">
        <p className="font-bold text-gray-800">{data.name}</p>
        <p className="text-gray-600">{data.value} itens</p>
        <p className="text-blue-600">{data.payload?.percentage}%</p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100 text-sm">
        <p className="font-bold text-gray-800">{label}</p>
        <p className="text-blue-600">{payload[0].value} itens</p>
      </div>
    );
  }
  return null;
};

export function Charts({ alaProgress, itemProgress, totalCollected, totalGoal }: ChartsProps) {
  const pieData = alaProgress.map((ala, i) => ({
    name: ala.name,
    value: ala.totalCollected,
    percentage: ala.percentage,
    fill: COLORS[i % COLORS.length],
  }));

  const barData = alaProgress.map((ala) => ({
    name: ala.name.length > 10 ? ala.name.split(" ")[0] : ala.name,
    fullName: ala.name,
    itens: ala.totalCollected,
    fill: ala.color,
  }));

  const radialData = [
    {
      name: "Progresso",
      value: Math.min(100, Math.round((totalCollected / totalGoal) * 100)),
      fill: "#F4C430",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-[#0D3B8C] rounded-xl flex items-center justify-center">
          <BarChart2 className="w-4 h-4 text-white" />
        </div>
        <h2 className="font-bold text-gray-800 text-lg">Gráficos e Estatísticas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Pie chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <h4 className="font-bold text-gray-700 text-sm mb-3 text-center">
            Participação por Ala
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-1 justify-center mt-2">
            {pieData.slice(0, 6).map((entry, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span className="text-xs text-gray-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <h4 className="font-bold text-gray-700 text-sm mb-3 text-center">
            Itens Arrecadados por Ala
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                angle={-30}
                textAnchor="end"
                height={45}
              />
              <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="itens" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radial progress */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex flex-col items-center">
          <h4 className="font-bold text-gray-700 text-sm mb-3 text-center">
            Progresso Geral da Meta
          </h4>
          <div className="relative">
            <ResponsiveContainer width={160} height={160}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#f0f0f0" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#0D3B8C]">
                {radialData[0].value}%
              </span>
              <span className="text-xs text-gray-400">da meta</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            <span className="font-bold text-[#0D3B8C]">{totalCollected}</span>
            {" de "}
            <span className="font-bold text-gray-700">{totalGoal}</span>
            {" itens"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Faltam {Math.max(0, totalGoal - totalCollected)} itens
          </p>
        </div>
      </div>

      {/* Item progress bars */}
      <div className="mt-4 bg-white rounded-2xl shadow-md border border-gray-100 p-4">
        <h4 className="font-bold text-gray-700 text-sm mb-3">Progresso por Item</h4>
        <div className="space-y-3">
          {itemProgress.map((item) => (
            <div key={item.itemId} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-44 truncate flex-shrink-0" title={item.itemName}>
                {item.itemName}
              </span>
              <div className="flex-1">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.percentage >= 100 ? "#2E8B57" : item.percentage >= 75 ? "#1E5BB8" : item.percentage >= 50 ? "#F4C430" : "#E74C3C",
                    }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold w-10 text-right" style={{
                color: item.percentage >= 100 ? "#2E8B57" : item.percentage >= 75 ? "#1E5BB8" : "#E74C3C",
              }}>
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
