export default function Footer() {
  return (
    <footer
      className="py-16 px-6"
      style={{ background: "var(--charcoal)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3
              className="text-5xl font-black shimmer-text mb-4"
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              أصل
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Cairo, sans-serif" }}
            >
              نحن نؤمن بأن الأصالة ليست مجرد كلمة، بل هي أسلوب حياة.
              كل تيشيرت نصنعه يحمل روح الهوية العربية الأصيلة.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-lg font-bold mb-6"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Cairo, sans-serif" }}
            >
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              {[
                { label: "الرئيسية", href: "#" },
                { label: "المنتجات", href: "#products" },
                { label: "اطلب الآن", href: "#order-section" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[var(--primary-light)]"
                    style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Cairo, sans-serif" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-lg font-bold mb-6"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Cairo, sans-serif" }}
            >
              تواصل معنا
            </h4>
            <div className="space-y-3">
              <p
                className="text-sm flex items-center gap-2"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Cairo, sans-serif" }}
              >
                <span>📞</span>
                <a
                  href="tel:+966500000000"
                  className="hover:text-[var(--primary-light)] transition-colors"
                >
                  ‪+966 50 000 0000‬
                </a>
              </p>
              <p
                className="text-sm flex items-center gap-2"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Cairo, sans-serif" }}
              >
                <span>✉️</span>
                <a
                  href="mailto:hello@asl.sa"
                  className="hover:text-[var(--primary-light)] transition-colors"
                >
                  hello@asl.sa
                </a>
              </p>
              <p
                className="text-sm flex items-center gap-2"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Cairo, sans-serif" }}
              >
                <span>📍</span>
                الرياض، المملكة العربية السعودية
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "32px" }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Cairo, sans-serif" }}
            >
              © {new Date().getFullYear()} أصل. جميع الحقوق محفوظة.
            </p>
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Cairo, sans-serif" }}
            >
              صُنع بـ ❤ في المملكة العربية السعودية
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
