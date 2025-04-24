"use client";

import { useState } from "react";

type FormData = {
  productName: string;
  productDes?: string;
  productPrice: number;
  productStock: number;
  productBrand: string;
  image_url: string,
};

export default function CreateProductForm() {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    productDes: "",
    productPrice: 0,
    productStock: 0,
    productBrand: "",
    image_url: '',
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
    <div className="bg-white p-6 rounded shadow-md text-black max-w-xl w-full mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Product</h2>

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

      <form onSubmit={handleSubmit} className="space-y-4 ">
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
          value={formData.productDes}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full px-4 py-2 border rounded"
        />

        <div>🪙 Price: </div>
        <input
          type="number"
          name="productPrice"
          value={formData.productPrice}
          onChange={handleChange}
          min={0}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <div>📦 Stock: </div>
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
