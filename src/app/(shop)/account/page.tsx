import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/customer-auth";
import { connectDB } from "@/lib/db";
import { User, IUser } from "@/lib/models/User";
import { Order } from "@/lib/models/Order";
import AuthPanel from "@/components/account/AuthPanel";
import AccountDashboard, { AccountUser, AccountOrder } from "@/components/account/AccountDashboard";

export const metadata: Metadata = {
  title: "My Account",
  description:
    "Sign in or create an account to manage your orders, delivery addresses and details with UK Linen House.",
  alternates: { canonical: "/account" },
  robots: { index: false }, // private area, keep out of search results
};

// Reads the auth cookie, so this page must render per-request.
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getCurrentUser();

  // Not signed in → show the sign in / register panel.
  if (!session) {
    return <AuthPanel />;
  }

  // Signed in → load the full profile (and order history) from MongoDB.
  let account: AccountUser | null = null;
  let orders: AccountOrder[] = [];
  try {
    await connectDB();
    const doc = await User.findById(session.id).lean<IUser>();
    if (doc) {
      account = {
        name: doc.name,
        email: doc.email,
        phone: doc.phone || "",
        accountType: doc.accountType,
        companyName: doc.companyName || "",
        approved: doc.approved,
        addresses: (doc.addresses || []).map((a) => ({
          line1: a.line1,
          line2: a.line2,
          city: a.city,
          postcode: a.postcode,
          country: a.country,
        })),
        memberSince: doc.createdAt
          ? new Date(doc.createdAt).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })
          : null,
      };

      // Order history, matched to the customer's email.
      const docs = await Order.find({ "customer.email": doc.email })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
      orders = docs.map((o) => ({
        ref: o.orderNumber || `LN-${String(o._id).slice(-6).toUpperCase()}`,
        date: o.createdAt
          ? new Date(o.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "",
        total: o.total,
        status: o.status,
        paymentStatus: o.paymentStatus,
        itemCount: (o.items || []).reduce((n, i) => n + i.quantity, 0),
        courier: o.courier || "",
        trackingNumber: o.trackingNumber || "",
        trackingUrl: o.trackingUrl || "",
      }));
    }
  } catch {
    // DB unreachable, fall back to the basics carried in the auth token
    // so a signed-in user still sees their account rather than an error.
  }

  if (!account) {
    account = {
      name: session.name,
      email: session.email,
      phone: "",
      accountType: "retail",
      companyName: "",
      approved: true,
      addresses: [],
      memberSince: null,
    };
  }

  return <AccountDashboard user={account} orders={orders} />;
}
