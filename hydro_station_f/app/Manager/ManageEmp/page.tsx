"use client";

import { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "./api";
import EditEmployeeForm from "./EditForm";

type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  businessEmail: string;
};

export default function EmployeeList() {
  const managerId = 1; // Replace with actual logged-in managerId
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees(managerId);
      console.log("📦 Fetched:", data);

      // If data is an array, set it directly
      if (Array.isArray(data)) {
        setEmployees(data);
      }

      // If wrapped in { employees: [...] }
      else if (data && Array.isArray(data.employees)) {
        setEmployees(data.employees);
      }

      // If something went wrong or structure is unexpected
      else {
        console.error("Unexpected data format:", data);
        setEmployees([]); // fallback
      }
    } catch (err) {
      console.error("❌ Failed to fetch employees:", err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteEmployee(id);
    loadEmployees();
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>

      {editingId && (
        <div className="mb-6">
          <EditEmployeeForm
            employeeId={editingId}
            onComplete={() => {
              setEditingId(null);
              loadEmployees();
            }}
          />
        </div>
      )}

      {!employees ? (
        <p className="text-gray-600">Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className="text-gray-500">No employees found.</p>
      ) : (
        <ul className="divide-y divide-gray-300">
          {employees.map((emp) => (
            <li key={emp.id} className="flex justify-between items-center py-2">
              <div>
                <div className="font-semibold">
                  {emp.first_name} {emp.last_name}
                </div>
                <div className="text-sm text-gray-600">{emp.businessEmail}</div>
              </div>
              <div className="space-x-2">
                <button
                  className="px-3 py-1 bg-yellow-400 rounded"
                  onClick={() => setEditingId(emp.id)}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
