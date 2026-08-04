import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, github, website, sector, stage, email } = data;
    
    if (!name || !github || !sector) {
      return NextResponse.json({ error: "name, github, and sector are required" }, { status: 400 });
    }
    
    // Save to a simple KV or log for review
    // For now: log to stdout (visible in Vercel logs) + send email notification
    console.log("NEW STARTUP SUBMISSION:", JSON.stringify({ name, github, website, sector, stage, email, timestamp: new Date().toISOString() }));
    
    // Notify via Resend if email and key available
    if (process.env.RESEND_API_KEY && email) {
      const notifyData = {
        from: "signals@gitdealflow.com",
        to: "signals@gitdealflow.com",
        subject: `New Startup Submission: ${name}`,
        text: `Startup: ${name}\nGitHub: ${github}\nWebsite: ${website || "N/A"}\nSector: ${sector}\nStage: ${stage || "N/A"}\nContact: ${email || "N/A"}`
      };
      
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(notifyData)
      });
    }
    
    return NextResponse.json({ success: true, message: "Submitted! We'll review your startup within 1–2 business days." });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Submission failed" }, { status: 500 });
  }
}
