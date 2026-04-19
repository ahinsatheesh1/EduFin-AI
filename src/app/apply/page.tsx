"use client";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { calculateROI, getLoanEligibility } from "@/lib/aiLogic";
import { countries } from "@/lib/mockData";
import Link from "next/link";
import {
  CheckCircle, FileText, Upload, Shield, ArrowRight, Zap, AlertCircle, User, Globe, DollarSign, Award
} from "lucide-react";

const documentChecklist = [
  { id: "admission", label: "Admission / Offer Letter", required: true, desc: "From the target university" },
  { id: "fee", label: "University Fee Structure", required: true, desc: "Official fee breakdown" },
  { id: "marksheets", label: "Academic Marksheets", required: true, desc: "10th, 12th, and degree marksheets" },
  { id: "income", label: "Co-applicant Income Proof", required: true, desc: "Last 3 months salary slips or ITR" },
  { id: "kyc_aadhar", label: "Aadhaar Card", required: true, desc: "Self + co-applicant" },
  { id: "kyc_pan", label: "PAN Card", required: true, desc: "Self + co-applicant" },
  { id: "bank", label: "Bank Statements", required: true, desc: "Last 6 months (co-applicant's bank)" },
  { id: "property", label: "Property Documents", required: false, desc: "If collateral required (loan > ₹40L)" },
  { id: "gre", label: "GRE / GMAT Scorecard", required: false, desc: "If applicable" },
  { id: "statement", label: "Statement of Purpose (SOP)", required: false, desc: "Optional but strengthens profile" },
];

