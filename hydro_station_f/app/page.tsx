"use client";

import React, { useEffect, useState } from "react";

interface Drink {
  id: string;
  name: string;
  price: number;
  image_url: string;
  like: number;
  is_new: boolean;
  category: string;
}

export default function Page() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const res = await fetch("http://localhost:3100/product");
        const data = await res.json();

        // Normalize if backend returns productID instead of id
        const formatted = data.map((drink: any) => ({
          id: drink.productID,
          name: drink.productName,
          price: drink.productPrice,
          category: drink.productBrand || "Uncategorized",
        }));

        setDrinks(formatted);
      } catch (error) {
        console.error("❌ Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrinks();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-blue-50 font-sans">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">
        Drink Store
      </h1>

      {/* Drinks Grid */}
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        {drinks.map((drink) => (
          <div
            key={drink.id}
            className="bg-white rounded-lg shadow-md w-64 overflow-hidden cursor-pointer transition-transform duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={drink.image_url}
                alt={drink.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs z-10">
                {drink.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {drink.name}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-blue-600">
                  ${drink.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
