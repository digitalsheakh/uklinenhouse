import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { getAdmin } from "@/lib/auth";

/** GET /api/admin/orders — all non-abandoned orders, newest first */
export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const orders = await Order.find({ status: { $ne: "abandoned" } })
    .sort({ createdAt: -1 })
    .limit(300)
    .lean();
  return NextResponse.json({ orders: orders.map((o) => ({ ...o, _id: String(o._id) })) });
}
