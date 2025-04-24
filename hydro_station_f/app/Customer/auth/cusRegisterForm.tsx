"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    cusName: "",
    cusEmail: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:3100/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // ✅ Save cusID to localStorage as string
      localStorage.setItem("cusID", data.cusID.toString());

      setMessage("✅ Registered successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/Customer/Store";
      }, 2000);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
        Register
      </h2>

      {message && (
        <div className="text-center mb-4 text-sm text-green-600">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="cusName"
          value={formData.cusName}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="email"
          name="cusEmail"
          value={formData.cusEmail}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
