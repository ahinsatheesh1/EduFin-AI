"use client";
import Link from "next/link";
import { ArrowRight, Brain, TrendingUp, Shield, Target, Star, CheckCircle, Zap, Globe, Users, BookOpen, Award } from "lucide-react";

const features = [
  {
    icon: <Brain size={24} color="#00d4aa" />,
    title: "AI Career Navigator",
    desc: "Get personalized recommendations for countries, universities, and courses based on your profile and goals.",
    badge: "Most Popular",
    badgeColor: "teal",
  },
  {
    icon: <TrendingUp size={24} color="#f5c842" />,
    title: "ROI Predictor",
    desc: "See your future salary vs education cost. Calculate payback period and net financial benefit.",
    badge: "Data-Driven",
    badgeColor: "gold",
  },
  {
    icon: <Shield size={24} color="#9d7ef8" />,
    title: "Loan Risk Score",
    desc: "Visual risk meter powered by AI. Know if your loan is Safe, Moderate, or Risky before you apply.",
    badge: "AI-Powered",
    badgeColor: "purple",
  },
  {
    icon: <Target size={24} color="#e84393" />,
    title: "Smart Decision Advisor",
    desc: "AI-generated, personalized advice: take the loan, choose cheaper university, or delay and strengthen.",
    badge: "Unique AI",
    badgeColor: "teal",
  },
];

const steps = [
  { step: "01", title: "Tell Us About Yourself", desc: "Fill a quick 2-min profile: degree, target country, course, and budget.", icon: <Users size={28} color="#00d4aa" /> },
  { step: "02", title: "Get AI Insights", desc: "Our AI analyzes 50+ data points to give you ROI predictions, risk scores, and university matches.", icon: <Brain size={28} color="#7c5fe6" /> },
  { step: "03", title: "Apply Confidently", desc: "With full clarity on your loan decision, apply through our seamless loan conversion flow.", icon: <CheckCircle size={28} color="#f5c842" /> },
];

const testimonials = [
  {
    name: "Priya Sharma", university: "MS CS @ University of Toronto",
    text: "EduFin AI showed me that my loan risk was 'Safe' and I could pay it back in 4.2 years. That confidence made all the difference!",
    rating: 5, avatar: "PS",
  },
  {
    name: "Rahul Mehta", university: "MBA @ University of Manchester",
    text: "The ROI calculator was eye-opening. I changed from a $58K/year university to a £26K one and still got the same ROI outcome.",
    rating: 5, avatar: "RM",
  },
  {
    name: "Ananya Krishnan", university: "MEng @ TU Munich",
    text: "The AI suggested Germany — no tuition fees! I saved ₹30L on my degree. EduFin AI literally changed my financial future.",
    rating: 5, avatar: "AK",
  },
];

const stats = [
  { value: "50,000+", label: "Students Guided", icon: <Users size={20} color="#00d4aa" /> },
  { value: "₹2,400 Cr", label: "Loans Facilitated", icon: <TrendingUp size={20} color="#f5c842" /> },
  { value: "98%", label: "Prediction Accuracy", icon: <Target size={20} color="#9d7ef8" /> },
  { value: "180+", label: "University Partners", icon: <Globe size={20} color="#e84393" /> },
];

