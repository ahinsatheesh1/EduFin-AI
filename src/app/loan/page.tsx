"use client";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { calculateEMI, getLoanEligibility, calculateROI } from "@/lib/aiLogic";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";
import { ArrowRight, DollarSign, PieChart, Clock, Shield, CheckCircle, Sparkles, Info } from "lucide-react";

const loanSchemes = [
  {
    name: "SBI Student Loan",
    rate: 9.5, maxAmount: 2000000, logo: "SBI",
    features: ["No collateral up to ₹7.5L", "15-yr repayment tenure", "Moratorium: Course + 1 yr"],
    color: "#00d4aa",
  },
  {
    name: "HDFC Credila",
    rate: 11.25, maxAmount: 5000000, logo: "HDFC",
    features: ["Covers full cost of education", "Pre-admission sanction", "Tax benefit under 80E"],
    color: "#f5c842",
  },
  {
    name: "Avanse Financial",
    rate: 10.5, maxAmount: 7500000, logo: "AVS",
    features: ["100% financing available", "Fast approval in 48 hrs", "Door-step service"],
    color: "#9d7ef8",
  },
];

export default function LoanPage() {
  const { profile } = useUser();
  const numProfile = {
    ...profile,
    tuitionFee: parseFloat(profile.tuitionFee) || 45000,
    livingExpenses: parseFloat(profile.livingExpenses) || 15000,
    loanAmount: parseFloat(profile.loanAmount) || 40000,
    age: parseInt(profile.age) || 23,
  };

  const eligibility = getLoanEligibility(numProfile);
  const roi = calculateROI(numProfile);

  const [loanAmt, setLoanAmt] = useState(Math.min(numProfile.loanAmount, eligibility.maxEligible));
  const [tenure, setTenure] = useState(10);
  const [rate, setRate] = useState(eligibility.interestRate);

  const emi = calculateEMI(loanAmt, rate, tenure * 12);
  const totalPay = emi * tenure * 12;
  const totalInterest = totalPay - loanAmt;
  const emiToSalaryRatio = emi / (roi.monthlySalary || 1);

  // Amortization chart data
  const amortData = Array.from({ length: tenure }, (_, i) => {
    const year = i + 1;
    const remaining = loanAmt * Math.pow(1 + rate / 100 / 12, year * 12) - emi * ((Math.pow(1 + rate / 100 / 12, year * 12) - 1) / (rate / 100 / 12));
    const interestPaid = totalInterest * (year / tenure);
    return {
      year: `Yr ${year}`,
      principal: Math.max(0, Math.round(loanAmt - Math.max(0, remaining))),
      interest: Math.round(interestPaid),
      balance: Math.max(0, Math.round(remaining)),
    };
  });

  const riskColor = emiToSalaryRatio < 0.3 ? "#00d4aa" : emiToSalaryRatio < 0.5 ? "#f5c842" : "#ff4d6d";

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <span className="badge badge-teal" style={{ marginBottom: 12 }}>
            <DollarSign size={11} /> Loan Intelligence Engine
          </span>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, color: "#f0f4ff", marginBottom: 8 }}>
            Loan Eligibility &{" "}
            <span className="gradient-text">EMI Planner</span>
          </h1>
          <p style={{ color: "#8892a4", fontSize: 15 }}>
            Adjust your loan parameters to find the perfect repayment plan.
          </p>
        </div>

        <div className="rg-2col loan-main-grid" style={{ marginBottom: 32 }}>

          {/* Left: Sliders */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 24 }}>
              Customize Your Loan
            </h2>

            {/* Loan amount slider */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <label style={{ fontSize: 13, color: "#8892a4", fontWeight: 600 }}>Loan Amount</label>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#00d4aa", fontFamily: "Sora,sans-serif" }}>
                  ${loanAmt.toLocaleString()}
                </span>
              </div>
              <input
                id="slider-loan-amt"
                type="range"
                min={5000} max={Math.min(eligibility.maxEligible, 500000)} step={1000}
                value={loanAmt}
                onChange={(e) => setLoanAmt(Number(e.target.value))}
                style={{ background: `linear-gradient(to right, #00d4aa ${((loanAmt - 5000) / (Math.min(eligibility.maxEligible, 500000) - 5000)) * 100}%, rgba(255,255,255,0.1) 0)` }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4a5568", marginTop: 4 }}>
                <span>$5K</span><span>${(Math.min(eligibility.maxEligible, 500000) / 1000).toFixed(0)}K</span>
              </div>
            </div>

            {/* Tenure slider */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <label style={{ fontSize: 13, color: "#8892a4", fontWeight: 600 }}>Loan Tenure</label>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#9d7ef8", fontFamily: "Sora,sans-serif" }}>
                  {tenure} Years
                </span>
              </div>
              <input
                id="slider-tenure"
                type="range"
                min={2} max={15} step={1}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                style={{ background: `linear-gradient(to right, #9d7ef8 ${((tenure - 2) / 13) * 100}%, rgba(255,255,255,0.1) 0)` }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4a5568", marginTop: 4 }}>
                <span>2 Yrs</span><span>15 Yrs</span>
              </div>
            </div>

            {/* Rate slider */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <label style={{ fontSize: 13, color: "#8892a4", fontWeight: 600 }}>Interest Rate (p.a.)</label>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#f5c842", fontFamily: "Sora,sans-serif" }}>
                  {rate.toFixed(1)}%
                </span>
              </div>
              <input
                id="slider-rate"
                type="range"
                min={7} max={15} step={0.5}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                style={{ background: `linear-gradient(to right, #f5c842 ${((rate - 7) / 8) * 100}%, rgba(255,255,255,0.1) 0)` }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4a5568", marginTop: 4 }}>
                <span>7%</span><span>15%</span>
              </div>
            </div>

            {/* EMI Result */}
            <div style={{
              background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)",
              borderRadius: 14, padding: 20, textAlign: "center",
            }}>
              <div style={{ fontSize: 12, color: "#8892a4", marginBottom: 4 }}>Your Monthly EMI</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#00d4aa", fontFamily: "Sora,sans-serif" }}>
                ${emi.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: "#4a5568", marginTop: 4 }}>/ month for {tenure} years</div>
            </div>

            {/* EMI vs salary */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: "#8892a4" }}>EMI / Expected Salary</span>
                <span style={{ fontWeight: 700, color: riskColor }}>{Math.round(emiToSalaryRatio * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: `${Math.min(100, emiToSalaryRatio * 100)}%`,
                  background: riskColor,
                }} />
              </div>
              <div style={{ fontSize: 11, color: riskColor, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <Info size={11} />
                {emiToSalaryRatio < 0.3 ? "✓ Healthy ratio" : emiToSalaryRatio < 0.5 ? "⚠ Moderate load" : "⚠ High debt burden"}
              </div>
            </div>
          </div>

          {/* Right: Results & chart */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 16 }}>
              {[
                { label: "Principal", value: `$${loanAmt.toLocaleString()}`, color: "#00d4aa", icon: <DollarSign size={14} /> },
                { label: "Total Interest", value: `$${Math.round(totalInterest).toLocaleString()}`, color: "#f5c842", icon: <PieChart size={14} /> },
                { label: "Total Payable", value: `$${Math.round(totalPay).toLocaleString()}`, color: "#9d7ef8", icon: <Shield size={14} /> },
              ].map((s) => (
                <div key={s.label} className="stat-card" style={{ padding: 16 }}>
                  <div style={{ color: s.color, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: "Sora,sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#8892a4", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Eligibility info */}
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <CheckCircle size={16} color="#00d4aa" />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff" }}>Your Loan Eligibility</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Max. Eligible", value: `$${eligibility.maxEligible.toLocaleString()}` },
                  { label: "Recommended", value: `$${eligibility.recommendedAmount.toLocaleString()}` },
                  { label: "Best Rate", value: `${eligibility.interestRate}% p.a.` },
                  { label: "Scheme", value: eligibility.scheme },
                ].map((item) => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "#4a5568", marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f4ff" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amortization chart */}
            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff", marginBottom: 14 }}>
                <Clock size={14} style={{ display: "inline", marginRight: 6, color: "#00d4aa" }} />
                Loan Balance Over Time
              </h3>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={amortData}>
                  <defs>
                    <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="year" tick={{ fill: "#4a5568", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#4a5568", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ background: "#0c1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f4ff", fontSize: 11 }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(v: any) => [`$${Number(v).toLocaleString()}`, ""]}
                  />
                  <Area type="monotone" dataKey="balance" name="Remaining Balance" stroke="#00d4aa" fill="url(#balanceGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Loan schemes */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f4ff", marginBottom: 20 }}>
            <Sparkles size={18} style={{ display: "inline", marginRight: 8, color: "#f5c842" }} />
            Recommended Loan Partners
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {loanSchemes.map((s) => (
              <div key={s.name} className="glass-card" style={{ padding: 24, borderColor: `${s.color}22`, transition: "all 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${s.color}55`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${s.color}22`; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, fontFamily: "Sora,sans-serif", color: s.color }}>
                    {s.logo}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff" }}>{s.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: "Sora,sans-serif" }}>{s.rate}% p.a.</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {s.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#8892a4" }}>
                      <CheckCircle size={12} color={s.color} />
                      {f}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 12 }}>
                  Max: ${(s.maxAmount / 100).toLocaleString()} (₹{(s.maxAmount / 100).toLocaleString()})
                </div>
                <Link href="/apply">
                  <button style={{
                    width: "100%", padding: "10px", borderRadius: 8, border: `1px solid ${s.color}44`,
                    background: `${s.color}12`, color: s.color, fontWeight: 600, fontSize: 13,
                    cursor: "pointer", fontFamily: "Inter,sans-serif", transition: "background 0.2s",
                  }}>
                    Apply Now →
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", paddingBottom: 40 }}>
          <Link href="/apply" id="loan-page-apply-btn">
            <button className="btn-primary" style={{ fontSize: 16, padding: "16px 40px" }}>
              Apply for Loan Now <ArrowRight size={18} />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
