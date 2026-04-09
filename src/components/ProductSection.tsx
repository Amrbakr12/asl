"use client";

import Link from "next/link";
import { products } from "@/lib/products";

export default function ProductSection() {
  return (
    <section id="products" className="py-24 px-6" style={{ background: "var(--sand-light)" }}>
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="badge">مجموعتنا</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}
          >
            اختار لونك،
            <br />
            <span className="gradient-text">وعبّر عن ستايلك</span>
          </h2>
          <div className="section-divider mx-auto mt-6" />
          <p className="mt-6 text-base" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>
            دوس على أي منتج عشان تشوف التفاصيل وتكمل طلبك
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              id={`product-card-${p.slug}`}
              className="product-card bg-white rounded-3xl overflow-hidden shadow-sm block group"
              style={{
                border: "2px solid var(--border)",
                textDecoration: "none",
              }}
            >
              {/* Image area */}
              <div
                className="relative h-64 flex items-center justify-center p-6 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${p.colorCode}18, ${p.colorCode}0a)`,
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${p.colorCode}22, transparent 70%)`,
                  }}
                />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-48 w-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.12))" }}
                />

                {/* Tag badge */}
                {p.tag && (
                  <div className="absolute top-4 right-4 badge z-10">{p.tag}</div>
                )}

                {/* "View" overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                  style={{ background: "rgba(0,0,0,0.04)" }}>
                  <span
                    className="px-6 py-2 rounded-full text-sm font-bold translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
                    style={{
                      background: "var(--charcoal)",
                      color: "white",
                      fontFamily: "Cairo, sans-serif",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                    }}
                  >
                    شوف التفاصيل ←
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3
                    className="font-black text-base leading-snug"
                    style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif", maxWidth: "65%" }}
                  >
                    {p.name}
                  </h3>
                  {p.tag && <span className="badge text-xs">{p.tag}</span>}
                </div>

                {/* Color swatch preview */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-5 h-5 rounded-full border-2"
                    style={{
                      backgroundColor: p.colorCode,
                      borderColor: p.colorCode === "#F5F5F0" ? "#ccc" : p.colorCode,
                    }}
                  />
                  <span className="text-xs" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>
                    {p.color}
                  </span>
                </div>

                {/* Price + CTA row */}
                <div className="flex items-center justify-between">
                  <p
                    className="text-xl font-black"
                    style={{ color: "var(--primary)", fontFamily: "Cairo, sans-serif" }}
                  >
                    {p.price}
                  </p>
                  <span
                    className="text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 group-hover:bg-[var(--charcoal)] group-hover:text-white"
                    style={{
                      border: "1.5px solid var(--border)",
                      color: "var(--charcoal)",
                      fontFamily: "Cairo, sans-serif",
                    }}
                  >
                    اطلب دلوقتي
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
