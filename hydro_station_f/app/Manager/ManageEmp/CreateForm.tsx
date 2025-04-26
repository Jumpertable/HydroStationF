"use client";

import { useState } from "react";
import { createEmployee } from "./api";

export default function CreateEmployeeForm({
  managerId,
  onCreated,
}: {
  managerId: number;
  onCreated?: () => void;
}) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    businessEmail: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createEmployee({ ...formData, manager_id: managerId });

    if (res && res.passcode) {
      setResponseMessage(`✅ Employee created.\n🧾 Passcode: ${res.passcode}`);
      setFormData({
        first_name: "",
        last_name: "",
        businessEmail: "",
        password: "",
      });
      if (onCreated) onCreated(); // <-- reload list
    } else {
      setResponseMessage("❌ Failed to create employee.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6 rounded-2xl shadow-2xl border border-blue-200 text-blue-900 max-w-md w-full mx-auto"
    >
      <h2 className="text-2xl font-bold text-blue-800 drop-shadow mb-4">
        👤 Create Employee
      </h2>

      {responseMessage && (
        <div className="p-4 bg-blue-100 border border-blue-300 text-blue-800 rounded shadow whitespace-pre-line">
          {responseMessage}
        </div>
      )}

      {["first_name", "last_name", "businessEmail", "password"].map((field) => (
        <input
          key={field}
          type={field === "password" ? "password" : "text"}
          name={field}
          placeholder={field
            .replace("_", " ")
            .replace(/^./, (c) => c.toUpperCase())}
          onChange={handleChange}
          value={formData[field as keyof typeof formData]}
          className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      ))}

      <button
        type="submit"
        className="w-full py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-full shadow hover:from-blue-500 hover:to-blue-700 transition-all"
      >
        ➕ Create Employee
      </button>
    </form>
  );
}
