"use client";

import Link from "next/link";
import { useState } from "react";

export default function CustomerAuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    cusName: "",
    cusEmail: "",
    cusPhone: "",
    cusAddr: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setForm({ cusName: "", cusEmail: "", cusPhone: "", cusAddr: "", password: "" });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6 text-blue-900">
      <div className="bg-white/90 p-8 rounded-2xl shadow-2xl border border-blue-200 w-full max-w-md transition-all">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6 drop-shadow">
          {mode === "login" ? "🔐 Customer Login" : "📝 Customer Registration"}
        </h1>

        {message && (
          <p className="mb-4 text-center text-sm font-medium text-green-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <input
                type="text"
                name="cusName"
                placeholder="Full Name"
                value={form.cusName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />

              <input
                type="tel"
                name="cusPhone"
                placeholder="Phone Number"
                value={form.cusPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />

              <input
                type="text"
                name="cusAddr"
                placeholder="Address"
                value={form.cusAddr}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </>
          )}

          <input
            type="email"
            name="cusEmail"
            placeholder="Email"
            value={form.cusEmail}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-full shadow hover:from-blue-500 hover:to-blue-700 transition-all"
          >
            {mode === "login" ? "🔓 Login" : "📝 Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-blue-700">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-blue-600 underline hover:text-blue-800 transition"
          >
            {mode === "login" ? "Register here" : "Login here"}
          </button>
        </p>

        {/* Back to Store Button */}
        <div className="mt-6 text-center">
          <Link href="/Customer/Store">
            <button className="px-5 py-2 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 text-blue-900 font-semibold rounded-full shadow hover:from-blue-300 hover:to-blue-500 hover:text-white transition-all duration-200">
               ⬅️Back to Store
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
