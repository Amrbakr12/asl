"use client";

import { useEffect, useRef, useState } from "react";

interface HeroSectionProps {
  onOrderClick: () => void;
}

export default function HeroSection({ onOrderClick }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-pattern arabic-pattern relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Decorative circles */}
      <div
        className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--primary-light), transparent)" }}
      />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--accent), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="badge">مجموعة 2025</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6" style={{ fontFamily: "Cairo, sans-serif", lineHeight: "1.1" }}>
              <span style={{ color: "var(--charcoal)" }}>ارتدِ</span>
              <br />
              <span className="shimmer-text">الأصالة</span>
              <br />
              <span style={{ color: "var(--charcoal)" }}>بثقة</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-xl md:text-2xl leading-relaxed mb-10 max-w-lg transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}
            >
              تيشيرتات شيك بطابع عربي أصيل.
              <br />
              <strong style={{ color: "var(--charcoal)" }}>خامة ممتازة. شكل يفضل معاك.</strong>
            </p>

            {/* Stats */}
            <div
              className={`flex gap-8 mb-12 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              {[
                { num: "+500", label: "عميل مبسوط" },
                { num: "5★", label: "تقييم الناس" },
                { num: "100%", label: "قطن طبيعي" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black" style={{ color: "var(--primary)", fontFamily: "Cairo, sans-serif" }}>
                    {stat.num}
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <button
                onClick={onOrderClick}
                id="hero-order-btn"
                className="btn-primary pulse-glow text-white font-bold py-4 px-10 rounded-2xl text-lg cursor-pointer flex items-center justify-center gap-3"
                style={{ fontFamily: "Cairo, sans-serif" }}
              >
                <span>اطلب دلوقتي</span>
                <span className="text-xl">→</span>
              </button>
              <a
                href="#products"
                className="flex items-center justify-center gap-2 font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:bg-[var(--sand)] cursor-pointer"
                style={{ color: "var(--charcoal)", border: "2px solid var(--border)", fontFamily: "Cairo, sans-serif" }}
              >
                اعرف أكتر
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div
            className={`relative flex justify-center items-center transition-all duration-1200 delay-200 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            {/* Background circle decoration */}
            <div
              className="absolute w-80 h-80 md:w-96 md:h-96 rounded-full"
              style={{
                background: "linear-gradient(135deg, var(--sand) 0%, var(--sand-light) 100%)",
                boxShadow: "inset 0 0 60px rgba(139, 105, 20, 0.15)",
              }}
            />

            {/* Floating product image */}
            <div className="animate-float relative z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tshirt-white.png"
                alt="تيشيرت أصل الفاخر"
                className="w-72 md:w-80 lg:w-96 object-contain drop-shadow-2xl"
                style={{ filter: "drop-shadow(0 30px 40px rgba(28,26,23,0.2))" }}
              />
            </div>

            {/* Floating badges */}
            <div
              className="absolute top-8 right-0 glass-card px-4 py-3 rounded-2xl shadow-xl"
              style={{ animation: "fadeInUp 0.8s ease-out 0.8s forwards", opacity: 0 }}
            >
              <p className="text-xs font-bold" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>الخامة</p>
              <p className="text-sm font-black" style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>قطن مصري 100%</p>
            </div>

            <div
              className="absolute bottom-16 left-0 glass-card px-4 py-3 rounded-2xl shadow-xl"
              style={{ animation: "fadeInUp 0.8s ease-out 1s forwards", opacity: 0 }}
            >
              <p className="text-xs font-bold" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>السعر</p>
              <p className="text-lg font-black shimmer-text" style={{ fontFamily: "Cairo, sans-serif" }}>١٩٩ ريال</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>انزل لتحت</span>
        <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, var(--muted), transparent)" }} />
      </div>
    </section>
  );
}
