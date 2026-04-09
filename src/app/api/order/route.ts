import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

// ─────────────────────────────────────────────────────────
// Required .env.local variables:
//   GOOGLE_CLIENT_EMAIL  — from your service account JSON
//   GOOGLE_PRIVATE_KEY   — from your service account JSON (keep \n chars)
//   SPREADSHEET_ID       — from the Google Sheet URL
//
// Share the sheet with GOOGLE_CLIENT_EMAIL as Editor.
// Sheet1 headers (Row 1): التوقيت | الاسم | العنوان | اللون | المقاس | الكمية | السعر
// ─────────────────────────────────────────────────────────

type CartItem = {
  color: string;
  size: string;
  quantity: number;
  price: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, items } = body as {
      name: string;
      address: string;
      items: CartItem[];
    };

    // Basic server-side validation
    if (!name || !address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "البيانات ناقصة" },
        { status: 400 }
      );
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.SPREADSHEET_ID;

    if (!clientEmail || !privateKey || !spreadsheetId) {
      console.error("Missing Google Sheets env vars");
      return NextResponse.json(
        { success: false, message: "خطأ في إعداد الخادم" },
        { status: 500 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Timestamp shared across all rows in this order
    const timestamp = new Date().toLocaleString("ar-SA", {
      timeZone: "Asia/Riyadh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Build one row per cart item
    // Columns: التوقيت | الاسم | العنوان | اللون | المقاس | الكمية | السعر
    const rows = items.map((item: CartItem) => [
      timestamp,
      name,
      address,
      item.color,
      item.size,
      item.quantity,
      `${item.price * item.quantity} ريال`,
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: rows },
    });

    return NextResponse.json({ success: true, message: "تم تسجيل الطلب بنجاح" });
  } catch (error) {
    console.error("Google Sheets API error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء حفظ الطلب" },
      { status: 500 }
    );
  }
}
