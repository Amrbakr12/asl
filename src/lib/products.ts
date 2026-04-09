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
    tag: "الأكثر مبيعًا",
    description:
      "تيشيرت أصل الكلاسيكي باللون الأبيض الصافي، قطعة أساسية في دولابك لو بتحب اللبس النضيف والبسيط. معمول من قطن مصري ممتاز وناعم يريحك طول اليوم.",
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
      "الأسود دايمًا شيك. تيشيرت أصل الكلاسيكي الأسود معمول للي بيحب الستايل الهادي والمرتب. خياطة دقيقة وخامة ممتازة تديك شكل حلو في أي وقت.",
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
      "اللون الزيتوني بيدي إحساس طبيعي وهادي في نفس الوقت. مستوحى من ألوان الأرض والطبيعة، وبيكمل أي لبس كاجوال بشكل مميز.",
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
