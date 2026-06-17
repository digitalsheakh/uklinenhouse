import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { wholesaleSchema } from "@/lib/validation";

/**
 * Wholesale / trade account application.
 * Creates a wholesale user (approved = false). Admin reviews and sends the
 * price list; trade customers order by phone (no online checkout).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = wholesaleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, companyName, email, phone, password, businessType, vatNumber } = parsed.data;
    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      companyName,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      businessType: businessType || "",
      vatNumber: vatNumber || "",
      accountType: "wholesale",
      approved: false,
    });

    return NextResponse.json({
      ok: true,
      message:
        "Thank you — your trade account request has been received. We'll review it and send your wholesale price list shortly.",
    });
  } catch (err) {
    console.error("[wholesale]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
