"use server";

import { SERVER_URL } from "../../constant";

export default async function createEmp(
  prevState: unknown,
  formData: FormData
) {
  const data = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    businessEmail: formData.get("businessEmail"),
    password: formData.get("password"),
    manager_id: formData.get("manager_id"),
  };

  const res = await fetch(`${SERVER_URL}/manager/:id/create-employee`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();

  if (res.ok) {
    console.log("Employee created successfully", json);
    return {
      error: "",
      message: "Employee created successfully",
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
