"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  productName: string;
  productDes?: string;
  productPrice: number;
  productStock: number;
  productBrand: string;
  stockLimit?: number;
  image_url: string;
};

export default function EditProductForm({
  productId,
  onComplete,
}: {
  productId: number;
  onComplete?: () => void;
}) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3100/manager/product/${productId}`)
      .then((res) => res.json())
      .then(setFormData)
      .catch(() => setMessage("❌ Failed to load product."));
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData({
      ...formData,
      [name]:
        name.includes("Price") ||
        name.includes("Stock") ||
        name === "stockLimit"
          ? +value
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const res = await fetch(
        `http://localhost:3100/manager/update-product/${productId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      console.log("📦 Sending data:", formData);

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update product");

      setMessage(
        `✅ ${data.message} — Stock Status: ${data.product.stockStatus}`
      );

      setMessage("✅ Product updated successfully!");
      onComplete?.();
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  if (!formData) {
    return (
      <div className="text-gray-500 bg-blue-50 px-4 py-2 rounded w-full text-center">
        Loading product...
      </div>
    );
  }

  return (
    <div className="bg-white text-black p-6 rounded shadow-md max-w-xl w-full mx-auto mt-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Edit Product
      </h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full px-4 py-2 border rounded"
          required
        />

        <textarea
          name="productDes"
          value={formData.productDes || ""}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full px-4 py-2 border rounded"
        />
        <p>Price</p>

        <input
          type="number"
          name="productPrice"
          value={formData.productPrice}
          onChange={handleChange}
          placeholder="Price"
          min={0}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <p>Stock</p>

        <input
          type="number"
          name="productStock"
          value={formData.productStock}
          onChange={handleChange}
          placeholder="Stock"
          min={0}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="text"
          name="productBrand"
          value={formData.productBrand}
          onChange={handleChange}
          placeholder="Brand"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <p>Stock Limit</p>
        <input
          type="number"
          name="stockLimit"
          value={formData.stockLimit || 0}
          onChange={handleChange}
          placeholder="Stock Limit (optional)"
          min={0}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="text"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full px-4 py-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
