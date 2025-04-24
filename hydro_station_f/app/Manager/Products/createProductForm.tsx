"use client";

import { useState } from "react";

type FormData = {
  productName: string;
  productDes?: string;
  productPrice: number;
  productStock: number;
  productBrand: string;
  image_url: string;
};

export default function CreateProductForm() {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    productDes: "",
    productPrice: 0,
    productStock: 0,
    productBrand: "",
    image_url: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes("Price") || name.includes("Stock") ? +value : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3100/manager/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add token or credentials here if needed
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create product");

      setMessage("✅ Product created successfully!");
      setFormData({
        productName: "",
        productDes: "",
        productPrice: 0,
        productStock: 0,
        productBrand: "",
        image_url: "",
      });
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8 rounded-2xl shadow-2xl text-blue-900 max-w-xl w-full mx-auto transition-all">
      <h2 className="text-3xl font-bold mb-6 drop-shadow text-blue-700">
        ➕ Add New Product
      </h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-xl font-medium shadow ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Description */}
        <textarea
          name="productDes"
          value={formData.productDes}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Price */}
        <div className="text-blue-800 font-semibold">🪙 Price</div>
        <input
          type="number"
          name="productPrice"
          value={formData.productPrice}
          onChange={handleChange}
          min={0}
          className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Stock */}
        <div className="text-blue-800 font-semibold">📦 Stock</div>
        <input
          type="number"
          name="productStock"
          value={formData.productStock}
          onChange={handleChange}
          placeholder="Stock"
          min={0}
          className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Brand */}
        <input
          type="text"
          name="productBrand"
          value={formData.productBrand}
          onChange={handleChange}
          placeholder="Brand"
          className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Image */}
        <input
          type="text"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold py-2 rounded-full shadow hover:from-blue-500 hover:to-blue-700 transition-all"
        >
          🚀 Add Product
        </button>
      </form>
    </div>
  );
}
