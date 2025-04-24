"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EmployeeList from "./ManageEmp/page";
import ProductManager from "./Products/ProductManager";
import InventoryAlertsPage from "./InventoryAlerts/page";

type TabKey = "employees" | "products" | "orders" | "highDemand" | "alerts";

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("employees");
  const router = useRouter();

  const tabs: Record<TabKey, JSX.Element> = {
    employees: (
      <div>
        👥 Manage Employees <EmployeeList />
      </div>
    ),
    products: (
      <div>
        🛒 Manage Products <ProductManager />
      </div>
    ),
    orders: <div>📦 View Orders</div>,
    highDemand: <div>📊 High Demand Stats</div>,
    alerts: (
      <div>
        🚨 Inventory Alerts <InventoryAlertsPage />
      </div>
    ),
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 space-y-6 shadow-xl">
        <h2 className="text-2xl font-bold drop-shadow mb-4">
          🌊 Manager Dashboard
        </h2>
        <nav className="space-y-2">
          {(
            ["employees", "products", "orders", "highDemand", "alerts"] as TabKey[]
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`block w-full text-left py-2 px-4 rounded-lg transition duration-200 font-medium ${
                activeTab === tab
                  ? "bg-blue-600 shadow-inner text-white"
                  : "hover:bg-blue-500/40 hover:text-white"
              }`}
            >
              {tab === "alerts"
                ? "📢 Inventory Alerts"
                : `🌀 ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
            </button>
          ))}

          {/* ➕ Storefront Button */}
          <button
            onClick={() => router.push("/Customer/Store")}
            className="block w-full text-left py-2 px-4 rounded-lg transition duration-200 font-medium bg-blue-500/40 hover:bg-blue-600 hover:text-white"
          >
            🛍️ Storefront
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto bg-blue-50/60 backdrop-blur-sm shadow-inner rounded-tl-3xl rounded-br-3xl transition-all duration-300">
        <div className="text-3xl font-bold text-blue-800 mb-6 capitalize drop-shadow">
          {activeTab === "alerts"
            ? "📢 Inventory Alerts"
            : `📂 ${activeTab.replace(/([A-Z])/g, " $1")}`}
        </div>

        <div className="bg-white/80 p-8 rounded-2xl shadow-xl text-blue-900 hover:scale-[1.01] transition-transform duration-200 border border-blue-200">
          {tabs[activeTab]}
        </div>
      </main>
    </div>
  );
}
