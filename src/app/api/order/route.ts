import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

// ─────────────────────────────────────────────────────────
// HOW TO SET UP GOOGLE SHEETS INTEGRATION
// ─────────────────────────────────────────────────────────
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project (or select an existing one).
// 3. Enable the "Google Sheets API" for your project.
// 4. Go to "IAM & Admin" → "Service Accounts" → Create a new service account.
// 5. Give the service account a name, then click "Done".
// 6. Click on the service account → "Keys" tab → "Add Key" → "Create new key" → JSON.
//    This downloads a JSON file with your credentials.
// 7. From the JSON file, copy:
//    - `client_email`  → set as GOOGLE_CLIENT_EMAIL in .env.local
//    - `private_key`   → set as GOOGLE_PRIVATE_KEY in .env.local
//      (keep the \n characters; in Vercel, paste the raw multiline key)
// 8. Create a Google Sheet at https://sheets.google.com
//    - Copy the Sheet ID from the URL:
//      https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
//    - Set it as SPREADSHEET_ID in .env.local
// 9. Share the Google Sheet with the service account email (as Editor).
//
// Your .env.local should look like:
// ─────────────────────────────────────────────────────────
// GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
// GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
// SPREADSHEET_ID=1abcDEFghiJKLmno12345
// ─────────────────────────────────────────────────────────

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, size, color } = body;

    // Basic server-side validation
    if (!name || !address || !size || !color) {
      return NextResponse.json(
        { success: false, message: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // ── Check required environment variables ──────────────
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.SPREADSHEET_ID;

    if (!clientEmail || !privateKey || !spreadsheetId) {
      console.error(
        "Missing env vars: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, or SPREADSHEET_ID"
      );
      return NextResponse.json(
        {
          success: false,
          message:
            "خطأ في إعداد الخادم. الرجاء التواصل مع المسؤول.",
        },
        { status: 500 }
      );
    }

    // ── Authenticate with Google ──────────────────────────
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        // Replace literal "\n" strings with actual newlines (common with env vars)
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // ── Build the row to append ───────────────────────────
    const timestamp = new Date().toLocaleString("ar-SA", {
      timeZone: "Asia/Riyadh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const row = [timestamp, name, address, size, color];

    // ── Append the row to the sheet ───────────────────────
    // Make sure your Google Sheet has these headers in Row 1:
    // | التوقيت | الاسم | العنوان | المقاس | اللون |
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      // The named range or sheet + column range to append to.
      // "Sheet1!A:E" means Sheet1 columns A through E.
      range: "Sheet1!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
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
