"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./loginUser";
import { NextRequest, NextResponse } from "next/server";

export const token = async () => {
  return (await cookies()).get("access_token")?.value;
};

export async function getUserNameFromToken() {
  try {
    const sessionToken = await token();
    if (!sessionToken) return null;
    const payload = await decrypt(sessionToken);
    console.log("payload: ", payload);
    return payload.username as string;
  } catch (e) {
    console.error("Failed to get user name from token:", e);
    return null;
  }
}

export async function logoutAndRedirect() {
  (await cookies()).delete("access_token");
  redirect("/login");
}

export async function checkCookie(request: NextRequest) {
  const access_token = request.cookies.get("access_token")?.value;
  if (!access_token) return;
  return NextResponse.next();
}
