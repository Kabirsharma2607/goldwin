import { api } from "@/lib/api";
import ProductPage from "./Product";

type Props = {
  params: {
    id: string;
  };
};

export default function Products({ params }: Props) {
  const { id } = params;
  return <ProductPage id={id} />;
}

export async function generateStaticParams() {
  const products = await api.getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}
