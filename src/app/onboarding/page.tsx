"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { countries } from "@/lib/mockData";
import { ChevronRight, ChevronLeft, User, Globe, BookOpen, DollarSign, CheckCircle, Sparkles } from "lucide-react";

const courses = ["Computer Science", "Data Science", "MBA", "Engineering", "Medicine", "Law", "Finance", "Design", "Public Policy"];
const degrees = ["B.Tech/BE", "BCA", "BBA", "B.Sc", "BA", "Other UG", "Working Professional (1-3 yrs)", "Working Professional (3+ yrs)"];

const steps = [
  { title: "Personal Info", icon: <User size={18} />, desc: "Tell us about yourself" },
  { title: "Academic Profile", icon: <BookOpen size={18} />, desc: "Your current education" },
  { title: "Target Destination", icon: <Globe size={18} />, desc: "Where do you want to study?" },
  { title: "Financial Planning", icon: <DollarSign size={18} />, desc: "Loan & budget details" },
];

export default function OnboardingPage() {
  const { profile, updateProfile, setProfile } = useUser();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validate = (currentStep: number) => {
    const errs: Record<string, string> = {};
    if (currentStep === 0) {
      if (!profile.name.trim()) errs.name = "Please enter your name";
      if (!profile.age || parseInt(profile.age) < 18 || parseInt(profile.age) > 40) errs.age = "Enter age between 18–40";
    }
    if (currentStep === 1) {
      if (!profile.currentDegree) errs.currentDegree = "Select your current degree";
      if (!profile.courseInterest) errs.courseInterest = "Select course interest";
    }
    if (currentStep === 2) {
      if (!profile.targetCountry) errs.targetCountry = "Select target country";
    }
    if (currentStep === 3) {
      if (!profile.tuitionFee || parseFloat(profile.tuitionFee) <= 0) errs.tuitionFee = "Enter valid tuition fee";
      if (!profile.loanAmount || parseFloat(profile.loanAmount) <= 0) errs.loanAmount = "Enter valid loan amount";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate(step)) return;
    if (step < steps.length - 1) setStep(step + 1);
    else router.push("/dashboard");
  };

  const InputGroup = ({ label, id, required, children, error }: any) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#8892a4", marginBottom: 8, letterSpacing: 0.3 }}>
        {label} {required && <span style={{ color: "#ff4d6d" }}>*</span>}
      </label>
      {children}
      {error && <div style={{ color: "#ff4d6d", fontSize: 12, marginTop: 6 }}>⚠ {error}</div>}
    </div>
  );

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80, background: "var(--bg-primary)" }} className="grid-bg">
      {/* Blobs */}
      <div className="blob" style={{ width: 400, height: 400, background: "#7c5fe6", top: 0, right: 0, opacity: 0.1 }} />
      <div className="blob" style={{ width: 300, height: 300, background: "#00d4aa", bottom: 100, left: 0, opacity: 0.1 }} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: 100, marginBottom: 16 }}>
            <Sparkles size={14} color="#00d4aa" />
            <span style={{ fontSize: 12, color: "#00d4aa", fontWeight: 600 }}>2-Minute Setup</span>
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#f0f4ff", marginBottom: 8 }}>
            Build your EduFin profile
          </h1>
          <p style={{ color: "#8892a4", fontSize: 15 }}>We'll personalize your AI insights based on your answers</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32, position: "relative" }}>
          <div style={{
            position: "absolute", top: "50%", left: 0, right: 0, height: 2,
            background: "rgba(255,255,255,0.06)", transform: "translateY(-50%)",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: 0, height: 2,
            background: "linear-gradient(90deg, #00d4aa, #7c5fe6)",
            transform: "translateY(-50%)",
            width: `${progress}%`,
            transition: "width 0.4s ease",
          }} />
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 1 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: i <= step ? "linear-gradient(135deg,#00d4aa,#7c5fe6)" : "#0c1220",
                border: `2px solid ${i <= step ? "transparent" : "rgba(255,255,255,0.12)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: i <= step ? "#fff" : "#4a5568",
                transition: "all 0.3s",
              }}>
                {i < step ? <CheckCircle size={18} /> : s.icon}
              </div>
              <div style={{ fontSize: 11, color: i === step ? "#00d4aa" : "#4a5568", fontWeight: i === step ? 700 : 400, whiteSpace: "nowrap" }} className="hidden sm:block">
                {s.title}
              </div>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="glass-card" style={{ padding: "36px 32px" }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>{steps[step].title}</h2>
            <p style={{ color: "#8892a4", fontSize: 14 }}>{steps[step].desc}</p>
          </div>

          {/* Step 0: Personal Info */}
          {step === 0 && (
            <div>
              <InputGroup label="Full Name" required error={errors.name}>
                <input
                  id="input-name"
                  className="input-field"
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile("name", e.target.value)}
                  placeholder="e.g. Priya Sharma"
                />
              </InputGroup>
              <InputGroup label="Age" required error={errors.age}>
                <input
                  id="input-age"
                  className="input-field"
                  type="number"
                  value={profile.age}
                  onChange={(e) => updateProfile("age", e.target.value)}
                  placeholder="e.g. 23"
                  min="18" max="40"
                />
              </InputGroup>
            </div>
          )}

          {/* Step 1: Academic */}
          {step === 1 && (
            <div>
              <InputGroup label="Current/Last Degree" required error={errors.currentDegree}>
                <select id="input-degree" className="input-field" value={profile.currentDegree} onChange={(e) => updateProfile("currentDegree", e.target.value)}>
                  {degrees.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </InputGroup>
              <InputGroup label="Target Course / Field of Study" required error={errors.courseInterest}>
                <select id="input-course" className="input-field" value={profile.courseInterest} onChange={(e) => updateProfile("courseInterest", e.target.value)}>
                  {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </InputGroup>
            </div>
          )}

          {/* Step 2: Destination */}
          {step === 2 && (
            <div>
              <InputGroup label="Target Country" required error={errors.targetCountry}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
                  {countries.map((c) => (
                    <button
                      key={c.code}
                      id={`country-${c.code}`}
                      onClick={() => updateProfile("targetCountry", c.code)}
                      style={{
                        background: profile.targetCountry === c.code ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.04)",
                        border: `2px solid ${profile.targetCountry === c.code ? "#00d4aa" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 12, padding: "14px 12px", cursor: "pointer",
                        color: "#f0f4ff", fontFamily: "Inter, sans-serif",
                        textAlign: "center", transition: "all 0.2s",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{c.flag}</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</span>
                      <span style={{ fontSize: 10, color: "#8892a4" }}>{c.visaType}</span>
                    </button>
                  ))}
                </div>
              </InputGroup>
            </div>
          )}

          {/* Step 3: Financial */}
          {step === 3 && (
            <div>
              <InputGroup label="Annual Tuition Fee (USD or equivalent)" required error={errors.tuitionFee}>
                <div style={{ position: "relative" }}>
                  <input
                    id="input-tuition"
                    className="input-field"
                    type="number"
                    value={profile.tuitionFee}
                    onChange={(e) => updateProfile("tuitionFee", e.target.value)}
                    placeholder="e.g. 45000"
                    style={{ paddingLeft: 40 }}
                  />
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8892a4", fontSize: 14 }}>$</span>
                </div>
              </InputGroup>
              <InputGroup label="Annual Living Expenses (estimated)" error={errors.livingExpenses}>
                <div style={{ position: "relative" }}>
                  <input
                    id="input-living"
                    className="input-field"
                    type="number"
                    value={profile.livingExpenses}
                    onChange={(e) => updateProfile("livingExpenses", e.target.value)}
                    placeholder="e.g. 15000"
                    style={{ paddingLeft: 40 }}
                  />
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8892a4", fontSize: 14 }}>$</span>
                </div>
              </InputGroup>
              <InputGroup label="Expected Loan Amount" required error={errors.loanAmount}>
                <div style={{ position: "relative" }}>
                  <input
                    id="input-loan"
                    className="input-field"
                    type="number"
                    value={profile.loanAmount}
                    onChange={(e) => updateProfile("loanAmount", e.target.value)}
                    placeholder="e.g. 40000"
                    style={{ paddingLeft: 40 }}
                  />
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8892a4", fontSize: 14 }}>$</span>
                </div>
              </InputGroup>

              {/* Quick presets */}
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 8 }}>Quick presets:</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { label: "Budget (≤$20K)", loan: "20000", tuition: "20000" },
                    { label: "Mid-range ($40K)", loan: "40000", tuition: "40000" },
                    { label: "Premium ($60K)", loan: "55000", tuition: "58000" },
                  ].map((p) => (
                    <button key={p.label} onClick={() => {
                      updateProfile("loanAmount", p.loan);
                      updateProfile("tuitionFee", p.tuition);
                    }} style={{
                      padding: "6px 14px", borderRadius: 8,
                      background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.15)",
                      color: "#00d4aa", fontSize: 12, cursor: "pointer", fontFamily: "Inter,sans-serif",
                    }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 12 }}>
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="btn-secondary"
              id="onboarding-prev-btn"
              style={{ opacity: step === 0 ? 0.4 : 1, display: "flex", alignItems: "center", gap: 8 }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={handleNext}
              className="btn-primary"
              id="onboarding-next-btn"
              style={{ flex: 1, maxWidth: 240, justifyContent: "center" }}
            >
              {step === steps.length - 1 ? (
                <><Sparkles size={16} /> Generate AI Report</>
              ) : (
                <>Continue <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </div>

        {/* Security note */}
        <p style={{ textAlign: "center", color: "#4a5568", fontSize: 12, marginTop: 20 }}>
          🔒 Your data is private and never shared. Used only to generate your personalized AI report.
        </p>
      </div>
    </div>
  );
}
