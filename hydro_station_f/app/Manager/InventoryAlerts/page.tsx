"use client";

import { useEffect, useState } from "react";

interface InventoryAlert {
  id: number;
  productID: number;
  productName: string;
  productStock: number;
  stockLimit: number;
  stockLimitAlert: boolean;
}

export default function InventoryAlertsPage() {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("http://localhost:3100/inv-alerts");
        const data = await res.json();

        if (Array.isArray(data)) {
          setAlerts(data);
        } else {
          console.error("Expected an array but got:", data);
          setAlerts([]);
        }
      } catch (err) {
        console.error("Failed to fetch inventory alerts:", err);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-blue-600">Loading alerts...</div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl border border-blue-200 text-blue-900">
    <h1 className="text-3xl font-bold mb-6 text-blue-800 drop-shadow">📊 Inventory Alerts</h1>
  
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full border-collapse bg-white/80 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 text-sm font-semibold tracking-wide">
            <tr>
            <th className="px-6 py-3 border border-blue-200 text-left rounded-tl-lg">Product ID</th>
            <th className="px-6 py-3 border border-blue-200 text-left">Product Name</th>
            <th className="px-6 py-3 border border-blue-200 text-center">Stock</th>
            <th className="px-6 py-3 border border-blue-200 text-center">Limit</th>
            <th className="px-6 py-3 border border-blue-200 text-center rounded-tr-lg">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {alerts.map((alert) => (
            <tr
              key={alert.id}
              className="hover:bg-blue-50/70 transition-colors duration-200"
            >
              <td className="border border-blue-200 px-6 py-3 text-blue-800 text-sm">
                {alert.productID}
              </td>
              <td className="border border-blue-200 px-6 py-3">{alert.productName}</td>
              <td className="border border-blue-200 px-6 py-3 text-center">{alert.productStock}</td>
              <td className="border border-blue-200 px-6 py-3 text-center">{alert.stockLimit}</td>
              <td
                className={`border border-blue-200 px-6 py-3 text-center font-semibold ${
                  alert.stockLimitAlert
                    ? 'text-green-600 bg-green-50'
                    : 'text-red-600 bg-red-50'
                } rounded`}
              >
                {alert.stockLimitAlert ? '✅ Safe' : '❌ Danger'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  );
}