export default function ApplyPage() {
  const { profile } = useUser();
  const numProfile = {
    ...profile,
    tuitionFee: parseFloat(profile.tuitionFee) || 45000,
    livingExpenses: parseFloat(profile.livingExpenses) || 15000,
    loanAmount: parseFloat(profile.loanAmount) || 40000,
    age: parseInt(profile.age) || 23,
  };

  const roi = calculateROI(numProfile);
  const eligibility = getLoanEligibility(numProfile);
  const country = countries.find((c) => c.code === profile.targetCountry);

  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    coApplicant: "",
    collegeName: "",
    admissionYear: "2025",
  });
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0); // 0=details, 1=docs, 2=submit

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const requiredDocs = documentChecklist.filter((d) => d.required);
  const allRequiredChecked = requiredDocs.every((d) => checkedDocs.has(d.id));

  const handleSubmit = () => {
    setSubmitted(true);
  };

  // Success screen
  if (submitted) {
    return (
      <div style={{ paddingTop: 80, minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 24px", textAlign: "center" }}>
          <div className="blob" style={{ width: 300, height: 300, background: "#00d4aa", top: "30%", left: "50%", transform: "translateX(-50%)", opacity: 0.1 }} />

          <div style={{
            width: 90, height: 90, borderRadius: "50%",
            background: "linear-gradient(135deg, #00d4aa, #7c5fe6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px", boxShadow: "0 0 40px rgba(0,212,170,0.4)",
            animation: "float 3s ease-in-out infinite",
          }}>
            <CheckCircle size={44} color="#fff" />
          </div>

          <span className="badge badge-teal" style={{ marginBottom: 20 }}>
            <Zap size={11} /> Application Received
          </span>

          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#f0f4ff", marginBottom: 12 }}>
            🎉 Application Submitted!
          </h1>
          <p style={{ color: "#8892a4", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Your education loan application has been received. Our AI has matched your profile with the best lenders.
            Expect a call from our loan advisor within <strong style={{ color: "#00d4aa" }}>24 hours</strong>.
          </p>

          <div className="glass-card" style={{ padding: 24, textAlign: "left", marginBottom: 32 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff", marginBottom: 16 }}>Application Summary</h3>
            {[
              { label: "Applicant", value: profile.name || "Demo User" },
              { label: "Loan Amount", value: `$${numProfile.loanAmount.toLocaleString()}` },
              { label: "Program", value: `${profile.courseInterest} · ${country?.name}` },
              { label: "Expected Salary", value: `$${roi.annualSalary.toLocaleString()}/yr` },
              { label: "Status", value: "🟢 Under Review" },
              { label: "Ref No.", value: `EFA-${Date.now().toString().slice(-6)}` },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                <span style={{ fontSize: 13, color: "#8892a4" }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#f0f4ff" }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard">
              <button className="btn-primary">Back to Dashboard <ArrowRight size={16} /></button>
            </Link>
            <button className="btn-secondary" onClick={() => { setSubmitted(false); setStep(0); }}>
              Start New Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stepTitles = ["Your Details", "Document Checklist", "Review & Submit"];
  const progress = ((step + 1) / 3) * 100;

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "var(--bg-primary)" }} className="grid-bg">
      <div className="blob" style={{ width: 400, height: 400, background: "#00d4aa", top: -80, right: -80, opacity: 0.08 }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="badge badge-gold" style={{ marginBottom: 12 }}>
            <Award size={11} /> Final Step
          </span>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, color: "#f0f4ff", marginBottom: 8 }}>
            Apply for Your <span className="gradient-text">Education Loan</span>
          </h1>
          <p style={{ color: "#8892a4", fontSize: 15 }}>Complete your application in 3 simple steps</p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 36 }}>
          {stepTitles.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 16px", borderRadius: 100,
                background: i === step ? "rgba(0,212,170,0.15)" : i < step ? "rgba(0,212,170,0.08)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${i <= step ? "rgba(0,212,170,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: i < step ? "#00d4aa" : i === step ? "linear-gradient(135deg,#00d4aa,#7c5fe6)" : "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: i <= step ? "#fff" : "#4a5568",
                }}>
                  {i < step ? <CheckCircle size={12} /> : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: i === step ? "#00d4aa" : i < step ? "#8892a4" : "#4a5568", whiteSpace: "nowrap" }} className="hidden sm:inline">
                  {t}
                </span>
              </div>
              {i < 2 && <div style={{ width: 24, height: 1, background: i < step ? "#00d4aa" : "rgba(255,255,255,0.08)" }} />}
            </div>
          ))}
        </div>

        {/* Pre-filled profile summary */}
        <div className="glass-card" style={{ padding: 20, marginBottom: 24, background: "rgba(0,212,170,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Zap size={14} color="#00d4aa" />
            <span style={{ fontSize: 13, color: "#00d4aa", fontWeight: 600 }}>AI Pre-filled from your profile</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {[
              { label: "Name", value: profile.name || "Demo Student", icon: <User size={12} /> },
              { label: "Target", value: country?.name || "United States", icon: <Globe size={12} /> },
              { label: "Course", value: profile.courseInterest, icon: <FileText size={12} /> },
              { label: "Loan Needed", value: `$${numProfile.loanAmount.toLocaleString()}`, icon: <DollarSign size={12} /> },
              { label: "Max Eligible", value: `$${eligibility.maxEligible.toLocaleString()}`, icon: <Shield size={12} /> },
              { label: "Best Rate", value: `${eligibility.interestRate}%`, icon: <Award size={12} /> },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 12px",
              }}>
                <span style={{ color: "#00d4aa" }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 10, color: "#4a5568" }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 0: Details */}
        {step === 0 && (
          <div className="glass-card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 24 }}>
              <User size={16} style={{ display: "inline", marginRight: 8, color: "#00d4aa" }} />
              Contact & Application Details
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { id: "email", label: "Email Address", placeholder: "your@email.com", key: "email" },
                { id: "phone", label: "Mobile Number", placeholder: "+91 98765 43210", key: "phone" },
                { id: "coApplicant", label: "Co-applicant Name", placeholder: "Parent/Guardian name", key: "coApplicant" },
                { id: "collegeName", label: "Target University/College", placeholder: "e.g. MIT, IIT Bombay", key: "collegeName" },
              ].map((f) => (
                <div key={f.id}>
                  <label style={{ display: "block", fontSize: 12, color: "#8892a4", fontWeight: 600, marginBottom: 6 }}>{f.label}</label>
                  <input
                    id={`apply-${f.id}`}
                    className="input-field"
                    placeholder={f.placeholder}
                    value={formData[f.key as keyof typeof formData]}
                    onChange={(e) => setFormData((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#8892a4", fontWeight: 600, marginBottom: 6 }}>Admission Year</label>
                <select
                  id="apply-year"
                  className="input-field"
                  value={formData.admissionYear}
                  onChange={(e) => setFormData((p) => ({ ...p, admissionYear: e.target.value }))}
                >
                  {["2025", "2026", "2027"].map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-primary" id="apply-step1-next" onClick={() => setStep(1)}>
                Next: Documents <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Documents */}
        {step === 1 && (
          <div className="glass-card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 6 }}>
              <FileText size={16} style={{ display: "inline", marginRight: 8, color: "#00d4aa" }} />
              Document Checklist
            </h2>
            <p style={{ fontSize: 13, color: "#8892a4", marginBottom: 24 }}>
              Mark the documents you have ready. You can proceed without all optional documents.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {documentChecklist.map((doc) => (
                <div
                  key={doc.id}
                  id={`doc-${doc.id}`}
                  onClick={() => toggleDoc(doc.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                    background: checkedDocs.has(doc.id) ? "rgba(0,212,170,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${checkedDocs.has(doc.id) ? "rgba(0,212,170,0.25)" : "rgba(255,255,255,0.07)"}`,
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    border: `2px solid ${checkedDocs.has(doc.id) ? "#00d4aa" : "rgba(255,255,255,0.2)"}`,
                    background: checkedDocs.has(doc.id) ? "#00d4aa" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>
                    {checkedDocs.has(doc.id) && <CheckCircle size={14} color="#070b14" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff" }}>
                      {doc.label}
                      {doc.required && <span style={{ color: "#ff4d6d", marginLeft: 4, fontSize: 11 }}>*Required</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "#4a5568" }}>{doc.desc}</div>
                  </div>
                  <Upload size={14} color="#4a5568" />
                </div>
              ))}
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8892a4", marginBottom: 6 }}>
                <span>{checkedDocs.size} of {documentChecklist.length} documents ready</span>
                <span style={{ color: allRequiredChecked ? "#00d4aa" : "#f5c842" }}>
                  {allRequiredChecked ? "✓ All required docs ready" : `${requiredDocs.filter(d => !checkedDocs.has(d.id)).length} required docs remaining`}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(checkedDocs.size / documentChecklist.length) * 100}%` }} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn-secondary" onClick={() => setStep(0)}>← Back</button>
              <button className="btn-primary" id="apply-step2-next" onClick={() => setStep(2)}>
                Review Application <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review & Submit */}
        {step === 2 && (
          <div>
            <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 20 }}>
                Review Your Application
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "Applicant Name", value: profile.name || "Demo Student" },
                  { label: "Email", value: formData.email || "Not provided" },
                  { label: "Phone", value: formData.phone || "Not provided" },
                  { label: "Co-applicant", value: formData.coApplicant || "Not provided" },
                  { label: "Target University", value: formData.collegeName || "To be decided" },
                  { label: "Program", value: profile.courseInterest },
                  { label: "Country", value: country?.name || "United States" },
                  { label: "Loan Amount", value: `$${numProfile.loanAmount.toLocaleString()}` },
                  { label: "Interest Rate", value: `${eligibility.interestRate}%` },
                  { label: "Documents Ready", value: `${checkedDocs.size}/${documentChecklist.length}` },
                ].map((item) => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: "#4a5568", marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff" }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div style={{
                background: "rgba(245,200,66,0.06)", border: "1px solid rgba(245,200,66,0.2)",
                borderRadius: 10, padding: "12px 16px", marginBottom: 24,
                display: "flex", gap: 12,
              }}>
                <AlertCircle size={16} color="#f5c842" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: "#c8d0e0", lineHeight: 1.6 }}>
                  By submitting, you authorize EduFin AI to share your profile with partner lending institutions for loan processing. Your data is protected under our privacy policy.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary" id="apply-submit-btn" onClick={handleSubmit} style={{ padding: "14px 36px" }}>
                  🚀 Submit Application
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
