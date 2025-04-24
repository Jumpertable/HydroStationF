'use client';
import ProductManager from './ProductManager';

export default function ProductDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🛒 Product Management</h1>
      <ProductManager />
    </div>
  );
}
