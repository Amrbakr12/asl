"use client";

import { useState } from "react";

const products = [
  {
    id: 1,
    name: "تيشيرت أصل الكلاسيكي – أبيض",
    color: "أبيض",
    colorCode: "#F5F5F0",
    image: "/tshirt-white.png",
    price: "١٩٩ ريال",
    tag: "الأكثر مبيعاً",
  },
  {
    id: 2,
    name: "تيشيرت أصل الكلاسيكي – أسود",
    color: "أسود",
    colorCode: "#2C2A26",
    image: "/tshirt-black.png",
    price: "١٩٩ ريال",
    tag: "جديد",
  },
  {
    id: 3,
    name: "تيشيرت أصل الكلاسيكي – زيتوني",
    color: "زيتوني",
    colorCode: "#4A5738",
    image: "/tshirt-olive.png",
    price: "١٩٩ ريال",
    tag: "محدود",
  },
];

const availableSizes = ["S", "M", "L", "XL", "XXL"];

export default function ProductSection() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [activeSize, setActiveSize] = useState("L");

  const product = products[activeProduct];

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
            اختر لونك،
            <br />
            <span className="gradient-text">عبّر عن أصلك</span>
          </h2>
          <div className="section-divider mx-auto mt-6" />
        </div>

        {/* Main Product Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="relative flex justify-center">
            <div
              className="w-72 h-72 md:w-96 md:h-96 rounded-3xl flex items-center justify-center transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, ${product.colorCode}22, ${product.colorCode}11)`,
                border: `2px solid ${product.colorCode}44`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-64 h-64 md:w-80 md:h-80 object-contain transition-all duration-700"
                style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.15))" }}
              />
            </div>
            {product.tag && (
              <div className="absolute top-4 right-4 badge">{product.tag}</div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h3
              className="text-3xl font-black mb-2"
              style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}
            >
              {product.name}
            </h3>
            <p
              className="text-2xl font-bold mb-8"
              style={{ color: "var(--primary)", fontFamily: "Cairo, sans-serif" }}
            >
              {product.price}
            </p>

            {/* Color Selector */}
            <div className="mb-8">
              <p
                className="text-sm font-bold mb-4 uppercase tracking-wider"
                style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}
              >
                اللون: <span style={{ color: "var(--charcoal)" }}>{product.color}</span>
              </p>
              <div className="flex gap-4">
                {products.map((p, i) => (
                  <button
                    key={p.id}
                    id={`color-swatch-${p.id}`}
                    onClick={() => setActiveProduct(i)}
                    className={`color-swatch w-10 h-10 rounded-full border-3 transition-all duration-200 cursor-pointer ${activeProduct === i ? "active" : ""}`}
                    style={{
                      backgroundColor: p.colorCode,
                      border: `3px solid ${p.colorCode === "#F5F5F0" ? "#ccc" : p.colorCode}`,
                      boxShadow:
                        activeProduct === i
                          ? `0 0 0 3px white, 0 0 0 5px var(--primary)`
                          : "0 2px 8px rgba(0,0,0,0.15)",
                      transform: activeProduct === i ? "scale(1.15)" : "scale(1)",
                    }}
                    title={p.color}
                    aria-label={`اختر اللون ${p.color}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <p
                className="text-sm font-bold mb-4 uppercase tracking-wider"
                style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}
              >
                المقاس: <span style={{ color: "var(--charcoal)" }}>{activeSize}</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    id={`size-btn-${size}`}
                    onClick={() => setActiveSize(size)}
                    className="w-14 h-14 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer"
                    style={{
                      background: activeSize === size ? "var(--charcoal)" : "white",
                      color: activeSize === size ? "white" : "var(--charcoal)",
                      border: `2px solid ${activeSize === size ? "var(--charcoal)" : "var(--border)"}`,
                      fontFamily: "Cairo, sans-serif",
                      transform: activeSize === size ? "scale(1.05)" : "scale(1)",
                      boxShadow: activeSize === size ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Guide */}
            <div
              className="p-4 rounded-xl text-sm leading-relaxed"
              style={{ background: "rgba(139, 105, 20, 0.08)", border: "1px solid rgba(139, 105, 20, 0.2)", fontFamily: "Cairo, sans-serif", color: "var(--muted)" }}
            >
              <strong style={{ color: "var(--primary)" }}>دليل المقاسات:</strong> S للصدر 90-95 سم، M للصدر 96-102 سم، L للصدر 103-110 سم، XL للصدر 111-118 سم، XXL للصدر 119-126 سم.
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <div
              key={p.id}
              className="product-card bg-white rounded-3xl overflow-hidden cursor-pointer shadow-sm"
              style={{
                border: `2px solid ${activeProduct === i ? "var(--primary)" : "var(--border)"}`,
              }}
              onClick={() => setActiveProduct(i)}
            >
              <div
                className="h-56 flex items-center justify-center p-6"
                style={{ background: `linear-gradient(135deg, ${p.colorCode}18, ${p.colorCode}0a)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-44 w-full object-contain"
                  style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))" }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm leading-snug" style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif", maxWidth: "70%" }}>
                    {p.name}
                  </h4>
                  {p.tag && <span className="badge text-xs">{p.tag}</span>}
                </div>
                <p className="text-lg font-black" style={{ color: "var(--primary)", fontFamily: "Cairo, sans-serif" }}>
                  {p.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
