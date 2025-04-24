'use client';

import { useState, useEffect } from 'react';
import { updateEmployee, getEmployees } from './api';

export default function EditEmployeeForm({ employeeId, onComplete }: { employeeId: number, onComplete?: () => void }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    businessEmail: '',
    password: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const employees = await getEmployees(1); // Replace `1` with dynamic manager_id if needed
      const emp = employees.find((e: any) => e.id === employeeId);
      if (emp) {
        setFormData({
          first_name: emp.first_name,
          last_name: emp.last_name,
          businessEmail: emp.businessEmail,
          password: '', // Keep empty unless you want to reset it
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
    await updateEmployee(employeeId, formData);
    if (onComplete) onComplete(); // optional callback after update
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Edit Employee</h2>
      {['first_name', 'last_name', 'businessEmail', 'password'].map((field) => (
        <input
          key={field}
          type={field === 'password' ? 'password' : 'text'}
          name={field}
          value={(formData as any)[field]}
          onChange={handleChange}
          placeholder={field.replace('_', ' ')}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          required={field !== 'password'} // password optional
        />
      ))}
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
        Update Employee
      </button>
    </form>
  );
}
