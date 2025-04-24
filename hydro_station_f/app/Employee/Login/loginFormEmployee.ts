"use server";
import { token } from "@/utils/manageCookie";
import { cookies } from "next/headers";
import { SERVER_URL } from "@/app/constant";

export default async function loginFormEmployee(
  prevState: unknown,
  formData: FormData
) {
  const data = {
    businessEmail: formData.get("businessEmail") as string,
    password: formData.get("password") as string,
    manager_code: formData.get("manager_code") as string,
  };
  console.log("data: ", data);

  const res = await fetch(`${SERVER_URL}/employee/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      businessEmail: data.businessEmail,
      password: data.password,
    }),
  });

  const json = await res.json();
  console.log("json: ", json);

  if (res.ok) {
    console.log("Login successfully");

    // Store token in secure, HttpOnly cookie
    (await cookies()).set({
      name: "access_token",
      value: json.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    console.log("Token set in cookie:", await token());

    return {
      error: "",
      message: "Login successfully",
      data,
    };
  } else {
    console.error("Error Login:", json);
    return {
      error: "Error Login",
      message: json.message || "Error logging in",
      data,
    };
  }
}
