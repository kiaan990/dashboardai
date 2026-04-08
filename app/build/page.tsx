"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type DashboardConfig = {
  name: string;
  school: string;
  email: string;
  lms: string;
  features: string[];
  emailProvider: string;
  calendarExport: boolean;
  brightspaceUser?: string | null;
};

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Hey! I'm DashboardAI ⚡ I'll help you set up your own personal Command Center — a dashboard with tasks, calendar, grades, email summaries, and an AI assistant, all in one place.\n\nLet's start simple: what's your name, and what school are you at?",
};

function extractConfig(text: string): DashboardConfig | null {
  const match = text.match(/```dashboard-config\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function stripConfig(text: string): string {
  return text.replace(/```dashboard-config[\s\S]*?```\n?/, "").trim();
}

function SetupGuide({ config }: { config: DashboardConfig }) {
  const [copied, setCopied] = useState<string | null>(null);

  const featureLabels: Record<string, string> = {
    todo: "To-Do & Tasks",
    calendar: "Calendar",
    gpa: "GPA Tracker",
    email: "Email Summaries",
    "ai-assistant": "AI Assistant (JoeGPT)",
    lms: `${config.lms.charAt(0).toUpperCase() + config.lms.slice(1)} Integration`,
  };

  const envLines: string[] = [
    `# ${config.name}'s Dashboard — ${config.school}`,
    `NEXTAUTH_URL=http://localhost:3000`,
    ``,
    `# AI (required for JoeGPT + email summaries)`,
    `ANTHROPIC_API_KEY=sk-ant-...  # get from console.anthropic.com`,
    ``,
  ];

  if (config.emailProvider === "gmail" || config.emailProvider === "both") {
    envLines.push(
      `# Gmail OAuth — create at console.cloud.google.com`,
      `GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com`,
      `GOOGLE_CLIENT_SECRET=your-secret`,
      ``
    );
  }
  if (config.emailProvider === "outlook" || config.emailProvider === "both") {
    envLines.push(
      `# Outlook OAuth — create at portal.azure.com`,
      `MICROSOFT_CLIENT_ID=your-client-id`,
      `MICROSOFT_CLIENT_SECRET=your-secret`,
      `MICROSOFT_TENANT_ID=your-tenant-id`,
      ``
    );
  }
  if (config.lms === "brightspace") {
    envLines.push(
      `# Brightspace login`,
      `BRIGHTSPACE_USER=${config.brightspaceUser || config.email}`,
      `BRIGHTSPACE_PASS=your-brightspace-password`,
      ``
    );
  }

  const envContent = envLines.join("\n");

  const steps = [
    {
      title: "Clone the repo",
      code: `git clone https://github.com/kiaan990/kiaan99.git my-dashboard\ncd my-dashboard\nnpm install`,
    },
    {
      title: "Create your .env.local",
      code: envContent,
      label: ".env.local",
    },
    {
      title: "Set up the database",
      code: `npx prisma migrate dev --name init`,
    },
    {
      title: "Start your dashboard",
      code: `npm run dev\n# Open http://localhost:3000`,
    },
  ];

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="animate-fade-in" style={{ padding: "8px 0 32px" }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px", borderRadius: 14, marginBottom: 24,
        background: "linear-gradient(135deg, rgba(99,91,255,0.15), rgba(124,58,237,0.1))",
        border: "1px solid rgba(99,91,255,0.25)"
      }}>
        <div style={{ fontSize: 13, color: "#a5a3ff", marginBottom: 6 }}>Your personalized setup</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{config.name}&apos;s Command Center</div>
        <div style={{ fontSize: 13, color: "#9ca3af" }}>{config.school}</div>

        {/* Features */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {config.features.map((f) => (
            <span key={f} style={{
              padding: "4px 10px", borderRadius: 100, fontSize: 12,
              background: "rgba(99,91,255,0.2)", border: "1px solid rgba(99,91,255,0.3)",
              color: "#a5a3ff"
            }}>
              {featureLabels[f] || f}
            </span>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(99,91,255,0.25)", color: "#a5a3ff", fontSize: 12, fontWeight: 700, flexShrink: 0
              }}>{i + 1}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{step.title}</span>
              {step.label && <span style={{ marginLeft: "auto", fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>{step.label}</span>}
            </div>
            <div style={{ position: "relative" }}>
              <pre style={{
                margin: 0, padding: "14px 16px", paddingRight: 50,
                fontSize: 12.5, lineHeight: 1.65, overflowX: "auto",
                background: "rgba(0,0,0,0.3)", color: "#d1d5db", fontFamily: "monospace"
              }}>
                <code>{step.code}</code>
              </pre>
              <button
                onClick={() => copy(step.code, String(i))}
                style={{
                  position: "absolute", top: 10, right: 10,
                  padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.06)", color: "#9ca3af", fontSize: 11, cursor: "pointer",
                  fontFamily: "inherit"
                }}
              >
                {copied === String(i) ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Extra notes */}
      {config.emailProvider === "gmail" && (
        <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 12, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", fontSize: 13, color: "#93c5fd" }}>
          <strong>Gmail setup tip:</strong> Go to Google Cloud Console → Create OAuth 2.0 credentials → add <code style={{ background: "rgba(255,255,255,0.1)", padding: "1px 5px", borderRadius: 4 }}>http://localhost:3000/api/email/gmail/callback</code> as an authorized redirect URI. Add yourself as a test user.
        </div>
      )}
      {config.lms === "brightspace" && (
        <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: 12, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", fontSize: 13, color: "#fcd34d" }}>
          <strong>Brightspace note:</strong> The sync feature uses Playwright to log in with your school SSO. It only runs locally (not on cloud deployments) since it opens a real browser window for MFA.
        </div>
      )}

      <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12, background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 13, color: "#6ee7b7" }}>
        <strong>Deploy to Vercel:</strong> Push to GitHub, then run <code style={{ background: "rgba(255,255,255,0.1)", padding: "1px 5px", borderRadius: 4 }}>npx vercel</code> and add all your env vars in the Vercel dashboard to access from anywhere.
      </div>
    </div>
  );
}

