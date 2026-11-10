"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "@/app/lib/api/products";
import Pagination from "@/app/components/Pagination";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: products,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsApi,
  });

  const keyword = search.trim().toLowerCase();
  const filtered = (products ?? []).filter(
    (product) =>
      product.name.toLowerCase().includes(keyword) ||
      String(product.no ?? "").includes(keyword),
  );
  const productsOnPage = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Products</h1>

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">All products</h2>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name or number"
            className="input w-56"
          />
        </div>

        {isPending && (
          <p className="p-4 text-sm text-muted-foreground">Loading…</p>
        )}
        {isError && (
          <p className="p-4 text-sm text-destructive">{error.message}</p>
        )}

        {products && (
          <table className="table">
            <thead>
              <tr>
                <th className="w-24">No.</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {productsOnPage.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No products found.
                  </td>
                </tr>
              )}
              {productsOnPage.map((product) => (
                <tr key={product.key}>
                  <td className="text-muted-foreground">{product.no ?? "–"}</td>
                  <td>{product.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {products && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
}
