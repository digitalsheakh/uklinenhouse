import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ admin: null }, { status: 200 });
  return NextResponse.json({ admin });
}
