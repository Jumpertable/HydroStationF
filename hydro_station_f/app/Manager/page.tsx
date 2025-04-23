"use client";

export default function RegisterManager() {
  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white h-screen p-4">
        <h2 className="text-xl font-semibold mb-4">Manager Dashboard</h2>
        <ul>
          <li className="py-2 hover:bg-gray-700">
            <a href="#employees">Employees</a>
          </li>
          <li className="py-2 hover:bg-gray-700">
            <a href="#products">Products</a>
          </li>
          <li className="py-2 hover:bg-gray-700">
            <a href="#orders">Orders</a>
          </li>
          <li className="py-2 hover:bg-gray-700">
            <a href="#high-demand">High Demand</a>
          </li>
        </ul>
      </div>

          <div className="flex-1 p-6">{/* Main content will go here */}</div>
          
      </div>
      
      
  );
}