export default function BuildPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, config]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const current = accumulated;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: current };
          return updated;
        });
      }

      // Check if the final message contains a config
      const detected = extractConfig(accumulated);
      if (detected) setConfig(detected);
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
      {/* Header */}
      <header style={{ padding: "20px 0", display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #635bff, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
            ⚡
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>DashboardAI</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Powered by Claude</div>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#10b981" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          Online
        </div>
      </header>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 0", display: "flex", flexDirection: "column", gap: 20 }}>
        {messages.map((msg, i) => {
          const isLast = i === messages.length - 1;
          const hasConfig = isLast && extractConfig(msg.content);
          const displayContent = hasConfig ? stripConfig(msg.content) : msg.content;

          return (
            <div key={i} className="animate-fade-in" style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start", gap: 12 }}>
              {msg.role === "assistant" && (
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #635bff, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 2 }}>
                  ⚡
                </div>
              )}
              <div style={{ maxWidth: "80%", flex: hasConfig ? 1 : undefined }}>
                {displayContent && (
                  <div style={{
                    padding: "12px 16px",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.role === "user" ? "linear-gradient(135deg, #635bff, #7c3aed)" : "rgba(255,255,255,0.05)",
                    border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.07)",
                    fontSize: 14.5, lineHeight: 1.65,
                    color: msg.role === "user" ? "#fff" : "#e8eaf0",
                    whiteSpace: "pre-wrap",
                    marginBottom: hasConfig ? 16 : 0
                  }}>
                    {displayContent || (
                      <span style={{ display: "flex", gap: 4, alignItems: "center", padding: "2px 0" }}>
                        <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                      </span>
                    )}
                  </div>
                )}
                {hasConfig && config && <SetupGuide config={config} />}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input — hide once config is shown */}
      {!config && (
        <div style={{ padding: "16px 0 24px" }}>
          <div style={{
            display: "flex", gap: 10, alignItems: "flex-end",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 14, padding: "10px 12px 10px 16px",
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              disabled={loading}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#e8eaf0", fontSize: 14.5, resize: "none", lineHeight: 1.6,
                fontFamily: "inherit", maxHeight: 120, overflow: "auto",
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                width: 36, height: 36, borderRadius: 9, border: "none",
                cursor: loading || !input.trim() ? "default" : "pointer",
                background: loading || !input.trim() ? "rgba(99,91,255,0.3)" : "linear-gradient(135deg, #635bff, #7c3aed)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 8L3 3l2 5-2 5 10-5z" fill="currentColor" />
              </svg>
            </button>
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: "#374151", marginTop: 10 }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
}
