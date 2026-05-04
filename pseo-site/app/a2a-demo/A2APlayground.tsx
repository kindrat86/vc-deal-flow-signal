"use client";

import { useState } from "react";

interface SectorOption {
  slug: string;
  name: string;
}

interface PlaygroundProps {
  sectorOptions: SectorOption[];
  suggestedStartup: string;
}

type PromptMode = "trending" | "sector" | "lookup" | "summary" | "methodology";

export default function A2APlayground({ sectorOptions, suggestedStartup }: PlaygroundProps) {
  const [mode, setMode] = useState<PromptMode>("trending");
  const [sector, setSector] = useState(sectorOptions[0]?.slug ?? "ai-ml");
  const [name, setName] = useState(suggestedStartup);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [requestPreview, setRequestPreview] = useState<string>("");

  function buildBody(): Record<string, unknown> {
    if (mode === "trending") {
      return {
        jsonrpc: "2.0",
        id: 1,
        method: "message/send",
        params: {
          message: {
            role: "user",
            parts: [{ kind: "text", text: "Show me trending startups" }],
          },
        },
      };
    }
    if (mode === "sector") {
      return {
        jsonrpc: "2.0",
        id: 2,
        method: "message/send",
        params: {
          message: {
            role: "user",
            parts: [
              {
                kind: "data",
                data: {
                  skill: "search_startups_by_sector",
                  args: { sector },
                },
              },
            ],
          },
        },
      };
    }
    if (mode === "lookup") {
      return {
        jsonrpc: "2.0",
        id: 3,
        method: "message/send",
        params: {
          message: {
            role: "user",
            parts: [
              {
                kind: "data",
                data: { skill: "get_startup_signal", args: { name } },
              },
            ],
          },
        },
      };
    }
    if (mode === "summary") {
      return {
        jsonrpc: "2.0",
        id: 4,
        method: "message/send",
        params: {
          message: {
            role: "user",
            parts: [{ kind: "data", data: { skill: "get_signals_summary" } }],
          },
        },
      };
    }
    return {
      jsonrpc: "2.0",
      id: 5,
      method: "message/send",
      params: {
        message: {
          role: "user",
          parts: [{ kind: "data", data: { skill: "get_methodology" } }],
        },
      },
    };
  }

  async function send() {
    setLoading(true);
    setResponse("");
    const body = buildBody();
    setRequestPreview(JSON.stringify(body, null, 2));
    try {
      const res = await fetch("/api/a2a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
    } catch (err) {
      setResponse(
        `Error: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 28,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {(
          [
            ["trending", "Trending"],
            ["sector", "By sector"],
            ["lookup", "Startup lookup"],
            ["summary", "Dataset summary"],
            ["methodology", "Methodology"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid",
              borderColor: mode === key ? "#0ea5e9" : "#cbd5e1",
              background: mode === key ? "#0ea5e9" : "#fff",
              color: mode === key ? "#fff" : "#475569",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "sector" ? (
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              color: "#475569",
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            Sector
          </label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              fontSize: 15,
              minWidth: 240,
              background: "#fff",
            }}
          >
            {sectorOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {mode === "lookup" ? (
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              color: "#475569",
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            Startup name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Roboflow"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              fontSize: 15,
              minWidth: 240,
              background: "#fff",
            }}
          />
        </div>
      ) : null}

      <button
        onClick={send}
        disabled={loading}
        style={{
          padding: "12px 24px",
          borderRadius: 10,
          background: loading ? "#94a3b8" : "#0f172a",
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          cursor: loading ? "wait" : "pointer",
          border: "none",
        }}
      >
        {loading ? "Calling…" : "Send to /api/a2a →"}
      </button>

      {requestPreview ? (
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 1,
              color: "#475569",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            REQUEST
          </div>
          <pre
            style={{
              background: "#0f172a",
              color: "#e2e8f0",
              padding: 16,
              borderRadius: 10,
              fontSize: 12,
              lineHeight: 1.5,
              overflowX: "auto",
              margin: 0,
              maxHeight: 220,
            }}
          >
            <code>{requestPreview}</code>
          </pre>
        </div>
      ) : null}

      {response ? (
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 1,
              color: "#475569",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            RESPONSE
          </div>
          <pre
            style={{
              background: "#0f172a",
              color: "#a7f3d0",
              padding: 16,
              borderRadius: 10,
              fontSize: 12,
              lineHeight: 1.5,
              overflowX: "auto",
              margin: 0,
              maxHeight: 480,
            }}
          >
            <code>{response}</code>
          </pre>
        </div>
      ) : null}
    </section>
  );
}
