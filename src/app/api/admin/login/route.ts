import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Admin } from "@/lib/models/Admin";
import { loginSchema } from "@/lib/validation";
import { signAdminToken, ADMIN_COOKIE } from "@/lib/auth";
import { authCookieOptions } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = parsed.data;
    await connectDB();

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signAdminToken({ id: String(admin._id), email: admin.email });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, authCookieOptions(7));
    return res;
  } catch (err) {
    console.error("[admin login]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
