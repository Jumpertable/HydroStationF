"use client";

import { useEffect, useState } from "react";
import { SERVER_URL } from "../../constant";
import Link from "next/link";

interface Product {
  productID: number;
  productName: string;
  productPrice: number;
  productBrand: string;
  productDes?: string;
  image_url: string;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cusID, setCusID] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedID = localStorage.getItem("cusID");
    if (storedID && !isNaN(Number(storedID))) {
      setCusID(Number(storedID));
    } else {
      console.warn("❌ No valid cusID found in localStorage.");
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/product`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productID: number, quantity: number) => {
    console.log("🛒 Add to cart clicked!", { cusID, productID, quantity });

    if (cusID == null) {
      setMessage("❌ Please login or register to add items to cart.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3100/order-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cusID, productID, amount: quantity }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unknown error");
      setMessage("✅ Added to cart!");
    } catch (err: any) {
      console.error("❌ Add to cart failed:", err.message);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8 text-blue-900">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-gradient-to-r from-blue-200 via-white to-green-100 p-6 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-blue-800 text-center md:text-left drop-shadow-sm">
          Welcome To <span className="text-green-700">HydroStation</span>!
        </h1>

        <div className="flex flex-wrap justify-center md:justify-end gap-3">
          <Link href="/Customer/Cart">
            <button className="px-5 py-2 bg-gradient-to-r from-blue-300 to-blue-500 text-white font-semibold rounded-full shadow-md hover:from-blue-400 hover:to-blue-600 transition">
              🧺 View Cart
            </button>
          </Link>
          <Link href="/Customer/Order">
            <button className="px-5 py-2 bg-gradient-to-r from-green-300 to-green-500 text-white font-semibold rounded-full shadow-md hover:from-green-400 hover:to-green-600 transition">
              📜 My Orders
            </button>
          </Link>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="text-center mb-6 text-green-700 font-semibold text-lg">
          {message}
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <ProductCard
            key={product.productID}
            product={product}
            onAdd={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (productID: number, quantity: number) => void;
}) {
  const [qty, setQty] = useState(1);

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-5 rounded-2xl shadow-xl border border-blue-200 text-blue-900 transition hover:scale-[1.02]">
      <img
        src={product.image_url}
        alt={product.productName}
        width={400}
        height={160}
        className="w-full h-40 object-cover rounded-xl mb-4 border border-blue-100 shadow-sm"
      />

      <h2 className="text-xl font-bold text-blue-800 mb-1">
        {product.productName}
      </h2>
      <p className="text-sm text-blue-700 mb-1">{product.productBrand}</p>
      <p className="text-lg font-semibold text-blue-600 mb-4">
        ${product.productPrice.toFixed(2)}
      </p>

      <div className="flex items-center justify-between gap-3">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value))}
          className="w-20 px-3 py-1 bg-white border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <button
          onClick={() => onAdd(product.productID, qty)}
          className="bg-gradient-to-r from-cyan-400 via-blue-500 to-green-500 text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:brightness-105 hover:shadow-xl active:scale-95 transition-all duration-200"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}
