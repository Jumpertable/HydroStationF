"use server";

import { SERVER_URL } from "@/app/constant"

export default async function registerManager(
  prevState: unknown,
  formData: FormData
) {
  const data = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    businessEmail: formData.get("businessEmail"),
    companyAddress: formData.get("companyAddress"),
    password: formData.get("password"),
  };

  const res = await fetch(`${SERVER_URL}/auth/manager/regist`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();

  if (res.ok) {
    console.log("Register successfully", json);
    return {
      error: "",
      message: "Register successfully",
      data,
    };
  } else {
    console.error("Error Register:", json);
    return {
      error: "Error Register",
      message: "",
      data,
    };
  }
}
