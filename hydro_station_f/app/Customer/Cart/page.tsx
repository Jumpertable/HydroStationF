"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

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
    const parsedID = storedID && !isNaN(+storedID) ? parseInt(storedID) : null;

    if (parsedID !== null) {
      setCusID(parsedID);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    if (cusID === null || isNaN(cusID)) {
      console.warn("❌ Invalid cusID:", cusID);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3100/order/customer/${cusID}/active`
      );

      const hasBody = res.headers.get("content-length") !== "0";

      if (res.status === 204 || !hasBody) {
        console.log("🛒 No active order");
        setItems([]);
        return;
      }

      if (!res.ok) {
        console.error("❌ Failed to fetch cart:", res.status);
        setItems([]);
        return;
      }

      const orderData = await res.json();
      if (!orderData || !orderData.orderID) {
        setItems([]);
        return;
      }

      const orderID = orderData.orderID;
      const itemsRes = await fetch(
        `http://localhost:3100/order-items/order/${orderID}`
      );

      const hasItemsBody = itemsRes.headers.get("content-length") !== "0";
      if (!itemsRes.ok || !hasItemsBody) {
        setItems([]);
        return;
      }

      const itemsData = await itemsRes.json();
      setItems(itemsData);
    } catch (err) {
      console.error("❌ Failed to load cart:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [cusID]);

  useEffect(() => {
    if (cusID !== null) {
      fetchCart();
    }
  }, [cusID, fetchCart]);

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

      const text = await res.text();
      if (!text) {
        console.warn("Empty response body");
        setItems([]);
        return;
      }

      const orderData = JSON.parse(text);
      if (!res.ok) throw new Error(orderData.message || "Payment failed");

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
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl border border-blue-200 text-blue-900">
      <h1 className="text-4xl font-bold text-blue-800 drop-shadow mb-6 text-center">
        🛒 Your Cart
      </h1>

      {/* Past Orders */}
      <div className="text-center mb-4">
        <Link href="/Customer/Orders">
          <button className="text-sm text-blue-600 underline hover:text-blue-800 transition">
            📜 View Past Orders
          </button>
        </Link>
      </div>

      {/* Message */}
      {message && (
        <div className="text-center mb-4 text-sm font-semibold text-green-600">
          {message}
        </div>
      )}

      {/* Items */}
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.orderItemID}
            className="bg-white/80 border border-blue-100 p-5 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition"
          >
            <div>
              <div className="font-semibold text-lg text-blue-800">
                {item.product?.productName ?? "Unnamed Product"}
              </div>
              <div className="text-sm text-blue-700 flex items-center gap-2 mt-2">
                <button
                  onClick={() => updateQuantity(item, -1)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 font-bold rounded-full hover:bg-blue-200 shadow-sm transition"
                >
                  –
                </button>
                <span className="font-semibold">x{item.amount}</span>
                <button
                  onClick={() => updateQuantity(item, 1)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 font-bold rounded-full hover:bg-blue-200 shadow-sm transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-blue-700 font-bold text-lg">
                {item.product?.productPrice
                  ? `$${(item.product.productPrice * item.amount).toFixed(2)}`
                  : "N/A"}
              </div>
              <button
                onClick={() => deleteItem(item.orderItemID)}
                className="text-red-500 hover:text-red-700 text-xl"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Total */}
      <div className="mt-8 text-right text-2xl font-bold text-green-700 drop-shadow">
        💰 Total: ฿{total.toFixed(2)}
      </div>

      {/* Payment */}
      <div className="mt-6 flex flex-col items-end gap-4">
        <select
          className="border border-blue-300 bg-white shadow-sm px-4 py-2 rounded-lg w-44 focus:ring-2 focus:ring-blue-400 transition"
          value={payMethod}
          onChange={(e) => setPayMethod(e.target.value)}
        >
          <option value="cash">💵 Cash</option>
          <option value="card">💳 Card</option>
          <option value="mobile">📱 Mobile</option>
        </select>

        <button
          disabled={total <= 0}
          onClick={handleCheckout}
          className={`w-44 px-5 py-2 text-white font-semibold rounded-full shadow-md transition 
        ${
          total <= 0
            ? "bg-green-300 cursor-not-allowed"
            : "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
        }`}
        >
          ✅ Pay Now
        </button>
      </div>

      {/* Back to store */}
      <div className="text-center mt-8">
        <Link href="/Customer/Store">
          <button className="text-blue-600 underline hover:text-blue-800 transition">
            ← Back to the Station
          </button>
        </Link>
      </div>
    </div>
  );
}
