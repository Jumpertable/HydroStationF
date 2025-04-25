"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Order {
  orderID: number;
  cusID: number;
  orderTotal: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cusID, setCusID] = useState<number | null>(null);

  useEffect(() => {
    const storedID = localStorage.getItem("cusID");
    if (storedID) {
      setCusID(parseInt(storedID));
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!cusID) return;
      try {
        const res = await fetch(
          `http://localhost:3100/order/customer/${cusID}/completed`
        );
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [cusID]);

  if (loading) {
    return (
      <div className="text-center py-12 text-blue-600">Loading orders...</div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No past orders found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl border border-blue-200 text-blue-900">
      <h1 className="text-4xl font-bold text-blue-800 drop-shadow mb-8 text-center">
        📦 Past Orders
      </h1>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-6 mb-8">
        <Link href="/Customer/Store">
          <button className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-full shadow hover:from-blue-500 hover:to-blue-700 transition">
          - Back to the Station
          </button>
        </Link>
        <Link href="/Customer/Cart">
          <button className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-full shadow hover:from-green-500 hover:to-green-700 transition">
          ← Go to Cart
          </button>
        </Link>
      </div>

      {/* Orders List */}
      <ul className="space-y-4">
        {orders.map((order) => (
          <li
            key={order.orderID}
            className="bg-white/80 border border-blue-100 p-5 rounded-xl shadow-md flex justify-between items-center transition hover:scale-[1.01] hover:shadow-lg"
          >
            <div>
              <div className="font-semibold text-lg text-blue-900">
                📄 Order #{order.orderID}
              </div>
              <div className="text-sm text-blue-700">
                Date: {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="text-green-700 font-bold text-xl">
              ฿{order.orderTotal.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
