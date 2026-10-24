"use client";
import { getProductsApi } from "@/app/lib/api/products";
import { useQuery } from "@tanstack/react-query";

export type Product = {
  productId: string;
  no: number;
  name: string;
};

export default function ProductsPage() {
  const {
    data: products,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsApi,
  });

  if (isPending) return <p className="p-6">Loading data...</p>;

  if (isError) {
    return <p role="alert">Cannot view details: {error.message}</p>;
  }

  return (
    <div className="space-y-2 p-6">
      <p className="text-sm text-muted-foreground">{products.length} rows</p>

      {products.map((product) => (
        <div key={product.key} className=" border p-3">
          <p>No: {product.no ?? "null"}</p>
          <p>Name: {product.name}</p>
        </div>
      ))}
    </div>
  );
}
