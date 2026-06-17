import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
export const USER_COOKIE = "ulh_user";

export interface UserTokenPayload {
  id: string;
  email: string;
  name: string;
}

export function signUserToken(payload: UserTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyUserToken(token: string): UserTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserTokenPayload;
  } catch {
    return null;
  }
}

/** Read & verify the logged-in customer from the request cookie. */
export async function getCurrentUser(): Promise<UserTokenPayload | null> {
  const store = await cookies();
  const token = store.get(USER_COOKIE)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

/** Standard cookie options for auth cookies. */
export function authCookieOptions(maxAgeDays: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeDays * 24 * 60 * 60,
  };
}
