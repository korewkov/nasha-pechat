import type { OrderFormValues } from "@/lib/validation";

export async function sendOrderToSheets(order: OrderFormValues) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      ok: true,
      mocked: true,
      message: "GOOGLE_SHEETS_WEBHOOK_URL is empty. Order accepted in mock mode."
    };
  }

  const row = {
    createdAt: new Date().toISOString(),
    name: order.name,
    phone: order.phone,
    messenger: order.messenger,
    service: order.service,
    format: order.format,
    quantity: order.quantity,
    paper: order.paper,
    extras: order.extras.join(", "),
    hasDesign: order.hasDesign,
    urgency: order.urgency,
    estimatedPrice: order.estimatedPrice,
    promoCode: order.promoCode,
    comment: [order.description, order.comment].filter(Boolean).join("\n\n"),
    source: process.env.NEXT_PUBLIC_SITE_URL ?? "landing",
    status: "Новая заявка"
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row)
  });

  if (!response.ok) {
    throw new Error(`Google Sheets webhook failed with ${response.status}`);
  }

  return { ok: true, mocked: false };
}
