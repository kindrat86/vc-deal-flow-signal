import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/verify-token";
import { isValidEmail } from "@/lib/validation";
import { SOAP_OPERA_EMAILS } from "@/lib/emails";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signal@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const REPORT_URL = process.env.REPORT_URL || "https://gitdealflow.com/report";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const token = url.searchParams.get("token") || "";

  // Validate
  if (!email || !isValidEmail(email) || !token) {
    return redirectWithError("Invalid verification link.");
  }

  if (!verifyToken(email, token)) {
    return redirectWithError("This verification link is invalid or expired.");
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.redirect(REPORT_URL);
  }

  // 1. Add verified contact to Resend audience
  try {
    const audienceRes = await fetch("https://api.resend.com/audiences", {
      method: "GET",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    if (audienceRes.ok) {
      const audiences = await audienceRes.json();
      let audienceId = audiences.data?.[0]?.id;

      if (!audienceId) {
        const createRes = await fetch("https://api.resend.com/audiences", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: "VC Deal Flow Signal" }),
        });
        const created = await createRes.json();
        audienceId = created.id;
      }

      await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            unsubscribed: false,
          }),
        },
      );
    }
  } catch (err) {
    console.error("Failed to add contact to audience:", err);
  }

  // 2. Schedule Soap Opera emails
  const now = Date.now();
  for (const soapEmail of SOAP_OPERA_EMAILS) {
    const sendAt = new Date(now + soapEmail.delayMs).toISOString();
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: email,
          subject: soapEmail.subject,
          html: soapEmail.html,
          scheduled_at: sendAt,
          headers: {
            "List-Unsubscribe": `<mailto:${FROM_EMAIL}?subject=unsubscribe>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error(
          `Failed to schedule "${soapEmail.subject}" for ${email}:`,
          errText,
        );
      }
    } catch (err) {
      console.error(
        `Error scheduling "${soapEmail.subject}" for ${email}:`,
        err,
      );
    }
  }

  // 3. Redirect to the report page
  return NextResponse.redirect(REPORT_URL);
}

function redirectWithError(message: string) {
  const errorPage = `https://gitdealflow.com/#signup`;
  return NextResponse.redirect(errorPage);
}
