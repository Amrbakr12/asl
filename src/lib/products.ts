export type Product = {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  color: string;
  colorCode: string;
  image: string;
  hoverImage?: string;
  price: string;
  priceNumber: number;
  tag?: string;
  description: string;
  features: string[];
};

export const products: Product[] = [
  {
    id: 1,
    slug: "white",
    name: "تيشيرت أصل الكلاسيكي – أبيض",
    shortName: "أبيض",
    color: "أبيض",
    colorCode: "#F5F5F0",
    image: "/tshirt-white.png",
    price: "١٩٩ ريال",
    priceNumber: 199,
    tag: "الأكثر مبيعاً",
    description:
      "تيشيرت أصل الكلاسيكي باللون الأبيض الناصع — قطعة لا غنى عنها في خزانة كل رجل يقدّر الأناقة الحقيقية. مصنوعة من أجود أنواع القطن المصري بنعومة استثنائية تصاحبك طوال اليوم.",
    features: [
      "قطن مصري 100% عالي الجودة",
      "خياطة مزدوجة للمتانة",
      "لا يتقلص بعد الغسيل",
      "تصميم مريح للجسم (Regular Fit)",
      "ألوان ثابتة لا تبهت",
    ],
  },
  {
    id: 2,
    slug: "black",
    name: "تيشيرت أصل الكلاسيكي – أسود",
    shortName: "أسود",
    color: "أسود",
    colorCode: "#2C2A26",
    image: "/tshirt-black.png",
    price: "١٩٩ ريال",
    priceNumber: 199,
    tag: "جديد",
    description:
      "الأسود لغة الأناقة الأزلية. تيشيرت أصل الكلاسيكي الأسود صُنع لمن يتكلم بالهدوء ويعبّر بالذوق. خِياطة دقيقة وقماش فاخر يجعلك في قمة الأناقة في أي مناسبة.",
    features: [
      "قطن مصري 100% عالي الجودة",
      "خياطة مزدوجة للمتانة",
      "لا يتقلص بعد الغسيل",
      "تصميم مريح للجسم (Regular Fit)",
      "ألوان ثابتة لا تبهت",
    ],
  },
  {
    id: 3,
    slug: "olive",
    name: "تيشيرت أصل الكلاسيكي – زيتوني",
    shortName: "زيتوني",
    color: "زيتوني",
    colorCode: "#4A5738",
    image: "/tshirt-olive.png",
    price: "١٩٩ ريال",
    priceNumber: 199,
    tag: "محدود",
    description:
      "اللون الزيتوني — عمق الطبيعة وأصالة الأرض في تيشيرت واحد. مستوحى من ألوان الطبيعة العربية، هذا اللون يضيف لمسة مميزة لأي إطلالة يومية أو غير رسمية.",
    features: [
      "قطن مصري 100% عالي الجودة",
      "خياطة مزدوجة للمتانة",
      "لا يتقلص بعد الغسيل",
      "تصميم مريح للجسم (Regular Fit)",
      "ألوان ثابتة لا تبهت",
    ],
  },
];

export const availableSizes = ["S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof availableSizes)[number];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}
