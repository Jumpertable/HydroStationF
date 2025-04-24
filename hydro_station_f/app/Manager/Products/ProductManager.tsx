"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  productID: any;
  id: number;
  productName: string;
  productDes?: string;
  productPrice: number;
  productStock: number;
  productBrand: string;
  stockLimit?: number;
  image_url: string;
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3100/manager/product");
      const rawData = await res.json();

      // Normalize productID to id
      const productsWithId = rawData.map((p: any) => ({
        ...p,
        id: p.productID,
      }));

      setProducts(productsWithId);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    const res = await fetch(
      `http://localhost:3100/manager/remove-product/${id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      setProducts(products.filter((p) => p.productID !== id));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-blue-800">Loading products...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-800 drop-shadow-md">
          Product List
        </h2>
        <Link href="/Manager/Products/add">
          <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-5 py-2 rounded-full shadow hover:from-blue-500 hover:to-blue-700 transition duration-200">
            + Add Product
          </button>
        </Link>
      </div>

      {/* Product Cards */}
      <div className="grid gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gradient-to-b from-white to-blue-50 border border-blue-200 rounded-2xl p-6 shadow-lg transition hover:scale-[1.01] hover:shadow-xl"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-blue-900">
                  {product.productName}
                </h3>
                <p className="text-gray-600">
                  {product.productDes || "No description"}
                </p>
                <p className="text-sm text-gray-500">
                  Brand: {product.productBrand}
                </p>
                <p className="text-sm text-gray-500">
                  Stock: {product.productStock}
                </p>
                {product.stockLimit !== undefined && (
                  <p
                    className={`text-sm font-medium ${
                      product.productStock <= product.stockLimit
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    Limit: {product.stockLimit}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-4 md:mt-0 space-x-2">
                <Link href={`/Manager/Products/edit/${product.productID}`}>
                  <button className="px-4 py-2 bg-yellow-300 text-black rounded-full shadow hover:bg-yellow-400 transition">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
