import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { getEmailConfig } from "@/lib/settings";
import { siteConfig } from "@/config/site";

const schema = z.object({
  firstName:   z.string().min(1, "First name is required").max(80),
  lastName:    z.string().min(1, "Last name is required").max(80),
  companyName: z.string().min(1, "Company name is required").max(120),
  jobTitle:    z.string().max(80).optional().default(""),
  email:       z.string().email("Enter a valid email"),
  phone:       z.string().max(40).optional().default(""),
  address:     z.string().max(200).optional().default(""),
  city:        z.string().max(100).optional().default(""),
  postcode:    z.string().max(20).optional().default(""),
  message:     z.string().max(1000).optional().default(""),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const d = parsed.data;
    const fullName = `${d.firstName} ${d.lastName}`;

    // Try to send email — best effort, never block the response.
    try {
      const cfg = await getEmailConfig();
      if (cfg) {
        const transport = nodemailer.createTransport({
          host: cfg.host, port: cfg.port, secure: cfg.port === 465,
          auth: { user: cfg.user, pass: cfg.pass },
        });
        const from = cfg.from || cfg.user;

        const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
  <div style="background:#434f5a;padding:24px;border-radius:8px 8px 0 0">
    <h2 style="color:#fff;margin:0;font-size:18px">📄 New Brochure Request</h2>
    <p style="color:#fff;opacity:.75;margin:4px 0 0;font-size:13px">${siteConfig.name}</p>
  </div>
  <div style="border:1px solid #e4e4e7;border-top:none;padding:24px;border-radius:0 0 8px 8px">
    <table style="width:100%;font-size:14px;border-collapse:collapse">
      <tr><td style="padding:6px 0;color:#71717a;width:140px">Name</td><td style="padding:6px 0;font-weight:600">${fullName}</td></tr>
      <tr><td style="padding:6px 0;color:#71717a">Company</td><td style="padding:6px 0;font-weight:600">${d.companyName}</td></tr>
      ${d.jobTitle ? `<tr><td style="padding:6px 0;color:#71717a">Job title</td><td style="padding:6px 0">${d.jobTitle}</td></tr>` : ""}
      <tr><td style="padding:6px 0;color:#71717a">Email</td><td style="padding:6px 0"><a href="mailto:${d.email}">${d.email}</a></td></tr>
      ${d.phone ? `<tr><td style="padding:6px 0;color:#71717a">Phone</td><td style="padding:6px 0">${d.phone}</td></tr>` : ""}
      ${d.address || d.city || d.postcode ? `<tr><td style="padding:6px 0;color:#71717a">Address</td><td style="padding:6px 0">${[d.address,d.city,d.postcode].filter(Boolean).join(", ")}</td></tr>` : ""}
      ${d.message ? `<tr><td style="padding:6px 0;color:#71717a;vertical-align:top">Message</td><td style="padding:6px 0">${d.message}</td></tr>` : ""}
    </table>
    <p style="margin-top:20px;font-size:12px;color:#a1a1aa">${siteConfig.name} · brochure request received</p>
  </div>
</div>`;

        // Notify store owner
        await transport.sendMail({
          from, to: cfg.notifyEmail,
          subject: `Brochure request — ${fullName} (${d.companyName})`,
          html,
        });

        // Auto-reply to requester
        await transport.sendMail({
          from, to: d.email,
          subject: `Your brochure request — ${siteConfig.name}`,
          html: `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
  <div style="background:#434f5a;padding:24px;border-radius:8px 8px 0 0">
    <h2 style="color:#fff;margin:0;font-size:18px">Thank you, ${d.firstName}!</h2>
    <p style="color:#fff;opacity:.75;margin:4px 0 0;font-size:13px">${siteConfig.name}</p>
  </div>
  <div style="border:1px solid #e4e4e7;border-top:none;padding:24px;border-radius:0 0 8px 8px">
    <p style="font-size:15px">We have received your brochure request and will send your copy to <strong>${d.email}</strong> shortly.</p>
    <p style="font-size:14px;color:#52525b">In the meantime, you can browse our range online or get in touch if you have any questions.</p>
    <a href="${siteConfig.topBar?.message ? "https://uklinenhouse.co.uk" : "https://uklinenhouse.co.uk"}/shop"
       style="display:inline-block;margin-top:16px;background:#434f5a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600">
      Browse our products
    </a>
    <p style="margin-top:24px;font-size:12px;color:#a1a1aa">${siteConfig.name} · ${siteConfig.email} · ${siteConfig.phone}</p>
  </div>
</div>`,
        });
      }
    } catch (emailErr) {
      console.error("[brochure-request] email error", emailErr);
      // Don't fail the request just because email failed
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
