import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://asl.vercel.app"),
  title: "أصل | تيشيرتات أصيلة للرجال",
  description:
    "اكتشف مجموعة أصل من التيشيرتات الفاخرة ذات الهوية العربية الأصيلة. جودة عالية، تصميم راقٍ، وأناقة حقيقية.",
  keywords: "تيشيرت, أصل, ملابس رجالية, موضة عربية, قميص",
  openGraph: {
    title: "أصل | تيشيرتات أصيلة للرجال",
    description: "مجموعة تيشيرتات فاخرة بهوية عربية أصيلة",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <CartProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: "Cairo, sans-serif",
                direction: "rtl",
                borderRadius: "12px",
                padding: "14px 20px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              },
              success: {
                style: {
                  background: "#4A5738",
                  color: "white",
                },
                iconTheme: {
                  primary: "white",
                  secondary: "#4A5738",
                },
              },
              error: {
                style: {
                  background: "#7B2D2D",
                  color: "white",
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
