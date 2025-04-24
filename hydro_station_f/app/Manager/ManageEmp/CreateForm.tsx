'use client';

import { useState } from 'react';
import { createEmployee } from './api';


export default function CreateEmployeeForm({ managerId }: { managerId: number }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    businessEmail: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEmployee({ ...formData, manager_id: managerId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Create Employee</h2>
      {['first_name', 'last_name', 'businessEmail', 'password'].map((field) => (
        <input
          key={field}
          type={field === 'password' ? 'password' : 'text'}
          name={field}
          placeholder={field.replace('_', ' ')}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          required
        />
      ))}
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Create
      </button>
    </form>
  );
}
