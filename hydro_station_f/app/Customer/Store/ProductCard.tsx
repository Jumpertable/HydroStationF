"use client";

import { useState } from "react";


interface Product {
  productID: number;
  productName: string;
  productPrice: number;
  productBrand: string;
  productDes?: string;
  image_url: string;
}

export default function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (productID: number, quantity: number) => void;
}) {
  const [qty, setQty] = useState(1);

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4 rounded-2xl shadow-xl border border-blue-200 text-blue-900 transition hover:scale-[1.01]">
  <img
    src={product.image_url}
    alt={product.productName}
    className="w-full h-40 object-cover rounded-xl mb-4 border border-blue-100 shadow-sm"
  />
  <h2 className="text-xl font-bold mb-1 text-blue-800">{product.productName}</h2>
  <p className="text-sm text-blue-700 mb-1">{product.productBrand}</p>
  <p className="text-lg font-semibold text-blue-600 mb-4">
    ${product.productPrice.toFixed(2)}
  </p>

  <div className="flex items-center justify-between gap-4">
    <input
      type="number"
      min={1}
      value={qty}
      onChange={(e) => setQty(parseInt(e.target.value))}
      className="w-20 px-3 py-1 bg-white border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
    />

    <button
      onClick={() => onAdd(product.productID, qty)}
      className="bg-gradient-to-r from-green-400 to-green-600 text-white px-5 py-2 rounded-full shadow hover:from-green-500 hover:to-green-700 transition-all"
    >
      ➕ Add to Cart
    </button>
  </div>
</div>

  );
}