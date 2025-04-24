'use client';

import { useState } from 'react';
import EmployeeList from './ManageEmp/page';
import ProductManager from './Products/ProductManager';

// Define tab names as a union type
type TabKey = 'employees' | 'products' | 'orders' | 'highDemand';

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('employees');

  const tabs: Record<TabKey, JSX.Element> = {
    employees: <div>👥 Manage Employees <EmployeeList /></div>,
    products: <div>🛒 Manage Products <ProductManager /></div>,
    orders: <div>📦 View Orders</div>,
    highDemand: <div>📊 High Demand Alerts</div>,
  };

  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Manager Dashboard</h2>
        <nav className="space-y-2">
          {(['employees', 'products', 'orders', 'highDemand'] as TabKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="text-2xl font-semibold text-gray-800 mb-4 capitalize">
          {activeTab.replace(/([A-Z])/g, ' $1')}
        </div>
        <div className="bg-white p-6 rounded shadow text-blue-800 transition-all 
            duration-300 transform hover:scale-105 hover:cursor-pointer">{tabs[activeTab]}</div>
      </main>
    </div>
  );
}
