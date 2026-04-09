"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { products as allProducts } from "@/lib/products";
import type { Product, Size } from "@/lib/products";
import { availableSizes } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/CartContext";
import { z } from "zod";
import toast from "react-hot-toast";

const orderSchema = z.object({
  name: z.string().min(3, "من فضلك اكتب الاسم الكامل"),
  phone: z
    .string()
    .regex(/^(?:\+20|0)?1[0-2,5]\d{8}$/, "من فضلك اكتب رقم موبايل مصري صحيح"),
  address: z.string().min(10, "من فضلك اكتب العنوان بالتفصيل"),
});

type FormErrors = Partial<Record<"name" | "phone" | "address", string>>;

function normalizePhoneDigits(value: string) {
  // Convert Arabic-Indic and Eastern Arabic digits to ASCII digits for validation.
  return value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
}

export default function ProductPageClient({ product }: { product: Product }) {
  const router = useRouter();
  const { items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart();

  // Current selection state
  const [selectedColor, setSelectedColor] = useState<Product>(product);
  const [selectedSize, setSelectedSize] = useState<Size>("L");
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Cart drawer open state
  const [cartOpen, setCartOpen] = useState(false);

  const handleColorChange = (p: Product) => {
    setSelectedColor(p);
  };

  const handleAddToCart = () => {
    addItem({
      slug: selectedColor.slug,
      name: selectedColor.name,
      color: selectedColor.color,
      colorCode: selectedColor.colorCode,
      image: selectedColor.image,
      size: selectedSize,
      quantity,
      price: selectedColor.priceNumber,
    });
    setAddedFeedback(true);
    setCartOpen(true);
    toast.success(`✅ اتضاف للسلة: ${selectedColor.color} - ${selectedSize}`);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const validate = () => {
    const normalizedPhone = normalizePhoneDigits(phone).replace(/\s+/g, "");
    const result = orderSchema.safeParse({ name, phone: normalizedPhone, address });
    if (!result.success) {
      const errs: FormErrors = {};
      result.error.issues.forEach((e) => {
        const f = e.path[0] as keyof FormErrors;
        if (!errs[f]) errs[f] = e.message;
      });
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("ضيف منتج للسلة الأول"); return; }
    if (!validate()) { toast.error("من فضلك صحح الأخطاء"); return; }

    setIsLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: normalizePhoneDigits(phone).replace(/\s+/g, ""), address, notes, items }),
      });
      if (!res.ok) throw new Error();
      setIsSuccess(true);
      clearCart();
      toast.success("🎉 طلبك اتسجل بنجاح!", { duration: 6000 });
    } catch {
      toast.error("حصلت مشكلة، جرّب تاني.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ────────── Success Screen ────────── */
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--cream)" }}>
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl"
            style={{ background: "var(--accent)", boxShadow: "0 0 50px rgba(74,87,56,0.35)" }}>✓</div>
          <h2 className="text-4xl font-black mb-4" style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>
            طلبك اتسجل! 🎉
          </h2>
          <p className="text-lg mb-8" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>
            فريقنا هيتواصل معاك خلال 24 ساعة عشان تأكيد الطلب والتوصيل.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => { setIsSuccess(false); setName(""); setPhone(""); setAddress(""); setNotes(""); }}
              className="btn-primary text-white font-bold py-3 px-8 rounded-2xl cursor-pointer"
              style={{ fontFamily: "Cairo, sans-serif" }}>
              اعمل طلب جديد
            </button>
            <button onClick={() => router.push("/")}
              className="font-bold py-3 px-8 rounded-2xl cursor-pointer transition-all hover:bg-[var(--sand)]"
              style={{ border: "2px solid var(--border)", color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>
              الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ────────── Main Page ────────── */
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: "rgba(253,248,239,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(226,213,191,0.5)" }}>
        <button onClick={() => router.push("/")} className="flex items-center gap-2 cursor-pointer group">
          <span className="text-xl transition-transform group-hover:-translate-x-1" style={{ color: "var(--muted)" }}>←</span>
          <span className="text-sm font-semibold" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>رجوع</span>
        </button>
        <span className="text-3xl font-black shimmer-text" style={{ fontFamily: "Cairo, sans-serif" }}>أصل</span>

        {/* Cart button */}
        <button
          onClick={() => setCartOpen(true)}
          id="cart-btn"
          className="relative flex items-center gap-2 cursor-pointer py-2 px-4 rounded-2xl transition-all hover:bg-[var(--sand-light)]"
          style={{ fontFamily: "Cairo, sans-serif" }}
        >
          <span className="text-xl">🛒</span>
          <span className="text-sm font-bold" style={{ color: "var(--charcoal)" }}>السلة</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center text-white"
              style={{ background: "var(--primary)" }}>
              {totalItems}
            </span>
          )}
        </button>
      </nav>

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />

          {/* Drawer */}
          <div className="w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden"
            style={{ animation: "slideInRight 0.3s ease" }}>
            {/* Header */}
            <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid var(--border)" }}>
              <h2 className="text-2xl font-black" style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>
                سلتك 🛒
              </h2>
              <button onClick={() => setCartOpen(false)} className="text-2xl cursor-pointer" style={{ color: "var(--muted)" }}>✕</button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-4">🛍️</p>
                  <p style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>السلة فاضية</p>
                  <button onClick={() => setCartOpen(false)}
                    className="mt-6 btn-primary text-white font-bold py-3 px-8 rounded-2xl cursor-pointer"
                    style={{ fontFamily: "Cairo, sans-serif" }}>
                    شوف المنتجات
                  </button>
                </div>
              ) : (
                items.map((item: CartItem) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{ background: "var(--sand-light)", border: "1px solid var(--border)" }}>
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{ background: `${item.colorCode}22` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-contain" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>
                        {item.color} — {item.size}
                      </p>
                      <p className="text-xs mb-2" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>
                        {item.price} ريال × {item.quantity} = <strong>{item.price * item.quantity} ريال</strong>
                      </p>
                      {/* Qty controls */}
                      <div className="flex items-center gap-0 w-fit rounded-xl overflow-hidden"
                        style={{ border: "1.5px solid var(--border)" }}>
                        <button onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQty(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-[var(--sand)]"
                          style={{ color: item.quantity === 1 ? "#c0392b" : "var(--charcoal)" }}>
                          {item.quantity === 1 ? "🗑" : "−"}
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center font-bold text-sm"
                          style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-[var(--sand)]"
                          style={{ color: "var(--charcoal)" }}
                          disabled={item.quantity >= 10}>+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with form + summary */}
            {items.length > 0 && (
              <div className="p-6 space-y-4" style={{ borderTop: "1px solid var(--border)", background: "var(--cream)" }}>
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-bold" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>
                    المجموع ({totalItems} قطعة)
                  </span>
                  <span className="text-2xl font-black" style={{ color: "var(--primary)", fontFamily: "Cairo, sans-serif" }}>
                    {totalPrice} ريال
                  </span>
                </div>

                {/* Name & Address */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input id="cart-name" type="text" placeholder="الاسم الكامل *"
                      value={name} onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                      className="form-input w-full py-3 px-4 text-sm"
                      style={{ fontFamily: "Cairo, sans-serif", color: "var(--charcoal)", borderColor: errors.name ? "#c0392b" : undefined }}
                      disabled={isLoading} />
                    {errors.name && <p className="text-xs mt-1" style={{ color: "#c0392b", fontFamily: "Cairo, sans-serif" }}>⚠ {errors.name}</p>}
                  </div>
                  <div>
                    <input id="cart-phone" type="tel" placeholder="رقم الموبايل *"
                      value={phone} onChange={(e) => { setPhone(normalizePhoneDigits(e.target.value)); setErrors(p => ({ ...p, phone: undefined })); }}
                      inputMode="numeric"
                      dir="ltr"
                      className="form-input w-full py-3 px-4 text-sm"
                      style={{ fontFamily: "Cairo, sans-serif", color: "var(--charcoal)", borderColor: errors.phone ? "#c0392b" : undefined }}
                      disabled={isLoading} />
                    {errors.phone && <p className="text-xs mt-1" style={{ color: "#c0392b", fontFamily: "Cairo, sans-serif" }}>⚠ {errors.phone}</p>}
                  </div>
                  <div>
                    <textarea id="cart-address" rows={2} placeholder="العنوان بالتفصيل *"
                      value={address} onChange={(e) => { setAddress(e.target.value); setErrors(p => ({ ...p, address: undefined })); }}
                      className="form-input w-full py-3 px-4 text-sm resize-none"
                      style={{ fontFamily: "Cairo, sans-serif", color: "var(--charcoal)", borderColor: errors.address ? "#c0392b" : undefined }}
                      disabled={isLoading} />
                    {errors.address && <p className="text-xs mt-1" style={{ color: "#c0392b", fontFamily: "Cairo, sans-serif" }}>⚠ {errors.address}</p>}
                  </div>
                  <div>
                    <textarea id="cart-notes" rows={2} placeholder="ملاحظات (اختياري)"
                      value={notes} onChange={(e) => setNotes(e.target.value)}
                      className="form-input w-full py-3 px-4 text-sm resize-none"
                      style={{ fontFamily: "Cairo, sans-serif", color: "var(--charcoal)" }}
                      disabled={isLoading} />
                  </div>
                  <button type="submit" id="cart-submit-btn" disabled={isLoading}
                    className="btn-primary w-full text-white font-black py-4 rounded-2xl text-lg cursor-pointer flex items-center justify-center gap-3 disabled:opacity-70"
                    style={{ fontFamily: "Cairo, sans-serif" }}>
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <span>أكد الطلب ✦</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Product Page Body ── */}
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* ── LEFT: Image + thumbnails ── */}
            <div className="lg:sticky lg:top-28">
              <div className="rounded-3xl overflow-hidden flex items-center justify-center aspect-square max-w-lg mx-auto mb-4"
                style={{
                  background: `linear-gradient(135deg, ${selectedColor.colorCode}20, ${selectedColor.colorCode}08)`,
                  border: `2px solid ${selectedColor.colorCode}33`,
                }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedColor.image} alt={selectedColor.name} key={selectedColor.slug}
                  className="w-4/5 h-4/5 object-contain transition-all duration-500"
                  style={{ filter: "drop-shadow(0 25px 40px rgba(0,0,0,0.15))", animation: "fadeInUp 0.4s ease-out" }} />
                {selectedColor.tag && (
                  <div className="absolute top-5 right-5 badge">{selectedColor.tag}</div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 justify-center">
                {allProducts.map((p) => (
                  <button key={p.id} onClick={() => handleColorChange(p)}
                    className="w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: selectedColor.id === p.id ? "var(--primary)" : "var(--border)",
                      background: `${p.colorCode}18`,
                      boxShadow: selectedColor.id === p.id ? "0 0 0 3px rgba(139,105,20,0.2)" : "none",
                      transform: selectedColor.id === p.id ? "scale(1.05)" : "scale(1)",
                    }}
                    aria-label={p.color}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.color} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Details + Add to cart ── */}
            <div>
              {/* Breadcrumb */}
              <p className="text-sm mb-4" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>
                الرئيسية ← المنتجات ← {selectedColor.name}
              </p>

              <h1 className="text-4xl font-black mb-2" style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>
                {selectedColor.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-black" style={{ color: "var(--primary)", fontFamily: "Cairo, sans-serif" }}>
                  {selectedColor.price}
                </span>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-500 text-lg">★</span>)}
                  <span className="text-sm mr-1" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>(٤٩ تقييم)</span>
                </div>
              </div>

              <p className="text-base mb-8" style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif", lineHeight: "2" }}>
                {selectedColor.description}
              </p>

              <ul className="mb-8 space-y-3">
                {selectedColor.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: "var(--accent)", color: "white" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <hr style={{ borderColor: "var(--border)", marginBottom: "32px" }} />

              {/* Color */}
              <div className="mb-6">
                <p className="text-sm font-bold mb-3" style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>
                  اللون: <span style={{ color: "var(--primary)" }}>{selectedColor.color}</span>
                </p>
                <div className="flex gap-3">
                  {allProducts.map((p) => (
                    <button key={p.id} type="button" onClick={() => handleColorChange(p)}
                      title={p.color} aria-label={`اختر اللون ${p.color}`}
                      className="color-swatch w-10 h-10 rounded-full cursor-pointer"
                      style={{
                        backgroundColor: p.colorCode,
                        border: `3px solid ${p.colorCode === "#F5F5F0" ? "#ccc" : p.colorCode}`,
                        boxShadow: selectedColor.id === p.id ? "0 0 0 3px white, 0 0 0 5px var(--primary)" : "0 2px 6px rgba(0,0,0,0.2)",
                        transform: selectedColor.id === p.id ? "scale(1.2)" : "scale(1)",
                        transition: "all 0.2s ease",
                      }} />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <p className="text-sm font-bold mb-3" style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>
                  المقاس: <span style={{ color: "var(--primary)" }}>{selectedSize}</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {availableSizes.map((s) => (
                    <button key={s} type="button" onClick={() => setSelectedSize(s)}
                      className="w-14 h-14 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer"
                      style={{
                        background: selectedSize === s ? "var(--charcoal)" : "white",
                        color: selectedSize === s ? "white" : "var(--charcoal)",
                        border: `2px solid ${selectedSize === s ? "var(--charcoal)" : "var(--border)"}`,
                        fontFamily: "Cairo, sans-serif",
                        transform: selectedSize === s ? "scale(1.08)" : "scale(1)",
                        boxShadow: selectedSize === s ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
                <details className="mt-3">
                  <summary className="text-sm cursor-pointer" style={{ color: "var(--primary)", fontFamily: "Cairo, sans-serif" }}>
                    دليل المقاسات ↓
                  </summary>
                  <div className="mt-3 p-4 rounded-xl text-sm" style={{ background: "rgba(139,105,20,0.07)", fontFamily: "Cairo, sans-serif", color: "var(--muted)" }}>
                    S: 90–95 سم · M: 96–102 سم · L: 103–110 سم · XL: 111–118 سم · XXL: 119–126 سم
                  </div>
                </details>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-sm font-bold mb-3" style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>الكمية</p>
                <div className="flex items-center gap-0 w-fit rounded-xl overflow-hidden" style={{ border: "2px solid var(--border)" }}>
                  <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center text-xl font-bold cursor-pointer hover:bg-[var(--sand-light)]"
                    style={{ color: "var(--charcoal)" }}>−</button>
                  <span className="w-12 h-12 flex items-center justify-center font-bold text-lg"
                    style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>{quantity}</span>
                  <button type="button" onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    className="w-12 h-12 flex items-center justify-center text-xl font-bold cursor-pointer hover:bg-[var(--sand-light)]"
                    style={{ color: "var(--charcoal)" }}>+</button>
                </div>
              </div>

              {/* Add to cart button */}
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                className="btn-primary w-full text-white font-black py-5 rounded-2xl text-xl cursor-pointer flex items-center justify-center gap-3 mb-4 transition-all"
                style={{
                  fontFamily: "Cairo, sans-serif",
                  transform: addedFeedback ? "scale(0.97)" : "scale(1)",
                }}
              >
                {addedFeedback ? (
                  <span>✅ اتضاف للسلة!</span>
                ) : (
                  <>
                    <span>🛒</span>
                    <span>ضيف للسلة</span>
                    {totalItems > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-sm font-bold"
                        style={{ background: "rgba(255,255,255,0.25)" }}>
                        {totalItems} في السلة
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* View cart shortcut */}
              {totalItems > 0 && (
                <button onClick={() => setCartOpen(true)}
                  className="w-full font-bold py-4 rounded-2xl text-lg cursor-pointer transition-all hover:bg-[var(--sand)]"
                  style={{ border: "2px solid var(--primary)", color: "var(--primary)", fontFamily: "Cairo, sans-serif" }}>
                  شوف السلة وأكد الطلب ({totalItems} قطعة — {totalPrice} ريال)
                </button>
              )}
            </div>
          </div>

          {/* ── Related Products ── */}
          <div className="mt-24">
            <h3 className="text-2xl font-black mb-8" style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>
              ألوان أخرى من المجموعة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allProducts.filter(p => p.id !== selectedColor.id).map((p) => (
                <a key={p.id} href={`/product/${p.slug}`}
                  className="product-card bg-white rounded-3xl overflow-hidden cursor-pointer shadow-sm block"
                  style={{ border: "2px solid var(--border)", textDecoration: "none" }}>
                  <div className="h-48 flex items-center justify-center p-4"
                    style={{ background: `linear-gradient(135deg, ${p.colorCode}18, ${p.colorCode}08)` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="h-40 w-full object-contain"
                      style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))" }} />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm" style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}>{p.name}</h4>
                      {p.tag && <span className="badge text-xs">{p.tag}</span>}
                    </div>
                    <p className="text-base font-black" style={{ color: "var(--primary)", fontFamily: "Cairo, sans-serif" }}>{p.price}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
