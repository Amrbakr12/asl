import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/lib/products";
import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";

// Generate static routes at build time for all product slugs
export function generateStaticParams() {
  return products.map((p) => ({ id: p.slug }));
}

// Dynamic SEO metadata per product
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductBySlug(id);
  if (!product) return { title: "المنتج غير موجود" };
  return {
    title: `${product.name} | أصل`,
    description: product.description,
    openGraph: {
      title: `${product.name} | أصل`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductBySlug(id);

  // Show 404 if slug doesn't match any product
  if (!product) notFound();

  return <ProductPageClient product={product} />;
}
