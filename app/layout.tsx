import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "DashboardAI — Build your personal command center",
  description: "Chat with AI to design and configure your own personal student dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} style={{ background: "#04050f" }}>
      <body className="min-h-screen" style={{ fontFamily: "var(--font-geist), -apple-system, sans-serif" }}>
        {/* Animated background orbs */}
        <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", width: 600, height: 600, borderRadius: "50%",
            background: "rgba(99,91,255,0.12)", filter: "blur(100px)",
            top: "10%", left: "15%", animation: "orbDrift 18s ease-in-out infinite"
          }} />
          <div style={{
            position: "absolute", width: 500, height: 500, borderRadius: "50%",
            background: "rgba(56,189,248,0.07)", filter: "blur(100px)",
            top: "60%", right: "10%", animation: "orbDrift 22s ease-in-out infinite", animationDelay: "-6s"
          }} />
          <div style={{
            position: "absolute", width: 350, height: 350, borderRadius: "50%",
            background: "rgba(168,85,247,0.08)", filter: "blur(80px)",
            top: "40%", left: "50%", animation: "orbDrift 16s ease-in-out infinite", animationDelay: "-11s"
          }} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
