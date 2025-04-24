"use client";

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
    return <div className="text-center py-12 text-blue-600">Loading orders...</div>;
  }

  if (!orders.length) {
    return <div className="text-center py-12 text-gray-500">No past orders found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Past Orders
      </h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li
            key={order.orderID}
            className="bg-white shadow rounded p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold text-lg">Order #{order.orderID}</div>
              <div className="text-sm text-gray-500">
                Date: {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="text-green-700 font-bold text-lg">
              ฿{order.orderTotal.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
