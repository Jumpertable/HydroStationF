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
    <div className="bg-white p-4 shadow rounded">
      <img
        src={product.image_url}
        alt={product.productName}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <h2 className="text-lg font-bold mb-1">{product.productName}</h2>
      <p className="text-gray-600 text-sm mb-1">{product.productBrand}</p>
      <p className="text-blue-700 font-semibold mb-3">
        ${product.productPrice.toFixed(2)}
      </p>
      <div className="flex items-center justify-between gap-2">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value))}
          className="w-16 px-2 py-1 border rounded"
        />
        <button
          onClick={() => onAdd(product.productID, qty)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}