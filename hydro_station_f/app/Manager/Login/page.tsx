'use client';

import { redirect } from 'next/navigation';
import { useActionState } from 'react';
import loginFormManager from './loginFormManager';

export default function ManagerLoginPage() {
  const [state, action] = useActionState(loginFormManager, {
    error: '',
    message: '',
    data: {
      businessEmail: '',
      password: '',
    },
  });

  const { businessEmail, password } = state.data;

  if (state.message) {
    redirect('/'); // redirect after successful login
  }

 return(<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <form
        action={action}
        className="w-full max-w-md bg-zinc-800 text-white p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">
          Manager Login
        </h1>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-200 mb-1">
            Email
          </label>
          <input
            className="w-full text-black px-3 py-2 rounded-md bg-blue-50 border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            name="businessEmail"
            defaultValue={businessEmail}
            required
            placeholder="johndoe@hydrostation.com"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
            Password
          </label>
          <input
            className="w-full text-black px-3 py-2 rounded-md bg-blue-50 border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            name="password"
            defaultValue={password}
            required
            placeholder="********"
          />
        </div>

        {/* Submit Button */}
        <div className="p-3">
          <button
            className="border-2 px-4 py-2 bg-blue-400 rounded mr-2 hover:bg-blue-700"
            type="submit"
          >
            Login
          </button>
        </div>

        {/* Error Message */}
        {state.error && <div className="text-red-500">{state.error}</div>}
      </form>
    </div>
  );
}
