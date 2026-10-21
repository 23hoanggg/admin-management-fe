const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:6868";

export interface Product {
  key: string;
  no: number | null;
  name: string;
}

export async function getProductsApi(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Không thể lấy danh sách sản phẩm: ${response.status}`);
  }

  return response.json() as Promise<Product[]>;
}
