"use client";

import { useState, useEffect } from "react";
import { updateEmployee, getEmployeeById } from "./api";

export default function EditEmployeeForm({
  employeeId,
  onComplete,
}: {
  employeeId: number;
  onComplete?: () => void;
}) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    businessEmail: "",
    password: "",
    manager_id: 1, // ✅ Include this!
  });

  useEffect(() => {
    const fetchData = async () => {
      const emp = await getEmployeeById(employeeId);
      if (emp) {
        setFormData({
          first_name: emp.first_name,
          last_name: emp.last_name,
          businessEmail: emp.businessEmail,
          password: "", // Optional
          manager_id: emp.manager_id || 1, // ✅ Populate correctly
        });
      }
    };

    fetchData();
  }, [employeeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating with:", formData);
    await updateEmployee(employeeId, formData); 
    if (onComplete) onComplete();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6 rounded-2xl shadow-xl border border-blue-200 text-blue-900 transition-all"
    >
      <h2 className="text-2xl font-bold mb-4 drop-shadow text-blue-800">
        ✏️ Edit Employee
      </h2>

      {["first_name", "last_name", "businessEmail", "password"].map((field) => (
        <input
          key={field}
          type={field === "password" ? "password" : "text"}
          name={field}
          value={(formData as any)[field]}
          onChange={handleChange}
          placeholder={field
            .replace("_", " ")
            .replace(/^./, (str) => str.toUpperCase())}
          className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required={field !== "password"}
        />
      ))}

      <button
        type="submit"
        className="w-full py-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-full shadow hover:from-green-500 hover:to-green-700 transition"
      >
        💾 Update Employee
      </button>
    </form>
  );
}
