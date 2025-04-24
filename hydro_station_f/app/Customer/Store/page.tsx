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
        Product Store
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
