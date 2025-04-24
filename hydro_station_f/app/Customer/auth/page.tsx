"use client";

import { useState } from "react";

export default function CustomerAuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    cusName: "",
    cusEmail: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setForm({ cusName: "", cusEmail: "", password: "" });
    setMessage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = mode === "register" ? "register" : "login";

    try {
      const res = await fetch(`http://localhost:3100/customer/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setMessage(`✅ ${data.message}`);
      if (data.cusID) {
        localStorage.setItem("cusID", data.cusID);
        localStorage.setItem("cusName", data.cusName);
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === "login" ? "Customer Login" : "Customer Registration"}
        </h1>

        {message && (
          <p className="mb-4 text-center text-sm font-medium text-green-600">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              name="cusName"
              placeholder="Name"
              value={form.cusName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          )}

          <input
            type="email"
            name="cusEmail"
            placeholder="Email"
            value={form.cusEmail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button onClick={toggleMode} className="text-blue-500 underline">
            {mode === "login" ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}
