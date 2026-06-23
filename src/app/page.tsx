"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ALA_ASSIGNMENTS, TOTAL_GOAL } from "@/lib/sheets";

// ── Constants ──────────────────────────────────────────────────────────────────
const COLORS = [
  "#0D3B8C", "#C0392B", "#148F77", "#7D3C98",
  "#CA6F1E", "#1565C0", "#2E7D32", "#B8860B",
  "#1A5276", "#1B5E20", "#6A1B9A",
];

const CAMPAIGN_END = new Date("2026-08-15T00:00:00-03:00");
const MILESTONES = [100, 250, 500, 700];

// ── Types ──────────────────────────────────────────────────────────────────────
type Data = {
  alaCollected: Record<string, number>;
  totalCollected: number;
  lastUpdated: string;
};

type AlaEntry = {
  ala: string;
  item: string;
  goal: number;
  color: string;
  collected: number;
  pct: number;
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function getDaysRemaining(): number {
  const diff = CAMPAIGN_END.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

function getProductEmoji(item: string): string {
  const s = item.toLowerCase();
  if (s.includes("fralda") && s.includes("geriát")) return "🧓";
  if (s.includes("fralda") && s.includes("infantil")) return "👶";
  if (s.includes("desinfetante")) return "🧴";
  if (s.includes("sabonete")) return "🫧";
  if (s.includes("farinha") || s.includes("aveia")) return "🥣";
  if (s.includes("neston")) return "🥛";
  if (s.includes("biscoito") || s.includes("cream")) return "🍪";
  return "📦";
}

function medal(rank: number): string {
  if (rank === 0) return "🥇";
  if (rank === 1) return "🥈";
  if (rank === 2) return "🥉";
  return `${rank + 1}º`;
}

// ── Animated counter ───────────────────────────────────────────────────────────
function useAnimatedCounter(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

// ── Animated bar ───────────────────────────────────────────────────────────────
function AnimatedBar({
  pct,
  color,
  height = 8,
  gradient = false,
  trackColor = "rgba(0,0,0,0.08)",
}: {
  pct: number;
  color: string;
  height?: number;
  gradient?: boolean;
  trackColor?: string;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 160);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div style={{ height, background: trackColor, borderRadius: 999, overflow: "hidden", width: "100%" }}>
      <div style={{
        height: "100%",
        width: `${width}%`,
        background: gradient ? "linear-gradient(90deg, #F5C518 0%, #22C55E 100%)" : color,
        borderRadius: 999,
        transition: "width 1.4s cubic-bezier(0.4,0,0.2,1)",
      }} />
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div className="skeleton" style={{ height: 4 }} />
      <div style={{ padding: 12 }}>
        <div className="skeleton" style={{ height: 10, width: "60%", marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 8, width: "80%", marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 32, width: "50%", marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 8 }} />
      </div>
    </div>
  );
}

function SkeletonScreen() {
  return (
    <div style={{ minHeight: "100vh", background: "#EDF2F7" }}>
      <div style={{ background: "#060F2E", height: 340 }} />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 32px" }}>
        <div className="skeleton" style={{ height: 130, marginBottom: 12, borderRadius: 20 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 72, borderRadius: 16 }} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );
}


// ── Main page ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch("/api/sheets", { cache: "no-store" });
      const json = await res.json();
      if (json.alaCollected) setData(json);
    } catch {
      // keep previous
    } finally {
      setLoading(false);
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const t = setInterval(() => fetchData(), 15_000);
    return () => clearInterval(t);
  }, [fetchData]);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const total = data?.totalCollected ?? 0;
  const totalPct = Math.min(100, Math.round((total / TOTAL_GOAL) * 100));
  const daysRemaining = getDaysRemaining();

  const alaEntries: AlaEntry[] = ALA_ASSIGNMENTS.map((a, i) => {
    const collected = data?.alaCollected?.[a.ala] ?? 0;
    return {
      ...a,
      color: COLORS[i % COLORS.length],
      collected,
      pct: Math.min(100, Math.round((collected / a.goal) * 100)),
    };
  });

  const ranked = [...alaEntries].sort((a, b) => b.pct - a.pct);
  const mostNeeded = [...alaEntries].sort((a, b) => a.pct - b.pct)[0];
  const participating = ALA_ASSIGNMENTS.length;
  const nextMilestone = MILESTONES.find((m) => m > total);

  // BUG FIX: animate both the total and the percentage
  const animTotal = useAnimatedCounter(total);
  const animPct   = useAnimatedCounter(totalPct);
  const animRemaining = useAnimatedCounter(TOTAL_GOAL - total);

  if (loading) return <SkeletonScreen />;

  return (
    <div style={{ minHeight: "100vh", background: "#EDF2F7" }}>

      {/* ── HERO HEADER ───────────────────────────────────────────────────── */}
      <header style={{
        background: "linear-gradient(160deg, #020C1F 0%, #060F2E 35%, #091840 60%, #0B2460 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Accent line at top */}
        <div style={{ height: 3, background: "linear-gradient(90deg, transparent 0%, #F5C518 20%, #3B82F6 60%, #1E90FF 80%, transparent 100%)" }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: [
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }} />

        {/* Glow orbs */}
        <div style={{ position: "absolute", top: -120, right: -100, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,144,255,0.13) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -80, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,197,24,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 60, right: 140, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px 32px", position: "relative", zIndex: 1 }}>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 3, height: 13, background: "#F5C518", borderRadius: 2, flexShrink: 0 }} />
                <p style={{ color: "#F5C518", fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", margin: 0, textTransform: "uppercase" }}>
                  Estaca Rangel · 2026
                </p>
              </div>
              <h1 style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 900, letterSpacing: "-0.4px", margin: "0 0 5px", textTransform: "uppercase", lineHeight: 1.15 }}>
                Projeto Mãos que Ajudam
              </h1>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0 }}>
                Campanha encerra em{" "}
                <strong style={{ color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>{daysRemaining} dias</strong>
                {" "}· 15 ago 2026
              </p>
            </div>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              title="Atualizar dados"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#F5C518",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <svg
                className={refreshing ? "animate-spin" : ""}
                width="17" height="17" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </button>
          </div>

          {/* Logo Mãos que Ajudam */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <LogoMark size={110} />
          </div>
        </div>

      </header>

      {/* ── CONTENT — bottom-sheet slides over header ─────────────────────── */}
      <div style={{ background: "#EDF2F7", borderRadius: "24px 24px 0 0", marginTop: -24, position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px 56px" }}>

        {/* ── Progress hero card ── */}
        <div style={{
          background: "linear-gradient(135deg, #0C1F5C 0%, #0E3591 50%, #1462C2 100%)",
          borderRadius: 20,
          padding: "20px 20px 16px",
          marginBottom: 12,
          boxShadow: "0 12px 36px rgba(12,31,92,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle grid on card */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: 20,
            backgroundImage: [
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
              "linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            ].join(","),
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", marginBottom: 16, textTransform: "uppercase" }}>
              Meta Geral da Campanha
            </p>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ color: "#F5C518", fontSize: 48, fontWeight: 900, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                    {animTotal}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 19 }}>/ {TOTAL_GOAL}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "5px 0 0", fontWeight: 500 }}>itens arrecadados</p>
              </div>
              <div style={{ textAlign: "right" }}>
                {/* BUG FIX: animated percentage */}
                <span style={{ color: totalPct >= 100 ? "#22C55E" : "#F5C518", fontSize: 44, fontWeight: 900, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {animPct}%
                </span>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "5px 0 0" }}>concluído</p>
              </div>
            </div>

            {/* BUG FIX: trackColor visible on dark background */}
            <AnimatedBar pct={totalPct} color="" gradient height={14} trackColor="rgba(255,255,255,0.14)" />

            {/* Milestone tick marks */}
            <div style={{ position: "relative", height: 20, marginTop: 4 }}>
              {MILESTONES.slice(0, -1).map((m) => {
                const pos = (m / TOTAL_GOAL) * 100;
                return (
                  <div key={m} style={{ position: "absolute", left: `${pos}%`, transform: "translateX(-50%)", textAlign: "center" }}>
                    <div style={{ width: 1, height: 5, background: "rgba(255,255,255,0.22)", margin: "0 auto 2px" }} />
                    <p style={{ color: "rgba(255,255,255,0.28)", fontSize: 8, margin: 0, whiteSpace: "nowrap" }}>{m}</p>
                  </div>
                );
              })}
            </div>

            {totalPct >= 100 && (
              <p style={{ color: "#22C55E", fontSize: 13, fontWeight: 700, marginTop: 8, textAlign: "center" }}>
                🎉 Meta alcançada! Parabéns a todos!
              </p>
            )}
          </div>
        </div>

        {/* ── Quick stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {([
            { icon: "📦", value: animTotal,     label: "Itens arrecadados",  color: "#0D3B8C" },
            { icon: "🎯", value: animRemaining,  label: "Itens faltantes",    color: "#C0392B" },
            { icon: "🏘️", value: participating,  label: "Alas participantes", color: "#148F77" },
            { icon: "⏳", value: daysRemaining,  label: "Dias restantes",     color: "#CA6F1E" },
          ] as const).map(({ icon, value, label, color }) => (
            <div key={label} style={{
              background: "#FFFFFF",
              borderRadius: 16,
              padding: "14px 12px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}>
              <span style={{ fontSize: 26 }}>{icon}</span>
              <div>
                <p style={{ color, fontSize: 24, fontWeight: 900, lineHeight: 1, margin: 0 }}>{value}</p>
                <p style={{ color: "#9CA3AF", fontSize: 10, margin: "3px 0 0", fontWeight: 500 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Impact statement ── */}
        <div style={{
          background: "linear-gradient(135deg, #FFF9E6 0%, #FFFDF5 100%)",
          border: "1px solid rgba(245,197,24,0.28)",
          borderRadius: 16,
          padding: "14px 18px",
          marginBottom: 14,
          boxShadow: "0 1px 8px rgba(245,197,24,0.07)",
        }}>
          <p style={{ color: "#B8860B", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>
            ❤️ IMPACTO DA CAMPANHA
          </p>
          <p style={{ color: "#1E293B", fontSize: 14, lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
            {total > 0
              ? <>Cada item arrecadado representa um gesto de amor ao próximo. Já são <strong style={{ color: "#0D3B8C" }}>{total}</strong> doações levando esperança, cuidado e dignidade para famílias que precisam do nosso apoio.</>
              : "Cada item arrecadado representa um gesto de amor ao próximo. Juntos podemos levar esperança, cuidado e dignidade para famílias que precisam do nosso apoio."}
          </p>
        </div>

        {/* ── Ranking ── */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "16px 16px 4px", marginBottom: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <p style={{ color: "#1E293B", fontSize: 13, fontWeight: 800, marginBottom: 8 }}>🏆 Ranking da Campanha</p>
          {ranked.map((a, i) => (
            <div key={a.ala} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: i < ranked.length - 1 ? "1px solid #F1F5F9" : "none",
            }}>
              <span style={{ fontSize: i < 3 ? 20 : 12, minWidth: 30, textAlign: "center", fontWeight: 700, color: "#94A3B8" }}>
                {medal(i)}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <p style={{ color: a.color, fontSize: 12, fontWeight: 800, margin: 0, textTransform: "uppercase" }}>{a.ala}</p>
                  <p style={{ color: a.pct >= 100 ? "#22C55E" : "#64748B", fontSize: 12, fontWeight: 700, margin: 0 }}>
                    {a.pct >= 100 ? "✓ Meta!" : `${a.pct}%`}
                  </p>
                </div>
                <AnimatedBar pct={a.pct} color={a.pct >= 100 ? "#22C55E" : a.color} height={6} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Most needed alert ── */}
        {mostNeeded && mostNeeded.pct < 100 && (
          <div className="alert-pulse" style={{
            background: "linear-gradient(135deg, #FFF0ED 0%, #FFF5F5 100%)",
            border: "1px solid rgba(192,57,43,0.2)",
            borderRadius: 16,
            padding: "14px 16px",
            marginBottom: 14,
            boxShadow: "0 1px 8px rgba(192,57,43,0.07)",
          }}>
            <p style={{ color: "#C0392B", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>
              🚨 ITEM MAIS NECESSÁRIO
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>{getProductEmoji(mostNeeded.item)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#C0392B", fontSize: 14, fontWeight: 800, margin: "0 0 2px", textTransform: "uppercase" }}>{mostNeeded.ala}</p>
                <p style={{ color: "#64748B", fontSize: 12, margin: "0 0 10px" }}>{mostNeeded.item}</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ color: "#1E293B", fontSize: 12, fontWeight: 600 }}>{mostNeeded.collected} / {mostNeeded.goal} un.</span>
                  <span style={{ color: "#C0392B", fontSize: 12, fontWeight: 700 }}>Faltam {mostNeeded.goal - mostNeeded.collected}</span>
                </div>
                <AnimatedBar pct={mostNeeded.pct} color="#C0392B" height={6} />
              </div>
            </div>
          </div>
        )}

        {/* ── Achievements ── */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "16px", marginBottom: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <p style={{ color: "#1E293B", fontSize: 13, fontWeight: 800, marginBottom: 12 }}>🏅 Conquistas da Campanha</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {MILESTONES.map((m) => {
              const achieved = total >= m;
              return (
                <div key={m} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: achieved ? "rgba(34,197,94,0.1)" : "#F8FAFC",
                  border: `1px solid ${achieved ? "#22C55E" : "#E2E8F0"}`,
                }}>
                  <span style={{ fontSize: 14 }}>{achieved ? "✅" : "🔒"}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: achieved ? "#16A34A" : "#94A3B8" }}>{m} itens</span>
                </div>
              );
            })}
          </div>
          {nextMilestone && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <p style={{ color: "#64748B", fontSize: 11, margin: 0 }}>
                  Próxima: <strong style={{ color: "#0D3B8C" }}>{nextMilestone} itens</strong>
                </p>
                <p style={{ color: "#0D3B8C", fontSize: 11, fontWeight: 700, margin: 0 }}>
                  Faltam {nextMilestone - total}
                </p>
              </div>
              <AnimatedBar pct={Math.round((total / nextMilestone) * 100)} color="#0D3B8C" height={8} />
            </div>
          )}
        </div>

        {/* ── Ala cards ── */}
        <p style={{ color: "#0D3B8C", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textAlign: "center", marginBottom: 12 }}>
          ARRECADAÇÃO POR ALA
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {alaEntries.map((a) => {
            const done = a.pct >= 100;
            return (
              <div
                key={a.ala}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 22px rgba(0,0,0,0.13)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                }}
              >
                <div style={{ height: 4, background: a.color }} />
                <div style={{ padding: "12px 12px 10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                    <p style={{ color: a.color, fontSize: 10, fontWeight: 800, textTransform: "uppercase", margin: 0, lineHeight: 1.2 }}>{a.ala}</p>
                    <span style={{ fontSize: 18, lineHeight: 1 }}>{getProductEmoji(a.item)}</span>
                  </div>
                  <p style={{ color: "#94A3B8", fontSize: 10, margin: "0 0 8px", lineHeight: 1.35 }}>{a.item}</p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, marginBottom: 7 }}>
                    <span style={{ color: done ? "#22C55E" : a.color, fontSize: 30, fontWeight: 900, lineHeight: 1 }}>
                      {a.collected}
                    </span>
                    <span style={{ color: "#9CA3AF", fontSize: 11, paddingBottom: 2 }}>/ {a.goal} un.</span>
                  </div>
                  <AnimatedBar pct={a.pct} color={done ? "#22C55E" : a.color} height={6} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                    <p style={{ color: done ? "#22C55E" : a.color, fontSize: 11, fontWeight: 700, margin: 0 }}>
                      {done ? "✓ Meta atingida!" : `${a.pct}%`}
                    </p>
                    {!done && (
                      <p style={{ color: "#94A3B8", fontSize: 10, margin: 0 }}>
                        faltam {a.goal - a.collected}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Partnership ── */}
        <div style={{
          background: "linear-gradient(135deg, #F0F7FF 0%, #EEF4FF 100%)",
          borderRadius: 20,
          padding: "22px 20px",
          textAlign: "center",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          border: "1px solid rgba(13,59,140,0.08)",
        }}>
          <p style={{ color: "#0D3B8C", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.16em", marginBottom: 12, opacity: 0.5, textTransform: "uppercase" }}>
            Os itens arrecadados serão entregues à
          </p>
          <DonosDoAmanhaLogo height={130} />
          <p style={{ color: "#64748B", fontSize: 12, margin: "10px 0 0", lineHeight: 1.65 }}>
            Associação que apoia crianças com câncer e suas famílias.
          </p>
        </div>
      </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{
        background: "linear-gradient(135deg, #020C1F 0%, #060F2E 100%)",
        textAlign: "center",
        padding: "18px 16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <p style={{ color: "#93B4E8", fontSize: 12, fontWeight: 600, margin: "0 0 4px" }}>
          Projeto Mãos que Ajudam · Estaca Rangel 2026
        </p>
        <p style={{ color: "rgba(147,180,232,0.45)", fontSize: 11, margin: 0 }}>
          {data?.lastUpdated
            ? `Atualizado: ${new Date(data.lastUpdated).toLocaleTimeString("pt-BR")} · `
            : ""}
          Dados atualizados a cada 15s
        </p>
      </footer>
    </div>
  );
}

// ── Logo components ────────────────────────────────────────────────────────────

function DonosDoAmanhaLogo({ height = 120 }: { height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-donos-do-amanha.png"
      alt="Donos do Amanhã"
      style={{ height, objectFit: "contain", display: "block", margin: "0 auto" }}
    />
  );
}

function LogoMark({ size = 60 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-maos-que-ajudam-cfundo.jpg"
      alt="Mãos que Ajudam"
      style={{ width: size, height: size, objectFit: "contain", display: "block", flexShrink: 0 }}
    />
  );
}
