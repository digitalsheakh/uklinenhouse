import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { getAdmin } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

const VALID_STATUSES = [
  "pending", "awaiting_payment", "paid", "processing", "shipped", "completed", "cancelled",
];
const VALID_COURIERS = ["evri", "parcelforce", "dpd", "other", ""];

/** PATCH /api/admin/orders/[id] — update status, tracking, admin notes */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    const body = await req.json();
    const update: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status))
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      update.status = body.status;
    }
    if (body.paymentStatus !== undefined) {
      if (!["unpaid", "paid", "refunded"].includes(body.paymentStatus))
        return NextResponse.json({ error: "Invalid paymentStatus" }, { status: 400 });
      update.paymentStatus = body.paymentStatus;
    }
    if (body.courier !== undefined) {
      if (!VALID_COURIERS.includes(body.courier))
        return NextResponse.json({ error: "Invalid courier" }, { status: 400 });
      update.courier = body.courier;
    }
    if (body.trackingNumber !== undefined) update.trackingNumber = String(body.trackingNumber).trim();
    if (body.trackingUrl !== undefined)    update.trackingUrl    = String(body.trackingUrl).trim();
    if (body.adminNotes   !== undefined)   update.adminNotes     = String(body.adminNotes).trim();

    await connectDB();
    const order = await Order.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ ok: true, order });
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

/** GET /api/admin/orders/[id] — single order detail */
export async function GET(_req: NextRequest, { params }: Ctx) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await connectDB();
  const order = await Order.findById(id).lean();
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order: { ...order, _id: String(order._id) } });
}
