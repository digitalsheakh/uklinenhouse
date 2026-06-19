import nodemailer from "nodemailer";
import { getEmailConfig } from "@/lib/settings";
import { siteConfig } from "@/config/site";

export interface OrderEmailData {
  orderNumber: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
}

const money = (n: number) => `${siteConfig.currencySymbol}${n.toFixed(2)}`;

/** Build a transporter from the configured SMTP settings, or null if unset. */
async function getTransport() {
  const cfg = await getEmailConfig();
  if (!cfg.enabled || !cfg.host || !cfg.user || !cfg.pass) return null;
  const transport = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465, // 465 = implicit TLS, otherwise STARTTLS
    auth: { user: cfg.user, pass: cfg.pass },
  });
  return { transport, cfg };
}

function itemRows(items: OrderEmailData["items"]) {
  return items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;color:#1a1a1a">${escapeHtml(i.name)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;color:#71717a;text-align:center">×${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;color:#1a1a1a;text-align:right">${money(i.price * i.quantity)}</td>
      </tr>`
    )
    .join("");
}

function orderHtml(order: OrderEmailData, heading: string, intro: string) {
  const c = order.customer;
  const vat = order.subtotal * siteConfig.vatRate;
  const shipping = siteConfig.shippingFee;
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
    <h1 style="font-size:20px;margin:0 0 4px">${heading}</h1>
    <p style="color:#52525b;font-size:14px;margin:0 0 16px">${intro}</p>
    <p style="font-size:14px;margin:0 0 16px">
      <strong>Order ${escapeHtml(order.orderNumber)}</strong>
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead>
        <tr>
          <th style="text-align:left;padding:6px 0;border-bottom:2px solid #1a1a1a;font-size:12px;color:#71717a">Item</th>
          <th style="text-align:center;padding:6px 0;border-bottom:2px solid #1a1a1a;font-size:12px;color:#71717a">Qty</th>
          <th style="text-align:right;padding:6px 0;border-bottom:2px solid #1a1a1a;font-size:12px;color:#71717a">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows(order.items)}</tbody>
    </table>
    <table style="width:100%;font-size:14px;margin-top:12px">
      <tr><td style="color:#71717a;padding:2px 0">Subtotal (ex VAT)</td><td style="text-align:right">${money(order.subtotal)}</td></tr>
      <tr><td style="color:#71717a;padding:2px 0">VAT (${Math.round(siteConfig.vatRate * 100)}%)</td><td style="text-align:right">${money(vat)}</td></tr>
      <tr><td style="color:#71717a;padding:2px 0">Shipping &amp; handling</td><td style="text-align:right">${money(shipping)}</td></tr>
      <tr><td style="font-weight:bold;padding-top:8px;border-top:1px solid #eee">Total</td><td style="text-align:right;font-weight:bold;padding-top:8px;border-top:1px solid #eee">${money(order.total)}</td></tr>
    </table>
    <h2 style="font-size:15px;margin:24px 0 6px">Delivery details</h2>
    <p style="font-size:14px;color:#52525b;line-height:1.6;margin:0">
      ${escapeHtml(c.name)}<br/>
      ${c.address ? escapeHtml(c.address) + "<br/>" : ""}
      ${c.city ? escapeHtml(c.city) + ", " : ""}${escapeHtml(c.postcode || "")}<br/>
      ${escapeHtml(c.country || "")}<br/>
      ${c.phone ? "Tel: " + escapeHtml(c.phone) + "<br/>" : ""}
      ${escapeHtml(c.email)}
    </p>
    <p style="font-size:12px;color:#a1a1aa;margin-top:24px">${siteConfig.name}</p>
  </div>`;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Send order emails: a notification to the store owner and a confirmation to
 * the customer. Never throws — email problems must not break the order flow.
 * Returns true if at least one email was sent.
 */
export async function sendNewOrderEmails(order: OrderEmailData): Promise<boolean> {
  try {
    const t = await getTransport();
    if (!t) return false;
    const { transport, cfg } = t;
    const from = cfg.from || cfg.user;

    const jobs: Promise<unknown>[] = [];

    // 1) Notify the store owner.
    if (cfg.notifyEmail) {
      jobs.push(
        transport.sendMail({
          from,
          to: cfg.notifyEmail,
          replyTo: order.customer.email,
          subject: `New order ${order.orderNumber} — ${money(order.total)}`,
          html: orderHtml(
            order,
            `New order received: ${order.orderNumber}`,
            `A new order has been placed by ${order.customer.name}.`
          ),
        })
      );
    }

    // 2) Confirm to the customer.
    if (order.customer.email) {
      jobs.push(
        transport.sendMail({
          from,
          to: order.customer.email,
          subject: `Your ${siteConfig.name} order ${order.orderNumber}`,
          html: orderHtml(
            order,
            "Thank you for your order",
            `Hi ${order.customer.name.split(" ")[0] || "there"}, we've received your order and it's now being processed.`
          ),
        })
      );
    }

    const results = await Promise.allSettled(jobs);
    return results.some((r) => r.status === "fulfilled");
  } catch (err) {
    console.error("[email] failed to send order emails", err);
    return false;
  }
}
