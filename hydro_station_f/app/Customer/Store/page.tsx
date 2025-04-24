"use client";

import { useEffect, useState } from "react";

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

  // ✅ Fetch customer ID after component mounts
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
        const res = await fetch("http://localhost:3100/product");
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
    <div className="min-h-screen p-8 bg-blue-50">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">
        Welcome To HydroStation!!
      </h1>

      {message && (
        <div className="text-center mb-4 text-green-700 font-semibold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-5 rounded-2xl shadow-xl border border-blue-200 text-blue-900 transition-all hover:scale-[1.01]">
      <img
        src={product.image_url}
        alt={product.productName}
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
