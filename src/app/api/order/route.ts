import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

// ─────────────────────────────────────────────────────────
// Required .env.local variables:
//   GOOGLE_CLIENT_EMAIL  — from your service account JSON
//   GOOGLE_PRIVATE_KEY   — from your service account JSON (keep \n chars)
//   SPREADSHEET_ID       — from the Google Sheet URL
// Optional:
//   SHEET_NAME           — defaults to Sheet1
//
// Share the sheet with GOOGLE_CLIENT_EMAIL as Editor.
// Suggested headers (Row 1):
// رقم الطلب | التوقيت | الاسم | الموبايل | العنوان | الملاحظات | اللون | المقاس | الكمية | سعر الوحدة | الإجمالي
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
    const { name, phone, address, notes, items } = body as {
      name: string;
      phone: string;
      address: string;
      notes?: string;
      items: CartItem[];
    };

    // Basic server-side validation
    if (!name || !phone || !address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "البيانات ناقصة" },
        { status: 400 }
      );
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheetName = process.env.SHEET_NAME ?? "Sheet1";

    if (!clientEmail || !privateKey || !spreadsheetId) {
      console.error("Missing Google Sheets env vars");
      return NextResponse.json(
        { success: false, message: "في مشكلة في إعدادات السيرفر" },
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
    const timestamp = new Date().toLocaleString("ar-EG", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const orderNumber = `ASL-${Date.now().toString().slice(-8)}`;

    // Build one row per cart item
    // Columns: رقم الطلب | التوقيت | الاسم | الموبايل | العنوان | الملاحظات | اللون | المقاس | الكمية | سعر الوحدة | الإجمالي
    const rows = items.map((item: CartItem) => [
      orderNumber,
      timestamp,
      name,
      phone,
      address,
      notes ?? "",
      item.color,
      item.size,
      item.quantity,
      `${item.price} ريال`,
      `${item.price * item.quantity} ريال`,
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:K`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: rows },
    });

    return NextResponse.json({ success: true, message: "الطلب اتسجل بنجاح", orderNumber });
  } catch (error) {
    console.error("Google Sheets API error:", error);
    return NextResponse.json(
      { success: false, message: "حصلت مشكلة وإحنا بنحفظ الطلب" },
      { status: 500 }
    );
  }
}
