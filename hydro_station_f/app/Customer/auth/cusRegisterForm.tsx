'use client';
import { useState } from 'react';

export default function CustomerRegisterForm() {
  const [form, setForm] = useState({
    cusName: '',
    cusEmail: '',
    cusPhone: '',
    cusAddr: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3100/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setMessage(`✅ ${data.message || "Registration successful!"}`);      
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="cusName"
        placeholder="Name"
        value={form.cusName}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="email"
        name="cusEmail"
        placeholder="Email"
        value={form.cusEmail}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="tel"
        name="cusPhone"
        placeholder="Phone Number"
        value={form.cusPhone}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="text"
        name="cusAddr"
        placeholder="Address"
        value={form.cusAddr}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded"
      />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Register
      </button>

      {message && (
        <div className="text-center text-sm mt-2 font-medium text-green-700">{message}</div>
      )}
    </form>
  );
}
