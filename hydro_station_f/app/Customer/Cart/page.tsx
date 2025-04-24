"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderItem {
  product: any;
  orderItemID: number;
  orderID: number;
  cusID: number;
  productID: number;
  productName: string;
  productPrice: number;
  amount: number;
}

export default function CartPage() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cusID, setCusID] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [payMethod, setPayMethod] = useState("cash");

  useEffect(() => {
    const storedID = localStorage.getItem("cusID");
    if (storedID) {
      setCusID(parseInt(storedID));
    }
  }, []);

  useEffect(() => {
    if (cusID !== null) {
      fetchCart();
    }
  }, [cusID]);

  const fetchCart = async () => {
    if (!cusID) return;
    setLoading(true);

    try {
      // Fetch active order
      const orderRes = await fetch(
        `http://localhost:3100/order/customer/${cusID}/active`
      );

      // If no content or not OK, set empty items and return
      if (orderRes.status === 204 || !orderRes.ok) {
        console.log(`No active order found or error: ${orderRes.status}`);
        setItems([]);
        return;
      }

      // Check if response is empty before parsing
      const responseText = await orderRes.text();
      if (!responseText) {
        console.log("Empty response from server");
        setItems([]);
        return;
      }

      // Parse the response text as JSON
      const orderData = responseText ? JSON.parse(responseText) : null;

      if (!orderData || !orderData.orderID) {
        console.log("Order data is empty or missing orderID");
        setItems([]);
        return;
      }

      // Fetch order items
      const orderID = orderData.orderID;
      const itemsRes = await fetch(
        `http://localhost:3100/order-items/order/${orderID}`
      );

      if (!itemsRes.ok) {
        console.error(`Failed to fetch order items: ${itemsRes.status}`);
        setItems([]);
        return;
      }

      // Use text() then parse for safer JSON handling
      const itemsText = await itemsRes.text();
      const itemsData = itemsText ? JSON.parse(itemsText) : [];
      setItems(itemsData);
    } catch (err) {
      console.error("❌ Failed to load cart:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };
  const total = items.reduce(
    (sum, item) => sum + (item.product?.productPrice || 0) * item.amount,
    0
  );

  const handleCheckout = async () => {
    if (!cusID || total <= 0) return;
    try {
      const res = await fetch("http://localhost:3100/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cusID,
          payAmount: total,
          payMethod,
          payTrans: `T-${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment failed");

      setMessage(
        "✅ Payment successful! Your order is being processed. Redirecting..."
      );
      setItems([]);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }

    setTimeout(() => {
      window.location.href = "/Customer/Store";
    }, 2000);
  };

  const updateQuantity = async (item: OrderItem, delta: number) => {
    const newAmount = item.amount + delta;
    if (newAmount <= 0) {
      await deleteItem(item.orderItemID);
    } else {
      await fetch(`http://localhost:3100/order-items/${item.orderItemID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: newAmount }),
      });
      fetchCart();
    }
  };

  const deleteItem = async (orderItemID: number) => {
    try {
      await fetch(`http://localhost:3100/order-items/${orderItemID}`, {
        method: "DELETE",
      });
      fetchCart();
    } catch (err) {
      console.error("❌ Failed to delete item:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-blue-600">Loading cart...</div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-16 text-gray-500">Your cart is empty.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Your Cart
      </h1>

      <Link href="/Customer/Orders">
        <button className="text-sm text-blue-500 underline mt-2">
          View Past Orders
        </button>
      </Link>

      {message && (
        <div className="text-center mb-4 text-sm font-semibold text-green-600">
          {message}
        </div>
      )}

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.orderItemID}
            className="bg-white shadow rounded p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold text-lg">
                {item.product?.productName ?? "Unnamed Product"}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateQuantity(item, -1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  –
                </button>
                x{item.amount}
                <button
                  onClick={() => updateQuantity(item, 1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-blue-600 font-semibold">
                {item.product?.productPrice
                  ? `$${(item.product.productPrice * item.amount).toFixed(2)}`
                  : "N/A"}
              </div>
              <button
                onClick={() => deleteItem(item.orderItemID)}
                className="text-red-500 hover:text-red-700 text-lg"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 text-right text-xl font-bold text-green-700">
        Total: B{total.toFixed(2)}
      </div>

      <div className="mt-6 flex flex-col items-end gap-3">
        <select
          className="border p-2 rounded w-40"
          value={payMethod}
          onChange={(e) => setPayMethod(e.target.value)}
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="mobile">Mobile</option>
        </select>

        <button
          disabled={total <= 0}
          onClick={handleCheckout}
          className={`bg-green-600 text-white px-6 py-2 rounded ${
            total <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          Pay Now
        </button>
      </div>
      <Link href="/Customer/Store">
        <button className="mt-4 text-blue-600 underline hover:text-blue-800">
          ← Back to the Station
        </button>
      </Link>
    </div>
  );
}
