import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Contact Us</h1>
      <p className="mt-3 text-grey-600">
        We&apos;d love to hear from you — for orders, trade enquiries or support.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <a href={`mailto:${siteConfig.email}`} className="rounded-2xl border border-grey-200 p-5 hover:border-grey-300">
          <Mail size={20} className="text-foreground" />
          <p className="mt-3 text-sm font-semibold text-foreground">Email</p>
          <p className="mt-1 text-sm text-grey-500 break-all">{siteConfig.email}</p>
        </a>
        <a href={`tel:${siteConfig.phone}`} className="rounded-2xl border border-grey-200 p-5 hover:border-grey-300">
          <Phone size={20} className="text-foreground" />
          <p className="mt-3 text-sm font-semibold text-foreground">Phone</p>
          <p className="mt-1 text-sm text-grey-500">{siteConfig.phone}</p>
        </a>
        <div className="rounded-2xl border border-grey-200 p-5">
          <MapPin size={20} className="text-foreground" />
          <p className="mt-3 text-sm font-semibold text-foreground">Address</p>
          <p className="mt-1 text-sm text-grey-500">{siteConfig.address}</p>
        </div>
      </div>
    </div>
  );
}
