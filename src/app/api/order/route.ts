import { NextResponse } from "next/server";
import { sendOrderToSheets } from "@/lib/sheets";
import { orderSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Проверьте поля формы", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ ok: false, error: "Spam rejected" }, { status: 400 });
    }

    const result = await sendOrderToSheets(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Google Sheets сейчас недоступен. Попробуйте позже." },
      { status: 502 }
    );
  }
}