export default function LandingPage() {
  return (
    <div style={{ paddingTop: 64 }}>

      {/* Hero Section */}
      <section style={{
        minHeight: "92vh",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
      }} className="grid-bg">
        {/* Blobs */}
        <div className="blob" style={{ width: 500, height: 500, background: "#00d4aa", top: -100, left: -150, animationDelay: "0s" }} />
        <div className="blob" style={{ width: 400, height: 400, background: "#7c5fe6", top: 100, right: -100, animationDelay: "2s" }} />
        <div className="blob" style={{ width: 300, height: 300, background: "#f5c842", bottom: 0, left: "30%", animationDelay: "4s" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720, padding: "0 0 40px" }}>
            {/* Badge */}
            <div style={{ marginBottom: 24 }}>
              <span className="badge badge-teal">
                <Zap size={11} /> AI-Powered Edufin Platform
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 800, lineHeight: 1.1,
              marginBottom: 24,
              color: "#f0f4ff",
            }}>
              Plan your future.{" "}
              <span className="gradient-text">Decide your loan.</span>{" "}
              Powered by AI.
            </h1>

            <p style={{
              fontSize: 18, color: "#8892a4", lineHeight: 1.7,
              maxWidth: 580, marginBottom: 40,
            }}>
              India's first AI-driven platform for students planning higher education — get personalized university matches, ROI predictions, loan risk scores, and smart financial decisions in minutes.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/onboarding" id="hero-cta-btn">
                <button className="btn-primary" style={{ fontSize: 16, padding: "16px 36px" }}>
                  Get Started Free <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/dashboard" id="hero-demo-btn">
                <button className="btn-secondary">
                  View Demo Dashboard
                </button>
              </Link>
            </div>

            {/* Trust signals */}
            <div style={{ marginTop: 48, display: "flex", gap: 32, flexWrap: "wrap" }}>
              {["No credit check needed", "100% free to use", "AI-powered insights"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, color: "#8892a4", fontSize: 13 }}>
                  <CheckCircle size={14} color="#00d4aa" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Floating stats card */}
          <div style={{
            position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)",
            width: 280,
          }} className="hidden lg:block">
            <div className="glass-card gradient-border" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#00d4aa,#7c5fe6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Brain size={16} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontFamily: "Sora,sans-serif", fontWeight: 700, color: "#f0f4ff" }}>AI Risk Analysis</div>
                  <div style={{ fontSize: 10, color: "#00d4aa" }}>Live preview</div>
                </div>
              </div>

              {/* Mini gauge */}
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <svg width="140" height="80" viewBox="0 0 140 80" style={{ margin: "0 auto" }}>
                  <path d="M 10 70 A 60 60 0 0 1 130 70" stroke="#1a2542" strokeWidth="12" fill="none" strokeLinecap="round" />
                  <path d="M 10 70 A 60 60 0 0 1 130 70" stroke="url(#g1)" strokeWidth="12" fill="none" strokeLinecap="round"
                    strokeDasharray="188" strokeDashoffset="56" />
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ff4d6d" />
                      <stop offset="50%" stopColor="#f5c842" />
                      <stop offset="100%" stopColor="#00d4aa" />
                    </linearGradient>
                  </defs>
                  <text x="70" y="68" textAnchor="middle" fill="#00d4aa" fontSize="18" fontWeight="700" fontFamily="Sora,sans-serif">76</text>
                  <text x="70" y="80" textAnchor="middle" fill="#8892a4" fontSize="9" fontFamily="Inter,sans-serif">SAFE SCORE</text>
                </svg>
              </div>

              {[
                { label: "Expected Salary", val: "$110K/yr", color: "#00d4aa" },
                { label: "Monthly EMI", val: "$850", color: "#f5c842" },
                { label: "Payback Period", val: "4.2 years", color: "#9d7ef8" },
              ].map((item) => (
                <div key={item.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <span style={{ fontSize: 12, color: "#8892a4" }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 32 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "Sora,sans-serif", color: "#f0f4ff" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#8892a4", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="badge badge-purple" style={{ marginBottom: 16 }}>
            <Zap size={11} /> Platform Features
          </span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#f0f4ff", marginBottom: 16 }}>
            Everything you need to{" "}
            <span className="gradient-text">make the right choice</span>
          </h2>
          <p style={{ fontSize: 16, color: "#8892a4", maxWidth: 500, margin: "0 auto" }}>
            AI-powered tools that guide you from exploration to confident loan application.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {features.map((f) => (
            <div key={f.title} className="glass-card gradient-border" style={{ padding: 28, transition: "transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
              <div style={{ marginBottom: 16 }}>{f.icon}</div>
              <span className={`badge badge-${f.badgeColor}`} style={{ marginBottom: 12 }}>{f.badge}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f4ff", marginBottom: 10, marginTop: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#8892a4", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: "#f0f4ff", marginBottom: 12 }}>
              How it <span className="gradient-text-teal">works</span>
            </h2>
            <p style={{ color: "#8892a4", fontSize: 15 }}>Three steps to financial clarity</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 32 }}>
            {steps.map((s, i) => (
              <div key={s.step} style={{ textAlign: "center", position: "relative" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 11, color: "#00d4aa", fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>STEP {s.step}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f4ff", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#8892a4", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: "#f0f4ff", marginBottom: 12 }}>
            Students who made <span className="gradient-text">smarter decisions</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card" style={{ padding: 28 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {Array(t.rating).fill(0).map((_, i) => (
                  <Star key={i} size={14} color="#f5c842" fill="#f5c842" />
                ))}
              </div>
              <p style={{ fontSize: 14, color: "#c8d0e0", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg,#00d4aa,#7c5fe6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 14, color: "#fff",
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#8892a4" }}>{t.university}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(0,212,170,0.12), rgba(124,95,230,0.12))",
            border: "1px solid rgba(0,212,170,0.2)",
            borderRadius: 24, padding: "60px 40px",
            position: "relative", overflow: "hidden",
          }}>
            <div className="blob" style={{ width: 200, height: 200, background: "#00d4aa", top: -60, right: -60, opacity: 0.2 }} />
            <span className="badge badge-gold" style={{ marginBottom: 20 }}>
              <Award size={11} /> Limited Time Offer
            </span>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: "#f0f4ff", marginBottom: 16 }}>
              Start your AI-guided journey today
            </h2>
            <p style={{ color: "#8892a4", fontSize: 15, marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
              Join 50,000+ Indian students who made confident education and loan decisions with EduFin AI.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/onboarding" id="landing-bottom-cta">
                <button className="btn-primary" style={{ fontSize: 16, padding: "16px 36px" }}>
                  Get Your Free Report <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 24px",
        textAlign: "center",
        color: "#4a5568",
        fontSize: 13,
      }}>
        <div className="footer-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={16} color="#00d4aa" />
            <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, color: "#f0f4ff" }}>EduFin AI</span>
          </div>
          <span>© 2025 EduFin AI. Empowering Indian students globally.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" style={{ color: "#4a5568", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
