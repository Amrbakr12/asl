"use client";

import { useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";

// Zod schema for form validation
const orderSchema = z.object({
  name: z.string().min(3, "الرجاء إدخال الاسم الكامل (3 أحرف على الأقل)"),
  address: z.string().min(10, "الرجاء إدخال العنوان بالتفصيل (10 أحرف على الأقل)"),
  size: z.enum(["S", "M", "L", "XL", "XXL"], { message: "الرجاء اختيار المقاس" }),
  color: z.enum(["أبيض", "أسود", "زيتوني"], { message: "الرجاء اختيار اللون" }),
});

type OrderFormData = z.infer<typeof orderSchema>;

type FormErrors = Partial<Record<keyof OrderFormData, string>>;

const colorOptions = [
  { label: "أبيض", value: "أبيض", hex: "#F5F5F0", border: "#ccc" },
  { label: "أسود", value: "أسود", hex: "#2C2A26", border: "#2C2A26" },
  { label: "زيتوني", value: "زيتوني", hex: "#4A5738", border: "#4A5738" },
];

const sizeOptions = ["S", "M", "L", "XL", "XXL"];

export default function OrderForm() {
  const [formData, setFormData] = useState<Partial<OrderFormData>>({
    size: "L",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const result = orderSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof OrderFormData;
        if (field && !newErrors[field]) {
          newErrors[field] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("الرجاء تصحيح الأخطاء في النموذج");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "فشل إرسال الطلب");
      }

      setIsSuccess(true);
      toast.success("🎉 تم تسجيل طلبك بنجاح! سنتواصل معك قريباً.", { duration: 6000 });
      setFormData({ size: "L" });
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="py-24 px-6" style={{ background: "var(--cream)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8"
            style={{ background: "var(--accent)", boxShadow: "0 0 40px rgba(74, 87, 56, 0.3)" }}
          >
            <span className="text-4xl">✓</span>
          </div>
          <h2
            className="text-4xl font-black mb-4"
            style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}
          >
            تم تسجيل طلبك بنجاح! 🎉
          </h2>
          <p
            className="text-lg mb-8"
            style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}
          >
            شكراً على ثقتك بنا. سيتواصل معك فريقنا خلال 24 ساعة لتأكيد الطلب والتوصيل.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="btn-primary text-white font-bold py-3 px-10 rounded-2xl cursor-pointer"
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            تقديم طلب آخر
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6" style={{ background: "var(--cream)" }}>
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="badge">الطلب</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}
          >
            أكمل طلبك الآن
          </h2>
          <p style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}>
            أملأ النموذج أدناه وسنتواصل معك لتأكيد الطلب
          </p>
          <div className="section-divider mx-auto mt-6" />
        </div>

        {/* Form Card */}
        <div
          className="rounded-3xl p-8 md:p-12 shadow-2xl"
          style={{
            background: "white",
            border: "1px solid var(--border)",
            boxShadow: "0 30px 80px rgba(28,26,23,0.08)",
          }}
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-8" id="order-form">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold mb-3"
                style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}
              >
                الاسم الكامل <span style={{ color: "#c0392b" }}>*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="مثال: عبدالله محمد الأحمد"
                value={formData.name ?? ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="form-input w-full py-4 px-5 text-base"
                style={{
                  fontFamily: "Cairo, sans-serif",
                  color: "var(--charcoal)",
                  borderColor: errors.name ? "#c0392b" : undefined,
                }}
                disabled={isLoading}
              />
              {errors.name && (
                <p
                  className="mt-2 text-sm"
                  style={{ color: "#c0392b", fontFamily: "Cairo, sans-serif" }}
                >
                  ⚠ {errors.name}
                </p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-bold mb-3"
                style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}
              >
                العنوان بالتفصيل <span style={{ color: "#c0392b" }}>*</span>
              </label>
              <textarea
                id="address"
                rows={4}
                placeholder="مثال: الرياض، حي النخيل، شارع الأمير سلطان، رقم المبنى 12"
                value={formData.address ?? ""}
                onChange={(e) => handleChange("address", e.target.value)}
                className="form-input w-full py-4 px-5 text-base resize-none"
                style={{
                  fontFamily: "Cairo, sans-serif",
                  color: "var(--charcoal)",
                  borderColor: errors.address ? "#c0392b" : undefined,
                }}
                disabled={isLoading}
              />
              {errors.address && (
                <p
                  className="mt-2 text-sm"
                  style={{ color: "#c0392b", fontFamily: "Cairo, sans-serif" }}
                >
                  ⚠ {errors.address}
                </p>
              )}
            </div>

            {/* Size & Color Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Size Dropdown */}
              <div>
                <label
                  htmlFor="size"
                  className="block text-sm font-bold mb-3"
                  style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}
                >
                  المقاس <span style={{ color: "#c0392b" }}>*</span>
                </label>
                <select
                  id="size"
                  value={formData.size ?? ""}
                  onChange={(e) => handleChange("size", e.target.value)}
                  className="form-input w-full py-4 px-5 text-base appearance-none cursor-pointer"
                  style={{
                    fontFamily: "Cairo, sans-serif",
                    color: "var(--charcoal)",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237A7469' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left 16px center",
                    paddingLeft: "40px",
                    borderColor: errors.size ? "#c0392b" : undefined,
                  }}
                  disabled={isLoading}
                >
                  <option value="">اختر المقاس</option>
                  {sizeOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.size && (
                  <p className="mt-2 text-sm" style={{ color: "#c0392b", fontFamily: "Cairo, sans-serif" }}>
                    ⚠ {errors.size}
                  </p>
                )}
              </div>

              {/* Color Selector */}
              <div>
                <label
                  className="block text-sm font-bold mb-3"
                  style={{ color: "var(--charcoal)", fontFamily: "Cairo, sans-serif" }}
                >
                  اللون <span style={{ color: "#c0392b" }}>*</span>
                </label>
                <div className="flex gap-4 items-center h-[58px]">
                  {colorOptions.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      id={`form-color-${c.value}`}
                      onClick={() => handleChange("color", c.value)}
                      title={c.label}
                      aria-label={`اختر اللون ${c.label}`}
                      className="color-swatch w-10 h-10 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: c.hex,
                        border: `3px solid ${c.border}`,
                        boxShadow:
                          formData.color === c.value
                            ? "0 0 0 3px white, 0 0 0 5px var(--primary)"
                            : "0 2px 6px rgba(0,0,0,0.2)",
                        transform: formData.color === c.value ? "scale(1.2)" : "scale(1)",
                      }}
                      disabled={isLoading}
                    />
                  ))}
                  {formData.color && (
                    <span
                      className="text-sm font-bold"
                      style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}
                    >
                      {formData.color}
                    </span>
                  )}
                </div>
                {errors.color && (
                  <p className="mt-2 text-sm" style={{ color: "#c0392b", fontFamily: "Cairo, sans-serif" }}>
                    ⚠ {errors.color}
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary Preview */}
            {(formData.name || formData.size || formData.color) && (
              <div
                className="p-5 rounded-2xl"
                style={{
                  background: "var(--sand-light)",
                  border: "1px solid var(--sand-dark)",
                  fontFamily: "Cairo, sans-serif",
                }}
              >
                <p className="text-sm font-bold mb-3" style={{ color: "var(--muted)" }}>ملخص طلبك:</p>
                <div className="space-y-1 text-sm">
                  {formData.name && <p style={{ color: "var(--charcoal)" }}>الاسم: <strong>{formData.name}</strong></p>}
                  {formData.size && <p style={{ color: "var(--charcoal)" }}>المقاس: <strong>{formData.size}</strong></p>}
                  {formData.color && <p style={{ color: "var(--charcoal)" }}>اللون: <strong>{formData.color}</strong></p>}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="submit-order-btn"
              disabled={isLoading}
              className="btn-primary w-full text-white font-black py-5 rounded-2xl text-xl cursor-pointer flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <span>تأكيد الطلب</span>
                  <span>✦</span>
                </>
              )}
            </button>

            <p
              className="text-center text-xs"
              style={{ color: "var(--muted)", fontFamily: "Cairo, sans-serif" }}
            >
              بياناتك آمنة ومحمية تماماً 🔒 · لن نشارك معلوماتك مع أي طرف ثالث
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
