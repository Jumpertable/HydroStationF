"use client";

import { useActionState } from "react";
import registerManager from "./registerManager";
import { redirect } from "next/navigation";

export default function RegisterManager() {
  const [state, action] = useActionState(registerManager, {
    error: "",
    message: "",
    data: {
      first_name: "",
      last_name: "",
      businessEmail: "",
      companyAddress: "",
      password: "",
    },
  });

  if (state.message) {
    console.log("Register successfully");
    redirect("/Manager/");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
  <form
    action={action}
    className="w-full max-w-md bg-zinc-800 text-white p-8 rounded-2xl shadow-xl"
  >
    <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">
      Manager Register
    </h1>

    {/* First Name */}
    <div className="mb-4">
      <label htmlFor="first_name" className="block text-sm font-medium text-gray-200 mb-1">
        First Name
      </label>
      <input
        className="w-full text-black px-3 py-2 rounded-md bg-blue-50 border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="first_name"
        required
        placeholder="John"
      />
    </div>

    {/* Last Name */}
    <div className="mb-4">
      <label htmlFor="last_name" className="block text-sm font-medium text-gray-200 mb-1">
        Last Name
      </label>
      <input
        className="w-full text-black px-3 py-2 rounded-md bg-blue-50 border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="last_name"
        required
        placeholder="Doe"
      />
    </div>

    {/* Email */}
    <div className="mb-4">
      <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-200 mb-1">
        Email
      </label>
      <input
        className="w-full text-black px-3 py-2 rounded-md bg-blue-50 border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="email"
        name="businessEmail"
        required
        placeholder="johndoe@hydrostation.com"
      />
    </div>

    {/* Company Address */}
    <div className="mb-4">
      <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-200 mb-1">
        Company Address
      </label>
      <input
        className="w-full text-black px-3 py-2 rounded-md bg-blue-50 border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="companyAddress"
        placeholder="kitty@hydrstation.th"
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
        required
        placeholder="********"
      />
    </div>

        <div className="p-3">
          <button
            className="border-2 px-4 py-2 bg-blue-400 rounded mr-2 hover:bg-blue-700"
            type="submit"
          >
            Register
          </button>
        </div>
        {state.error && <div className="text-red-500">{state.error}</div>}
      </form>
    </div>
  );
}
