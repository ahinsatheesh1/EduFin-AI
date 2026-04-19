"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import { chatResponses } from "@/lib/mockData";

interface Message {
  role: "user" | "ai";
  text: string;
  time: string;
}

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const keyword of Object.keys(chatResponses)) {
    if (keyword !== "default" && lower.includes(keyword)) {
      return chatResponses[keyword];
    }
  }
  // Check multi-word combos
  if (lower.includes("study abroad") || lower.includes("international")) return chatResponses.visa;
  if (lower.includes("interest") || lower.includes("rate")) return chatResponses.loan;
  if (lower.includes("monthly") || lower.includes("repay")) return chatResponses.emi;
  if (lower.includes("apply") || lower.includes("documents")) return chatResponses.document;
  return chatResponses.default;
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const suggestions = [
  "How does education loan work?",
  "What are visa requirements for US?",
  "What GRE score do I need?",
  "Available scholarships for India?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "👋 Hi there! I'm your EduFin AI Mentor. Ask me about loans, universities, visas, or anything education-related!", time: getTime() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const userMsg: Message = { role: "user", text: msg, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const aiMsg: Message = { role: "ai", text: getResponse(msg), time: getTime() };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        id="chatbot-open-btn"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 999,
          width: 58, height: 58, borderRadius: "50%",
          background: "linear-gradient(135deg, #00d4aa, #7c5fe6)",
          border: "none", cursor: "pointer",
          display: open ? "none" : "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 30px rgba(0, 212, 170, 0.4)",
          animation: "float 3s ease-in-out infinite",
        }}
      >
        <MessageCircle size={26} color="#fff" />
        <span style={{
          position: "absolute", top: -4, right: -4, width: 18, height: 18,
          background: "#f5c842", borderRadius: "50%", border: "2px solid #070b14",
          fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, color: "#070b14",
        }}>AI</span>
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 1001,
          width: 360, maxWidth: "calc(100vw - 32px)",
          borderRadius: 20,
          background: "#0c1220",
          border: "1px solid rgba(0, 212, 170, 0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,170,0.1)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          animation: "slideUp 0.3s ease",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, rgba(0,212,170,0.15), rgba(124,95,230,0.15))",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "linear-gradient(135deg, #00d4aa, #7c5fe6)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 15, color: "#f0f4ff" }}>
                  EduFin Mentor
                </div>
                <div style={{ fontSize: 11, color: "#00d4aa", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4aa", display: "inline-block" }} />
                  Online · AI Powered
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8,
              padding: 6, cursor: "pointer", color: "#8892a4", display: "flex",
            }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "16px",
            display: "flex", flexDirection: "column", gap: 12,
            maxHeight: 380, minHeight: 280,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex", flexDirection: "column",
                alignItems: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div className={m.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                  {m.role === "ai" && <span style={{ color: "#00d4aa", fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>🤖 EduFin AI</span>}
                  {m.text}
                </div>
                <span style={{ fontSize: 10, color: "#4a5568", marginTop: 2 }}>{m.time}</span>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <div className="chat-bubble-ai" style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 7, height: 7, borderRadius: "50%", background: "#00d4aa",
                      animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                      display: "inline-block",
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div style={{ padding: "8px 16px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {suggestions.slice(0, 2).map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)} style={{
                background: "rgba(0, 212, 170, 0.08)", border: "1px solid rgba(0, 212, 170, 0.15)",
                borderRadius: 100, padding: "4px 10px", color: "#00d4aa", fontSize: 11,
                cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "background 0.2s",
              }}>
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", gap: 8,
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything..."
              style={{
                flex: 1, background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "10px 14px",
                color: "#f0f4ff", fontSize: 13, outline: "none",
                fontFamily: "Inter, sans-serif",
              }}
              id="chatbot-input"
            />
            <button onClick={() => sendMessage()} id="chatbot-send-btn" style={{
              background: "linear-gradient(135deg, #00d4aa, #00a8ff)",
              border: "none", borderRadius: 10, padding: "0 14px",
              cursor: "pointer", display: "flex", alignItems: "center",
            }}>
              <Send size={16} color="#070b14" />
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
