'use client';

import { redirect } from 'next/navigation';
import { useActionState } from 'react';
import loginFormEmployee from './loginFormEmployee';

export default function EmployeeLoginPage() {
  const [state, action] = useActionState(loginFormEmployee, {
    error: '',
    message: '',
    data: {
      businessEmail: '',
    password: '',
      manager_code:'',
    },
  });

  const { businessEmail, password, manager_code } = state.data;

  if (state.message) {
    redirect('/Employee/'); // redirect after successful login
  }

  return (
<div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
  <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
    <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Employee Login</h1>

    {state.message && (
      <div className={`mb-4 p-2 rounded ${state.message.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {state.message}
      </div>
    )}

    <form action={action}>
      {/* Email */}
      <div className="mb-4">
        <label htmlFor="businessEmail" className="block text-gray-700 text-sm font-bold mb-2">
          Business Email
        </label>
        <input
          type="email"
          id="businessEmail"
          name="businessEmail"
          defaultValue={businessEmail}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="johndoe@hydrostation.com"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          defaultValue={password}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="********"
        />
      </div>

      {/* Manager Code */}
      <div className="mb-6">
        <label htmlFor="manager_code" className="block text-gray-700 text-sm font-bold mb-2">
          Manager Code
        </label>
        <input
          type="text"
          id="manager_code"
          name="manager_code"
          defaultValue={manager_code}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="HTH12"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</div>

  );
}
