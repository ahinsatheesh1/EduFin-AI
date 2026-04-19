"use client";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { universities, countries } from "@/lib/mockData";
import {
  calculateROI,
  calculateRiskScore,
  calculateApprovalScore,
  generateAdvice,
  runWhatIfSimulation,
  getExplanationPoints,
  type WhatIfInputs,
} from "@/lib/aiLogic";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowRight,
  Brain,
  TrendingUp,
  Shield,
  Target,
  Star,
  MapPin,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sliders,
  Building2,
  BarChart2,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

// ─── Risk Gauge SVG ───────────────────────────────────────────────────────────
function RiskMeter({
  score,
  level,
  color,
}: {
  score: number;
  level: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    green: "#00d4aa",
    yellow: "#f5c842",
    red: "#ff4d6d",
  };
  const c = colors[color] || "#00d4aa";
  const angle = -120 + (score / 100) * 240;
  const rad = (angle * Math.PI) / 180;
  const cx = 100,
    cy = 90,
    r = 70;
  const needleX = cx + r * Math.cos(rad);
  const needleY = cy + r * Math.sin(rad);

  const zones = [
    { label: "Risky", startAngle: -120, endAngle: -40, color: "#ff4d6d" },
    { label: "Moderate", startAngle: -40, endAngle: 40, color: "#f5c842" },
    { label: "Safe", startAngle: 40, endAngle: 120, color: "#00d4aa" },
  ];

  function arcPath(
    startDeg: number,
    endDeg: number,
    rInner: number,
    rOuter: number
  ) {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const s1 = {
      x: cx + rOuter * Math.cos(toRad(startDeg)),
      y: cy + rOuter * Math.sin(toRad(startDeg)),
    };
    const e1 = {
      x: cx + rOuter * Math.cos(toRad(endDeg)),
      y: cy + rOuter * Math.sin(toRad(endDeg)),
    };
    const s2 = {
      x: cx + rInner * Math.cos(toRad(endDeg)),
      y: cy + rInner * Math.sin(toRad(endDeg)),
    };
    const e2 = {
      x: cx + rInner * Math.cos(toRad(startDeg)),
      y: cy + rInner * Math.sin(toRad(startDeg)),
    };
    const laf = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s1.x} ${s1.y} A ${rOuter} ${rOuter} 0 ${laf} 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${rInner} ${rInner} 0 ${laf} 0 ${e2.x} ${e2.y} Z`;
  }

  return (
    <svg viewBox="0 0 200 140" style={{ width: "100%", maxWidth: 220 }}>
      {zones.map((z) => (
        <path
          key={z.label}
          d={arcPath(z.startAngle, z.endAngle, 55, 78)}
          fill={z.color}
          opacity={0.2}
        />
      ))}
      {zones.map((z) => (
        <path
          key={z.label + "b"}
          d={arcPath(z.startAngle, z.endAngle, 55, 58)}
          fill={z.color}
          opacity={0.85}
        />
      ))}
      <line
        x1={cx}
        y1={cy}
        x2={needleX}
        y2={needleY}
        stroke={c}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={6} fill={c} />
      <text
        x={cx}
        y={cy + 30}
        textAnchor="middle"
        fill={c}
        fontSize="22"
        fontWeight="800"
        fontFamily="Sora,sans-serif"
      >
        {score}
      </text>
      <text
        x={cx}
        y={cy + 46}
        textAnchor="middle"
        fill={c}
        fontSize="10"
        fontWeight="700"
        fontFamily="Sora,sans-serif"
      >
        {level.toUpperCase()}
      </text>
    </svg>
  );
}

// ─── Circular Progress Ring ───────────────────────────────────────────────────
function ApprovalRing({
  probability,
  color,
  label,
}: {
  probability: number;
  color: string;
  label: string;
}) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (probability / 100) * circ;

  return (
    <svg viewBox="0 0 130 130" style={{ width: "100%", maxWidth: 160 }}>
      <circle
        cx="65"
        cy="65"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="10"
      />
      <circle
        cx="65"
        cy="65"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text
        x="65"
        y="60"
        textAnchor="middle"
        fill={color}
        fontSize="22"
        fontWeight="800"
        fontFamily="Sora,sans-serif"
      >
        {probability}%
      </text>
      <text
        x="65"
        y="78"
        textAnchor="middle"
        fill={color}
        fontSize="9"
        fontWeight="700"
        fontFamily="Sora,sans-serif"
      >
        {label.toUpperCase()}
      </text>
      <text
        x="65"
        y="91"
        textAnchor="middle"
        fill="#4a5568"
        fontSize="8"
        fontFamily="Inter,sans-serif"
      >
        APPROVAL ODDS
      </text>
    </svg>
  );
}

// ─── Delta indicator helper ───────────────────────────────────────────────────
function Delta({ val, unit = "" }: { val: number; unit?: string }) {
  if (val === 0) return <span style={{ color: "#4a5568", fontSize: 11 }}>—</span>;
  const positive = val > 0;
  return (
    <span
      style={{
        color: positive ? "#00d4aa" : "#ff4d6d",
        fontSize: 11,
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        fontWeight: 700,
      }}
    >
      {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
      {Math.abs(val).toFixed(1)}
      {unit}
    </span>
  );
}

// ─── Comparison row ───────────────────────────────────────────────────────────
function CompRow({
  label,
  cur,
  alt,
  delta,
  unit = "",
  higherIsBetter = true,
}: {
  label: string;
  cur: string | number;
  alt: string | number;
  delta: number;
  unit?: string;
  higherIsBetter?: boolean;
}) {
  const improved = higherIsBetter ? delta > 0 : delta < 0;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 1fr",
        gap: 8,
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 12, color: "#8892a4" }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#f0f4ff",
          textAlign: "center",
        }}
      >
        {typeof cur === "number" && unit ? `${cur}${unit}` : cur}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: delta === 0 ? "#f0f4ff" : improved ? "#00d4aa" : "#ff4d6d",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {typeof alt === "number" && unit ? `${alt}${unit}` : alt}
        {delta !== 0 && (
          <Delta val={higherIsBetter ? delta : -delta} unit={unit} />
        )}
      </span>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { profile } = useUser();

  const numProfile = {
    ...profile,
    tuitionFee: parseFloat(profile.tuitionFee) || 45000,
    livingExpenses: parseFloat(profile.livingExpenses) || 15000,
    loanAmount: parseFloat(profile.loanAmount) || 40000,
    age: parseInt(profile.age) || 23,
  };

  // What-if state
  const [whatIf, setWhatIf] = useState<WhatIfInputs>({
    targetCountry: numProfile.targetCountry || "DE",
    tuitionFee: Math.round((numProfile.tuitionFee || 45000) * 0.6),
    loanAmount: Math.round((numProfile.loanAmount || 40000) * 0.6),
  });
  const [showWhatIf, setShowWhatIf] = useState(false);
  // Explainability collapse state
  const [showRiskExplain, setShowRiskExplain] = useState(false);
  const [showApprovalExplain, setShowApprovalExplain] = useState(false);

  const roi = calculateROI(numProfile);
  const risk = calculateRiskScore(numProfile);
  const approval = calculateApprovalScore(numProfile);
  const advice = generateAdvice(numProfile);
  const explanations = getExplanationPoints(numProfile);
  const country = countries.find((c) => c.code === profile.targetCountry);
  const unis = (universities[profile.targetCountry] || universities.US).slice(0, 4);

  const simulation = runWhatIfSimulation(numProfile, whatIf);

  const roiChartData = [
    { name: "Yr 1", salary: Math.round(roi.annualSalary * 0.85), emi: roi.monthlyEMI * 12 },
    { name: "Yr 2", salary: Math.round(roi.annualSalary * 0.9), emi: roi.monthlyEMI * 12 },
    { name: "Yr 3", salary: Math.round(roi.annualSalary * 0.95), emi: roi.monthlyEMI * 12 },
    { name: "Yr 4", salary: roi.annualSalary, emi: roi.monthlyEMI * 12 },
    { name: "Yr 5", salary: Math.round(roi.annualSalary * 1.1), emi: roi.monthlyEMI * 12 },
  ];

  const isDemo = !profile.name;

  const riskBg = (c: string) =>
    c === "green"
      ? "rgba(0,212,170,0.08)"
      : c === "yellow"
      ? "rgba(245,200,66,0.08)"
      : "rgba(255,77,109,0.08)";
  const riskBorder = (c: string) =>
    c === "green"
      ? "rgba(0,212,170,0.2)"
      : c === "yellow"
      ? "rgba(245,200,66,0.2)"
      : "rgba(255,77,109,0.2)";
  const levelColor = (c: string) =>
    c === "green" ? "#00d4aa" : c === "yellow" ? "#f5c842" : "#ff4d6d";

  const altCountry = countries.find((c) => c.code === whatIf.targetCountry);

  return (
    <div
      style={{ paddingTop: 80, minHeight: "100vh", background: "var(--bg-primary)" }}
      className="grid-bg"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

        {/* Demo banner */}
        {isDemo && (
          <div
            style={{
              background: "rgba(245,200,66,0.08)",
              border: "1px solid rgba(245,200,66,0.25)",
              borderRadius: 12,
              padding: "14px 20px",
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <AlertTriangle size={18} color="#f5c842" />
            <span style={{ color: "#f5c842", fontSize: 14 }}>
              You&apos;re viewing a demo with sample data.
            </span>
            <Link href="/onboarding">
              <button
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  background: "#f5c842",
                  border: "none",
                  color: "#070b14",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Personalize Now →
              </button>
            </Link>
          </div>
        )}

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg,#00d4aa,#7c5fe6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Brain size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f0f4ff" }}>
                {profile.name ? `${profile.name}'s AI Report` : "AI Decision Dashboard"}
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#8892a4",
                  fontSize: 13,
                  flexWrap: "wrap",
                }}
              >
                <MapPin size={12} />
                {profile.courseInterest} · {country?.name || "United States"}
                <span className="badge badge-teal" style={{ marginLeft: 4 }}>
                  Live Analysis
                </span>
                {/* Lender Positioning Tag */}
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 10px",
                  borderRadius: 100,
                  background: "rgba(245,200,66,0.1)",
                  border: "1px solid rgba(245,200,66,0.3)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#f5c842",
                  letterSpacing: 0.3,
                  marginLeft: 4,
                }}>
                  🏦 Built for lenders to improve loan decision quality
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: Visual Decision Summary Card ── */}
        <div
          id="decision-summary-card"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,212,170,0.08) 0%, rgba(124,95,230,0.1) 50%, rgba(245,200,66,0.06) 100%)",
            border: "1px solid rgba(0,212,170,0.2)",
            borderRadius: 18,
            padding: "22px 28px",
            marginBottom: 28,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#4a5568",
                letterSpacing: 1.5,
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              AI Decision Summary
            </div>
            <div
              style={{
                fontSize: "clamp(16px,2.5vw,24px)",
                fontWeight: 800,
                fontFamily: "Sora,sans-serif",
                color: "#f0f4ff",
                lineHeight: 1.3,
              }}
            >
              <span style={{ color: levelColor(risk.color) }}>{risk.level} Risk</span>
              {" · "}
              <span style={{ color: approval.color }}>{approval.probability}% Approval</span>
              {" · "}
              <span style={{ color: "#9d7ef8" }}>{roi.paybackYears}-Yr Payback</span>
            </div>
            <p style={{ fontSize: 13, color: "#8892a4", marginTop: 6, maxWidth: 480 }}>
              {advice.actionLabel}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              {
                icon: <Shield size={14} />,
                label: "Risk",
                val: risk.level,
                color: levelColor(risk.color),
              },
              {
                icon: <CheckCircle size={14} />,
                label: "Approval",
                val: `${approval.probability}%`,
                color: approval.color,
              },
              {
                icon: <Clock size={14} />,
                label: "Payback",
                val: `${roi.paybackYears} yrs`,
                color: "#9d7ef8",
              },
            ].map((p) => (
              <div
                key={p.label}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "12px 18px",
                  textAlign: "center",
                  minWidth: 90,
                }}
              >
                <div style={{ color: p.color, marginBottom: 4 }}>{p.icon}</div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: p.color,
                    fontFamily: "Sora,sans-serif",
                  }}
                >
                  {p.val}
                </div>
                <div style={{ fontSize: 10, color: "#4a5568", marginTop: 2 }}>
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Stats Row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
            gap: 14,
            marginBottom: 28,
          }}
        >
          {[
            {
              label: "Annual Salary",
              value: `$${roi.annualSalary.toLocaleString()}`,
              sub: "Post-graduation",
              color: "#00d4aa",
              icon: <TrendingUp size={15} />,
            },
            {
              label: "Total Cost",
              value: `$${roi.totalCost.toLocaleString()}`,
              sub: "Tuition + Living",
              color: "#f5c842",
              icon: <Target size={15} />,
            },
            {
              label: "Monthly EMI",
              value: `$${roi.monthlyEMI.toLocaleString()}`,
              sub: "10-yr tenure",
              color: "#9d7ef8",
              icon: <Clock size={15} />,
            },
            {
              label: "Payback Period",
              value: `${roi.paybackYears} yrs`,
              sub: "At 40% salary",
              color: "#e84393",
              icon: <CheckCircle size={15} />,
            },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 8,
                  color: s.color,
                }}
              >
                {s.icon}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: s.color,
                  fontFamily: "Sora,sans-serif",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#f0f4ff", fontWeight: 600, marginTop: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 11, color: "#4a5568", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── SECTION 2: Risk Gauge + Approval Ring + ROI Chart (3-column) ── */}
        <div
          className="rg-3col"
          style={{ marginBottom: 24 }}
        >
          {/* Risk Score */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <Shield size={16} color="#9d7ef8" />
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff" }}>
                Loan Risk Score
              </h2>
              <span
                className={`badge badge-${
                  risk.color === "green"
                    ? "teal"
                    : risk.color === "yellow"
                    ? "gold"
                    : "purple"
                }`}
              >
                {risk.level}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <RiskMeter score={risk.score} level={risk.level} color={risk.color} />
            </div>
            <div
              style={{
                background: riskBg(risk.color),
                border: `1px solid ${riskBorder(risk.color)}`,
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              <p style={{ fontSize: 12, color: "#c8d0e0", lineHeight: 1.6 }}>
                {risk.explanation}
              </p>
            </div>

            {/* Why this score — Risk */}
            <button
              id="risk-explain-toggle"
              onClick={() => setShowRiskExplain(!showRiskExplain)}
              style={{
                marginTop: 10,
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "7px 2px",
                color: "#8892a4",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "Inter,sans-serif",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Info size={12} />
                Why this score?
              </span>
              <span style={{ fontSize: 10, transition: "transform 0.25s", display: "inline-block", transform: showRiskExplain ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
            </button>
            {showRiskExplain && (
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "12px 14px",
                animation: "fadeIn 0.2s ease",
              }}>
                {explanations.risk.map((pt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < explanations.risk.length - 1 ? 8 : 0 }}>
                    <span style={{ color: levelColor(risk.color), fontSize: 10, marginTop: 3, flexShrink: 0 }}>●</span>
                    <span style={{ fontSize: 11.5, color: "#8892a4", lineHeight: 1.55 }}>{pt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approval Probability */}
          <div className="glass-card" style={{ padding: 24 }} id="approval-score-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <BarChart2 size={16} color={approval.color} />
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff" }}>
                Loan Approval Probability
              </h2>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <ApprovalRing
                probability={approval.probability}
                color={approval.color}
                label={approval.label}
              />
            </div>
            <div
              style={{
                background: `${approval.color}12`,
                border: `1px solid ${approval.color}30`,
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              <p style={{ fontSize: 12, color: "#c8d0e0", lineHeight: 1.6 }}>
                {approval.explanation}
              </p>
            </div>

            {/* Why this score — Approval */}
            <button
              id="approval-explain-toggle"
              onClick={() => setShowApprovalExplain(!showApprovalExplain)}
              style={{
                marginTop: 10,
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "7px 2px",
                color: "#8892a4",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "Inter,sans-serif",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Info size={12} />
                Why this score?
              </span>
              <span style={{ fontSize: 10, transition: "transform 0.25s", display: "inline-block", transform: showApprovalExplain ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
            </button>
            {showApprovalExplain && (
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "12px 14px",
                animation: "fadeIn 0.2s ease",
              }}>
                {explanations.approval.map((pt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < explanations.approval.length - 1 ? 8 : 0 }}>
                    <span style={{ color: approval.color, fontSize: 10, marginTop: 3, flexShrink: 0 }}>●</span>
                    <span style={{ fontSize: 11.5, color: "#8892a4", lineHeight: 1.55 }}>{pt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ROI Chart */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <TrendingUp size={16} color="#00d4aa" />
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff" }}>
                5-Year Financial Projection
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={roiChartData} barCategoryGap="25%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#4a5568", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#4a5568", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0c1220",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    color: "#f0f4ff",
                    fontSize: 12,
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(v: any) => [`$${Number(v).toLocaleString()}`, ""]}
                />
                <Bar dataKey="salary" name="Salary" fill="#00d4aa" radius={[4,4,0,0]} opacity={0.9} />
                <Bar dataKey="emi" name="Annual EMI" fill="#7c5fe6" radius={[4,4,0,0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 20, marginTop: 8, justifyContent: "center" }}>
              {[["#00d4aa","Salary"],["#7c5fe6","Annual EMI"]].map(([c,l]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#8892a4" }}>
                  <span style={{ width:10, height:10, borderRadius:2, background:c, display:"inline-block" }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Enhanced Smart Advisor ── */}
        <div
          className="glass-card"
          style={{
            padding: 28,
            marginBottom: 24,
            background:
              "linear-gradient(135deg,rgba(0,212,170,0.05),rgba(124,95,230,0.05))",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg,#00d4aa,#7c5fe6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Zap size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff" }}>
                AI Smart Decision Advisor
              </h2>
              <p style={{ fontSize: 12, color: "#00d4aa" }}>
                Personalized recommendation based on your profile
              </p>
            </div>
            {/* Action label pill */}
            <div
              style={{
                marginLeft: "auto",
                padding: "6px 14px",
                borderRadius: 100,
                background: `${levelColor(risk.color)}18`,
                border: `1px solid ${levelColor(risk.color)}40`,
                fontSize: 12,
                fontWeight: 700,
                color: levelColor(risk.color),
              }}
            >
              {advice.actionLabel}
            </div>
          </div>

          <div className="rg-advisor">
            {/* Decision icon */}
            <div
              style={{
                padding: "18px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 8 }}>{advice.icon}</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#f0f4ff",
                  fontFamily: "Sora,sans-serif",
                  lineHeight: 1.3,
                }}
              >
                {advice.decision}
              </div>
            </div>

            {/* AI Reasoning */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#4a5568",
                  letterSpacing: 1,
                  marginBottom: 10,
                  textTransform: "uppercase",
                }}
              >
                Why this decision?
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {advice.reasoning.map((r, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                  >
                    <Info
                      size={13}
                      color={levelColor(risk.color)}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 12, color: "#c8d0e0", lineHeight: 1.5 }}>
                      {r}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action steps */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#4a5568",
                  letterSpacing: 1,
                  marginBottom: 10,
                  textTransform: "uppercase",
                }}
              >
                Next steps
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {advice.actions.map((action, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                  >
                    <CheckCircle
                      size={13}
                      color="#00d4aa"
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 12, color: "#8892a4", lineHeight: 1.5 }}>
                      {action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: What-If Scenario Simulator ── */}
        <div
          className="glass-card"
          style={{ padding: 28, marginBottom: 24 }}
          id="whatif-simulator"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#f5c842,#e84393)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sliders size={18} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff" }}>
                  What-If Scenario Simulator
                </h2>
                <p style={{ fontSize: 12, color: "#f5c842" }}>
                  Compare your current plan vs alternative — in real time
                </p>
              </div>
            </div>
            <button
              id="whatif-toggle-btn"
              onClick={() => setShowWhatIf(!showWhatIf)}
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                background: showWhatIf
                  ? "rgba(245,200,66,0.15)"
                  : "rgba(255,255,255,0.06)",
                border: `1px solid ${showWhatIf ? "rgba(245,200,66,0.4)" : "rgba(255,255,255,0.1)"}`,
                color: showWhatIf ? "#f5c842" : "#8892a4",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "Inter,sans-serif",
                transition: "all 0.2s",
              }}
            >
              {showWhatIf ? "Hide Simulator ↑" : "Open Simulator ↓"}
            </button>
          </div>

          {/* Smart Insight Banner — always visible, generated from simulation */}
          {(() => {
            const approvalDelta = simulation.alternative.approvalProbability - simulation.current.approvalProbability;
            const riskChanged = simulation.alternative.riskLevel !== simulation.current.riskLevel;
            const altC = countries.find((c) => c.code === whatIf.targetCountry);
            const curC = countries.find((c) => c.code === numProfile.targetCountry);
            const isImprovement = approvalDelta > 5;
            const isDegradation = approvalDelta < -5;
            if (!isImprovement && !isDegradation) return null;
            return (
              <div style={{
                marginBottom: 14,
                background: isImprovement ? "rgba(0,212,170,0.07)" : "rgba(255,77,109,0.07)",
                border: `1px solid ${isImprovement ? "rgba(0,212,170,0.25)" : "rgba(255,77,109,0.25)"}`,
                borderRadius: 12,
                padding: "14px 18px",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}>
                <Zap size={16} color={isImprovement ? "#00d4aa" : "#ff4d6d"} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isImprovement ? "#00d4aa" : "#ff4d6d", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>
                    {isImprovement ? "AI Smart Insight" : "AI Risk Warning"}
                  </div>
                  <p style={{ fontSize: 13, color: "#c8d0e0", lineHeight: 1.6, margin: 0 }}>
                    {isImprovement
                      ? <>Switching from <strong style={{ color: "#f0f4ff" }}>{curC?.name}</strong> to <strong style={{ color: "#00d4aa" }}>{altC?.name}</strong>{riskChanged ? <> drops risk from <strong style={{ color: levelColor(simulation.current.riskColor) }}>{simulation.current.riskLevel}</strong> to <strong style={{ color: levelColor(simulation.alternative.riskColor) }}>{simulation.alternative.riskLevel}</strong> and</> : ""} increases approval probability by <strong style={{ color: "#00d4aa" }}>+{approvalDelta}%</strong>. Use the simulator to explore this plan.
                      </>
                      : <>The alternative plan in <strong style={{ color: "#f0f4ff" }}>{altC?.name}</strong> reduces approval probability by <strong style={{ color: "#ff4d6d" }}>{Math.abs(approvalDelta)}%</strong> compared to your current plan.
                      </>
                    }
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Teaser: static hint when simulator is closed */}
          {!showWhatIf && (
            <div
              style={{
                background: "rgba(245,200,66,0.06)",
                border: "1px solid rgba(245,200,66,0.15)",
                borderRadius: 10,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Sliders size={14} color="#f5c842" />
              <span style={{ fontSize: 13, color: "#c8d0e0" }}>
                Try different countries, tuition, and loan amounts to instantly see
                how your risk and approval odds change.
              </span>
            </div>
          )}

          {showWhatIf && (
            <>
              {/* Controls */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                  gap: 20,
                  marginBottom: 24,
                  padding: "20px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Country selector */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "#8892a4",
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Alternative Country
                  </label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {countries.map((c) => (
                      <button
                        key={c.code}
                        id={`whatif-country-${c.code}`}
                        onClick={() => setWhatIf((p) => ({ ...p, targetCountry: c.code }))}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 8,
                          border: `1px solid ${whatIf.targetCountry === c.code ? "rgba(245,200,66,0.5)" : "rgba(255,255,255,0.08)"}`,
                          background:
                            whatIf.targetCountry === c.code
                              ? "rgba(245,200,66,0.12)"
                              : "rgba(255,255,255,0.03)",
                          color:
                            whatIf.targetCountry === c.code ? "#f5c842" : "#8892a4",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: whatIf.targetCountry === c.code ? 700 : 400,
                          fontFamily: "Inter,sans-serif",
                          transition: "all 0.15s",
                        }}
                        disabled={c.code === profile.targetCountry}
                        title={
                          c.code === profile.targetCountry ? "Current plan" : undefined
                        }
                      >
                        {c.flag} {c.name}
                        {c.code === profile.targetCountry && (
                          <span style={{ fontSize: 9, opacity: 0.5, marginLeft: 4 }}>
                            (current)
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tuition slider */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <label
                      style={{ fontSize: 12, color: "#8892a4", fontWeight: 600 }}
                    >
                      Alt. Tuition
                    </label>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#f5c842",
                        fontFamily: "Sora,sans-serif",
                      }}
                    >
                      ${whatIf.tuitionFee.toLocaleString()}
                    </span>
                  </div>
                  <input
                    id="whatif-tuition-slider"
                    type="range"
                    min={1000}
                    max={80000}
                    step={1000}
                    value={whatIf.tuitionFee}
                    onChange={(e) =>
                      setWhatIf((p) => ({ ...p, tuitionFee: Number(e.target.value) }))
                    }
                    style={{
                      background: `linear-gradient(to right, #f5c842 ${((whatIf.tuitionFee - 1000) / 79000) * 100}%, rgba(255,255,255,0.1) 0)`,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 10,
                      color: "#4a5568",
                      marginTop: 3,
                    }}
                  >
                    <span>$1K</span>
                    <span>$80K</span>
                  </div>
                </div>

                {/* Loan amount slider */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <label
                      style={{ fontSize: 12, color: "#8892a4", fontWeight: 600 }}
                    >
                      Alt. Loan Amount
                    </label>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#e84393",
                        fontFamily: "Sora,sans-serif",
                      }}
                    >
                      ${whatIf.loanAmount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    id="whatif-loan-slider"
                    type="range"
                    min={2000}
                    max={150000}
                    step={1000}
                    value={whatIf.loanAmount}
                    onChange={(e) =>
                      setWhatIf((p) => ({ ...p, loanAmount: Number(e.target.value) }))
                    }
                    style={{
                      background: `linear-gradient(to right, #e84393 ${((whatIf.loanAmount - 2000) / 148000) * 100}%, rgba(255,255,255,0.1) 0)`,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 10,
                      color: "#4a5568",
                      marginTop: 3,
                    }}
                  >
                    <span>$2K</span>
                    <span>$150K</span>
                  </div>
                </div>
              </div>

              {/* Insight banner */}
              {simulation.alternative.insight && (
                <div
                  style={{
                    background:
                      simulation.alternative.approvalProbability >
                      simulation.current.approvalProbability
                        ? "rgba(0,212,170,0.06)"
                        : "rgba(255,77,109,0.06)",
                    border: `1px solid ${
                      simulation.alternative.approvalProbability >
                      simulation.current.approvalProbability
                        ? "rgba(0,212,170,0.2)"
                        : "rgba(255,77,109,0.2)"
                    }`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Zap
                    size={15}
                    color={
                      simulation.alternative.approvalProbability >
                      simulation.current.approvalProbability
                        ? "#00d4aa"
                        : "#ff4d6d"
                    }
                    style={{ flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, color: "#c8d0e0", lineHeight: 1.5 }}>
                    <strong style={{ color: "#f0f4ff" }}>AI Insight: </strong>
                    {simulation.alternative.insight}
                  </span>
                </div>
              )}

              {/* Side-by-side comparison */}
              <div
                className="rg-2col"
                style={{ marginBottom: 16 }}
              >
                {/* Current */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "18px 20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#4a5568",
                      letterSpacing: 1,
                      marginBottom: 14,
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#8892a4",
                      }}
                    />
                    Current Plan · {country?.flag} {country?.name}
                  </div>
                  {[
                    {
                      label: "Risk",
                      val: simulation.current.riskLevel,
                      color: levelColor(simulation.current.riskColor),
                    },
                    {
                      label: "Approval",
                      val: `${simulation.current.approvalProbability}%`,
                      color: simulation.current.approvalColor,
                    },
                    {
                      label: "Salary",
                      val: `$${simulation.current.annualSalary.toLocaleString()}`,
                      color: "#00d4aa",
                    },
                    {
                      label: "EMI/mo",
                      val: `$${simulation.current.monthlyEMI.toLocaleString()}`,
                      color: "#9d7ef8",
                    },
                    {
                      label: "Payback",
                      val: `${simulation.current.paybackYears} yrs`,
                      color: "#e84393",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "7px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#8892a4" }}>
                        {item.label}
                      </span>
                      <span
                        style={{ fontSize: 13, fontWeight: 700, color: item.color }}
                      >
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Alternative */}
                <div
                  style={{
                    background:
                      simulation.alternative.approvalProbability >
                      simulation.current.approvalProbability
                        ? "rgba(0,212,170,0.05)"
                        : "rgba(255,77,109,0.05)",
                    border: `1px solid ${
                      simulation.alternative.approvalProbability >
                      simulation.current.approvalProbability
                        ? "rgba(0,212,170,0.2)"
                        : "rgba(255,77,109,0.2)"
                    }`,
                    borderRadius: 12,
                    padding: "18px 20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#4a5568",
                      letterSpacing: 1,
                      marginBottom: 14,
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background:
                          simulation.alternative.approvalProbability >
                          simulation.current.approvalProbability
                            ? "#00d4aa"
                            : "#ff4d6d",
                      }}
                    />
                    Alternative · {altCountry?.flag} {altCountry?.name}
                  </div>
                  {[
                    {
                      label: "Risk",
                      val: simulation.alternative.riskLevel,
                      color: levelColor(simulation.alternative.riskColor),
                      delta:
                        simulation.alternative.riskScore -
                        simulation.current.riskScore,
                    },
                    {
                      label: "Approval",
                      val: `${simulation.alternative.approvalProbability}%`,
                      color: simulation.alternative.approvalColor,
                      delta:
                        simulation.alternative.approvalProbability -
                        simulation.current.approvalProbability,
                    },
                    {
                      label: "Salary",
                      val: `$${simulation.alternative.annualSalary.toLocaleString()}`,
                      color: "#00d4aa",
                      delta:
                        simulation.alternative.annualSalary -
                        simulation.current.annualSalary,
                    },
                    {
                      label: "EMI/mo",
                      val: `$${simulation.alternative.monthlyEMI.toLocaleString()}`,
                      color: "#9d7ef8",
                      delta: -(simulation.alternative.monthlyEMI - simulation.current.monthlyEMI),
                    },
                    {
                      label: "Payback",
                      val: `${simulation.alternative.paybackYears} yrs`,
                      color: "#e84393",
                      delta: -(simulation.alternative.paybackYears - simulation.current.paybackYears),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "7px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#8892a4" }}>
                        {item.label}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{ fontSize: 13, fontWeight: 700, color: item.color }}
                        >
                          {item.val}
                        </span>
                        {item.delta !== 0 && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: item.delta > 0 ? "#00d4aa" : "#ff4d6d",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {item.delta > 0 ? (
                              <ArrowUpRight size={10} />
                            ) : (
                              <ArrowDownRight size={10} />
                            )}
                            {Math.abs(item.delta) > 1000
                              ? `$${(Math.abs(item.delta) / 1000).toFixed(0)}K`
                              : typeof item.delta === "number"
                              ? Math.abs(item.delta).toFixed(1)
                              : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── SECTION 5: Business Impact Panel ── */}
        <div
          className="glass-card"
          style={{
            padding: 28,
            marginBottom: 24,
            background:
              "linear-gradient(135deg,rgba(124,95,230,0.06),rgba(232,67,147,0.04))",
          }}
          id="business-impact-panel"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg,#7c5fe6,#e84393)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building2 size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff" }}>
                Impact for Lenders
              </h2>
              <p style={{ fontSize: 12, color: "#9d7ef8" }}>
                How EduFin AI creates business value for NBFCs &amp; Banks
              </p>
            </div>
            <div
              style={{
                marginLeft: "auto",
                padding: "5px 12px",
                borderRadius: 100,
                background: "rgba(124,95,230,0.12)",
                border: "1px solid rgba(124,95,230,0.25)",
                fontSize: 11,
                fontWeight: 700,
                color: "#9d7ef8",
              }}
            >
              For Judges / Investors
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
            {[
              {
                icon: "🛡️",
                title: "NPA Reduction",
                desc: "AI risk scoring filters high-risk applicants early, reducing non-performing assets for lenders.",
                stat: "~25% lower default risk",
                color: "#00d4aa",
              },
              {
                icon: "📈",
                title: "Conversion Quality",
                desc: "Only students with Safe/Moderate risk reach the loan funnel — improving lender portfolio quality.",
                stat: "3× higher approval rate",
                color: "#f5c842",
              },
              {
                icon: "⚡",
                title: "Faster Processing",
                desc: "Pre-scored profiles with document checklists cut lender processing time by eliminating back-and-forth.",
                stat: "48-hr faster disbursal",
                color: "#9d7ef8",
              },
              {
                icon: "🎯",
                title: "Targeted Acquisition",
                desc: "AI-matched students are already informed, motivated, and financially self-aware — ideal loan candidates.",
                stat: "40% lower CAC",
                color: "#e84393",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12,
                  padding: 18,
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    `${item.color}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(255,255,255,0.07)";
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#f0f4ff",
                    marginBottom: 6,
                  }}
                >
                  {item.title}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "#8892a4",
                    lineHeight: 1.6,
                    marginBottom: 12,
                  }}
                >
                  {item.desc}
                </p>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: item.color,
                    padding: "4px 10px",
                    background: `${item.color}12`,
                    borderRadius: 100,
                    display: "inline-block",
                  }}
                >
                  {item.stat}
                </div>
              </div>
            ))}
          </div>

          {/* Mock stat highlight */}
          <div
            style={{
              background:
                "linear-gradient(135deg,rgba(124,95,230,0.12),rgba(232,67,147,0.08))",
              border: "1px solid rgba(124,95,230,0.25)",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <BarChart2 size={20} color="#9d7ef8" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "#c8d0e0", lineHeight: 1.6 }}>
              <strong style={{ color: "#9d7ef8" }}>
                Estimated 25% reduction in default risk
              </strong>{" "}
              by using AI decision scoring to pre-qualify students before loan
              application — reducing NPA exposure for partner NBFCs.
            </p>
          </div>

          {/* Repayment success stat */}
          <div
            style={{
              marginTop: 12,
              background: "rgba(0,212,170,0.06)",
              border: "1px solid rgba(0,212,170,0.2)",
              borderRadius: 12,
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <CheckCircle size={18} color="#00d4aa" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "#c8d0e0", lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: "#00d4aa" }}>
                AI-based filtering can improve loan repayment success by 2–3×
              </strong>{" "}
              — students pre-scored as Safe or Moderate show significantly lower
              default rates in simulated portfolios.{" "}
              <span style={{ fontSize: 11, color: "#4a5568" }}>(simulated estimate)</span>
            </p>
          </div>
        </div>

        {/* ── University Matches ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f4ff" }}>
              <Brain
                size={18}
                style={{ display: "inline", marginRight: 8, color: "#00d4aa" }}
              />
              AI University Matches — {country?.name}
            </h2>
            <p style={{ color: "#8892a4", fontSize: 13, marginTop: 4 }}>
              Best-fit for your profile and {profile.courseInterest}
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
              gap: 16,
            }}
          >
            {unis.map((u, i) => (
              <div
                key={u.name}
                className="glass-card"
                style={{ padding: 20, transition: "border-color 0.3s,transform 0.3s" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(0,212,170,0.3)";
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: `linear-gradient(135deg, ${["#00d4aa","#7c5fe6","#f5c842","#e84393"][i % 4]}, #0c1220)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Sora,sans-serif",
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    #{u.rank}
                  </div>
                  <div
                    style={{
                      background:
                        u.matchScore >= 85
                          ? "rgba(0,212,170,0.15)"
                          : u.matchScore >= 75
                          ? "rgba(245,200,66,0.15)"
                          : "rgba(255,255,255,0.06)",
                      color:
                        u.matchScore >= 85
                          ? "#00d4aa"
                          : u.matchScore >= 75
                          ? "#f5c842"
                          : "#8892a4",
                      border: `1px solid ${
                        u.matchScore >= 85
                          ? "rgba(0,212,170,0.3)"
                          : "rgba(255,255,255,0.1)"
                      }`,
                      borderRadius: 100,
                      padding: "3px 9px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {u.matchScore}% Match
                  </div>
                </div>
                <h3
                  style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff", marginBottom: 5 }}
                >
                  {u.name}
                </h3>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}
                >
                  {u.specialties.slice(0, 2).map((sp) => (
                    <span
                      key={sp}
                      style={{
                        fontSize: 10,
                        padding: "2px 7px",
                        borderRadius: 100,
                        background: "rgba(255,255,255,0.06)",
                        color: "#8892a4",
                      }}
                    >
                      {sp}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#f5c842" }}>
                    {u.tuition === 0
                      ? "Free Tuition! 🎉"
                      : `$${u.tuition.toLocaleString()}/yr`}
                  </span>
                  <div style={{ display: "flex", gap: 1 }}>
                    {[...Array(Math.round(u.matchScore / 20))].map((_, idx) => (
                      <Star key={idx} size={9} color="#f5c842" fill="#f5c842" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            paddingBottom: 48,
          }}
        >
          <Link href="/loan" id="dashboard-loan-btn">
            <button className="btn-primary" style={{ padding: "15px 32px" }}>
              Plan My Loan <ArrowRight size={18} />
            </button>
          </Link>
          <Link href="/apply">
            <button className="btn-secondary">Apply for Loan Now</button>
          </Link>
        </div>

      </div>
    </div>
  );
}
