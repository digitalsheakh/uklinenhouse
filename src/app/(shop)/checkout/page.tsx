import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/customer-auth";
import { connectDB } from "@/lib/db";
import { User, IUser } from "@/lib/models/User";
import CheckoutClient, { InitialCustomer } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Securely complete your UK Linen House order.",
  alternates: { canonical: "/checkout" },
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  // Prefill the form for signed-in customers.
  let initial: InitialCustomer = {};
  const session = await getCurrentUser();
  if (session) {
    initial = { name: session.name, email: session.email };
    try {
      await connectDB();
      const doc = await User.findById(session.id).lean<IUser>();
      if (doc) {
        const addr = doc.addresses?.find((a) => a.isDefault) || doc.addresses?.[0];
        initial = {
          name: doc.name,
          email: doc.email,
          phone: doc.phone || "",
          address: addr?.line1 || "",
          city: addr?.city || "",
          postcode: addr?.postcode || "",
          country: addr?.country || "United Kingdom",
        };
      }
    } catch {
      // ignore, fall back to token basics
    }
  }

  return <CheckoutClient initial={initial} />;
}
