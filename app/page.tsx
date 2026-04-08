"use client";

import Link from "next/link";

const features = [
  { icon: "✓", label: "To-Do & task management" },
  { icon: "✓", label: "Calendar + ICS import" },
  { icon: "✓", label: "GPA tracker" },
  { icon: "✓", label: "AI assistant (JoeGPT)" },
  { icon: "✓", label: "Email summaries via AI" },
  { icon: "✓", label: "Brightspace / LMS sync" },
];

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      {/* Hero */}
      <div className="animate-fade-up" style={{ textAlign: "center", maxWidth: 640, marginBottom: 60 }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24,
          padding: "6px 14px", borderRadius: 100,
          background: "rgba(99,91,255,0.12)", border: "1px solid rgba(99,91,255,0.3)",
          fontSize: 13, color: "#a5a3ff"
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#635bff", display: "inline-block" }} />
          AI-powered dashboard builder
        </div>

        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.02em" }}>
          Your personal{" "}
          <span style={{ background: "linear-gradient(135deg, #635bff, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            command center
          </span>
          <br />built by AI, for you
        </h1>

        <p style={{ fontSize: "1.1rem", color: "#9ca3af", lineHeight: 1.7, marginBottom: 36 }}>
          Chat with an AI to configure a fully personalized student dashboard — tasks, calendar, grades, email, and more — in minutes.
        </p>

        <Link href="/build" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "14px 32px", borderRadius: 12, fontWeight: 600, fontSize: "1rem",
          background: "linear-gradient(135deg, #635bff, #7c3aed)",
          color: "#fff", textDecoration: "none",
          boxShadow: "0 0 40px rgba(99,91,255,0.35)",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 60px rgba(99,91,255,0.5)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 40px rgba(99,91,255,0.35)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
        >
          Build my dashboard
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Features grid */}
      <div className="animate-fade-up" style={{ animationDelay: "0.15s", opacity: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, maxWidth: 640, width: "100%", marginBottom: 60 }}>
        {features.map((f) => (
          <div key={f.label} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px", borderRadius: 10,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            fontSize: 14, color: "#d1d5db"
          }}>
            <span style={{ color: "#635bff", fontWeight: 700 }}>{f.icon}</span>
            {f.label}
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="animate-fade-up" style={{ animationDelay: "0.25s", opacity: 0, fontSize: 13, color: "#4b5563", textAlign: "center" }}>
        No account needed · Fully customizable · Powered by Claude AI
      </p>
    </main>
  );
}
