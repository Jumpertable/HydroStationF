"use server";

import { SignJWT, jwtVerify } from "jose"; // newly install jose
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const secretKey = process.env.SECRET;
if (!secretKey) throw new Error("JWT_SECRET is not set"); // must be the same as the backend
const key = new TextEncoder().encode(secretKey);

const TIMEOUT = 3000;

export async function encrypt(payload: Record<string, unknown>) {
    try {
      return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${TIMEOUT} sec`)  // Changed from "sec from now" to just `sec`
        .sign(key);
    } catch (e) {
      console.log("Error in encrypt: ", e);
    }
    return "";
  }
  

  export async function decrypt(input: string): Promise<Record<string, unknown>> {
    try {
      const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
      console.log("payload: 111 ", payload);
      return payload;
    } catch (e) {
      console.error("Failed to decrypt token: ", e);
      return {};
    }
  }
  

interface UserInput {
  businessEmail: string;
  password: string;
}

export async function loginUser(userInput: UserInput, remember: boolean) {
    const { businessEmail, password } = userInput;
    let timeout = TIMEOUT; // default 5 mins
    if (remember) timeout = 24 * 60 * 60; 
    
    const expires = new Date(Date.now() + timeout * 1000);
    const session = await encrypt({ businessEmail, password,  expires });
    
    // Save session to cookie
    (await cookies()).set("access_token", session, {
      expires,
      httpOnly: true,
      path: "/",  // Ensure the cookie is set for the entire app
    });
  
    console.log("after Session  : ", session);
    return { message: "Login Success" };
  }
  

export async function logoutUser() {
 
  (await cookies()).delete("access_token");
  return { message: "Logout Success" };
}

export async function getSession() {
  // const session = (await cookies()).get("session")?.value;
  const session = (await cookies()).get("access_token")?.value;
  if (!session) return null;
  return await decrypt(session);
}

// export async function updateSession(request: NextRequest) {}

export async function updateSession() {
  // const session = request.cookies.get("session")?.value;
  const session = (await cookies()).get("access_token")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + TIMEOUT * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "access_session",
    // secure: true,   // if https is used
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires as Date,
  });
  return res;
}
