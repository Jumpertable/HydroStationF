"use client";

import { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "./api";
import EditEmployeeForm from "./EditForm";
import CreateEmployeeForm from "./CreateForm";


type Employee = {
  id: number;
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
      const data = await getEmployees(managerId);
      console.log("📦 Fetched:", data);

      if (Array.isArray(data)) {
        setEmployees(data);
      } else if (data && Array.isArray(data.employees)) {
        setEmployees(data.employees);
      } else {
        console.error("Unexpected data format:", data);
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
    await deleteEmployee(id);
    loadEmployees();
  };

  return (
    <div className="p-8 bg-gradient-to-b from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl border border-blue-200 text-blue-900 transition-all space-y-8">
      <h1 className="text-3xl font-bold text-blue-800 drop-shadow">👥 Employees</h1>

      <CreateEmployeeForm managerId={managerId} /> {/* 👈 NEW: Create form */}

      {editingId && (
        <EditEmployeeForm
          employeeId={editingId}
          onComplete={() => {
            setEditingId(null);
            loadEmployees();
          }}
        />
      )}

      {!employees ? (
        <p className="text-blue-700 italic">Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className="text-blue-600 italic">No employees found.</p>
      ) : (
        <ul className="divide-y divide-blue-200">
          {employees.map((emp) => (
            <li
              key={emp.id}
              className="flex justify-between items-center py-4 transition hover:bg-blue-100/30 rounded-lg px-2"
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
                  onClick={() => setEditingId(emp.id)}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
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
