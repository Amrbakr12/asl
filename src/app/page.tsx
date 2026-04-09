"use client";

import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";

export default function Home() {
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav
        className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{
          background: "rgba(253, 248, 239, 0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(226, 213, 191, 0.5)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-3xl font-black shimmer-text"
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            أصل
          </span>
        </div>
        <button
          onClick={scrollToProducts}
          id="nav-order-btn"
          className="btn-primary text-white font-bold py-2 px-6 rounded-full text-sm cursor-pointer"
          style={{ fontFamily: "Cairo, sans-serif" }}
        >
          اطلب الآن
        </button>
      </nav>

      {/* Hero Section */}
      <HeroSection onOrderClick={scrollToProducts} />

      {/* Products Section */}
      <div ref={productsRef}>
        <ProductSection />
      </div>

      {/* Features / Why Us */}
      <WhyUsSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}

function WhyUsSection() {
  const features = [
    {
      icon: "✦",
      title: "قطن فاخر 100%",
      desc: "نستخدم أجود أنواع القطن المصري لضمان الراحة الكاملة طوال اليوم.",
    },
    {
      icon: "◈",
      title: "تصميم أصيل",
      desc: "كل قطعة تحمل هوية عربية عميقة مستوحاة من الثقافة الأصيلة.",
    },
    {
      icon: "◉",
      title: "توصيل سريع",
      desc: "نوصل طلبك لباب بيتك خلال 3-5 أيام عمل في جميع أنحاء المملكة.",
    },
    {
      icon: "◎",
      title: "جودة مضمونة",
      desc: "إذا لم تكن راضياً عن المنتج، نضمن لك استرداد كامل لمدة 14 يوم.",
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: "var(--charcoal)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="badge">لماذا أصل؟</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>
            الجودة ليست خياراً،
            <br />
            <span className="shimmer-text">هي معيارنا</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-8 rounded-2xl transition-all duration-400 cursor-default"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(139, 105, 20, 0.12)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(139, 105, 20, 0.4)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div className="text-3xl mb-4" style={{ color: "var(--primary-light)" }}>{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "Cairo, sans-serif" }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "Cairo, sans-serif" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
