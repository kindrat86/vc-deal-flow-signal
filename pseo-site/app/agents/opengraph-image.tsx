import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal, Agent Surfaces";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0f172a",
          color: "#f1f5f9",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: "#0ea5e9",
              fontWeight: 600,
            }}
          >
            VC Deal Flow Signal
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 14,
              color: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              borderRadius: "999px",
              padding: "6px 14px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            FOR AGENTS · FREE · NO AUTH
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          Every way to reach VC Deal Flow Signal programmatically
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#94a3b8",
            lineHeight: 1.45,
            marginBottom: "30px",
            maxWidth: "1080px",
          }}
        >
          MCP · A2A · NLWeb · OpenAPI · function-calling · JSONL · embeddable badges · ChatGPT plugin · RFC 9727 api-catalog
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {[
            "Claude Desktop",
            "Cursor",
            "Windsurf",
            "Zed",
            "Cline",
            "Continue.dev",
            "OpenAI Agents SDK",
            "LangChain",
            "LlamaIndex",
            "Hugging Face",
          ].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                fontSize: 16,
                color: "#cbd5e1",
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "8px 14px",
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>
            signals.gitdealflow.com/agents
          </div>
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>
            npx -y @gitdealflow/mcp-signal
          </div>
        </div>
      </div>
    ),
    size,
  );
}
