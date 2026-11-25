import { API_URL } from "@/app/lib/config";

export interface Product {
  key: string;
  no?: number;
  name: string;
}

// GET /products: list products
export async function getProductsApi(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load products: ${response.status}`);
  }

  return response.json() as Promise<Product[]>;
}
