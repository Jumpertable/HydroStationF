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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        action={action}
        className="w-full max-w-md bg-zinc-900 text-white p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-2xl font-bold text-orange-500 mb-6 text-center">
          Manager Register
        </h1>

        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            className="w-full text-black px-2 p-2 rounded bg-blue-50 border-2 border-black"
            type="text"
            name="first_name"
          />
        </div>

        <div>
          <label htmlFor="last_name">Last Name</label>
          <input
            className="w-full text-black px-2 p-2 rounded bg-blue-50 border-2 border-black"
            type="text"
            name="last_name"
          />
        </div>

        <div>
          <label htmlFor="businessEmail">Email</label>
          <input
            className="w-full text-black px-2 p-2 rounded bg-blue-50 border-2 border-black"
            type="email"
            name="businessEmail"
            required
          />
        </div>

        <div>
          <label htmlFor="companyAddress">Company Address</label>
          <input
            className="w-full text-black px-2 p-2 rounded bg-blue-50 border-2 border-black"
            type="text"
            name="companyAddress"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            className="w-full text-black px-2 p-2 rounded bg-blue-50 border-2 border-black"
            type="password"
            name="password"
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
