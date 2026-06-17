import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { loginSchema } from "@/lib/validation";
import { signUserToken, USER_COOKIE, authCookieOptions } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signUserToken({ id: String(user._id), email: user.email, name: user.name });
    const res = NextResponse.json({
      user: { id: String(user._id), name: user.name, email: user.email },
    });
    res.cookies.set(USER_COOKIE, token, authCookieOptions(30));
    return res;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
