"use client";

import { useEffect, useState } from "react";
import { getAllEmployees, deleteEmployee } from "./api";
import EditEmployeeForm from "./EditForm";
import CreateEmployeeForm from "./CreateForm";

type Employee = {
  employeeID: number;
  first_name: string;
  last_name: string;
  businessEmail: string;
};

export default function EmployeeList() {
  const managerId = 1;
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadEmployees = async () => {
    try {
      const data = await getAllEmployees();
      console.log("📦 Fetched:", data);

      if (Array.isArray(data)) {
        setEmployees(data);
      } else if (data?.employees && Array.isArray(data.employees)) {
        setEmployees(data.employees);
      } else {
        console.warn("Unexpected format:", data);
        setEmployees([]);
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
    if (!id) {
      console.error("⚠️ Cannot delete: invalid ID", id);
      return;
    }

    console.log("🧹 Deleting employee with ID:", id);
    await deleteEmployee(id);
    loadEmployees();
  };

  return (
    <div className="p-8 bg-gradient-to-b from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl border border-blue-200 text-blue-900 transition-all space-y-8">
      <h1 className="text-3xl font-bold text-blue-800 drop-shadow">
        🌍 All Employees
      </h1>

      <CreateEmployeeForm managerId={managerId} />

      {editingId && (
        <EditEmployeeForm
          employeeId={editingId}
          onComplete={() => {
            setEditingId(null);
            loadEmployees();
          }}
        />
      )}

      {employees === null ? (
        <p className="text-blue-700 italic">Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className="text-blue-600 italic">No employees found.</p>
      ) : (
        <ul className="divide-y divide-blue-200">
          {employees.map((emp) => (
            <li
              key={emp.employeeID}
              className="flex justify-between items-center py-4 px-2 hover:bg-blue-100/30 transition rounded-lg"
            >
              <div>
                <div className="font-semibold text-blue-900">
                  {emp.first_name} {emp.last_name}
                </div>
                <div className="text-sm text-blue-700">{emp.businessEmail}</div>
              </div>
              <div className="space-x-2">
                <button
                  className="px-4 py-1 bg-yellow-300 rounded-full shadow hover:bg-yellow-400 transition"
                  onClick={() => setEditingId(emp.employeeID)}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(emp.employeeID)}
                  className="px-4 py-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
                >
                  ❌ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
