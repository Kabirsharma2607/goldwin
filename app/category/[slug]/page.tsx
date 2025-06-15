// import CategoryClient from "./CategoryClient";
import { api } from "@/lib/api";
import CategoryClient from "./CategoryClient";

type Props = {
  params: {
    slug: string;
  };
};

export default function CategoryPage({ params }: Props) {
  const { slug } = params;
  return <CategoryClient slug={slug} />;
}

export async function generateStaticParams() {
  const categories = await api.getCategories();
  return categories.map((category: { slug: string }) => ({
    slug: category.slug,
  }));
}
