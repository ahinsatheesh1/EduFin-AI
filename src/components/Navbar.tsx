"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/onboarding", label: "Get Started" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/loan", label: "Loan Planner" },
  { href: "/apply", label: "Apply Now" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "rgba(7, 11, 20, 0.92)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #00d4aa, #7c5fe6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{
            fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 18,
            background: "linear-gradient(135deg, #00d4aa, #7c5fe6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            EduFin AI
          </span>
        </Link>

        {/* Desktop links — hidden on mobile via CSS */}
        <div className="nav-desktop" style={{ gap: 4, alignItems: "center" }}>
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} style={{
                padding: "8px 13px", borderRadius: 8, textDecoration: "none",
                fontSize: 14, fontWeight: 500, transition: "all 0.2s",
                color: active ? "#00d4aa" : "#8892a4",
                background: active ? "rgba(0,212,170,0.1)" : "transparent",
                whiteSpace: "nowrap",
              }}>
                {link.label}
              </Link>
            );
          })}
          <Link href="/apply">
            <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13, marginLeft: 8, width: "auto" }}>
              Apply for Loan
            </button>
          </Link>
        </div>

        {/* Hamburger button — shown only on mobile via CSS */}
        <button
          onClick={() => setOpen(!open)}
          className="nav-mobile-btn"
          style={{ background: "none", border: "none", color: "#f0f4ff", cursor: "pointer", padding: 4 }}
          aria-label="Toggle navigation"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="nav-mobile-menu"
          style={{
            flexDirection: "column", gap: 2,
            padding: "12px 20px 20px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(7,11,20,0.98)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "13px 16px", borderRadius: 8, textDecoration: "none",
                color: pathname === link.href ? "#00d4aa" : "#c8d0e0",
                fontSize: 15, fontWeight: 500,
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/apply" onClick={() => setOpen(false)}>
            <button className="btn-primary" style={{ marginTop: 14, fontSize: 14 }}>
              Apply for Loan
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
