import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import ContactForm from "@/components/contact/ContactForm";

const description =
  "Contact UK Linen House for premium towels, table, bath and bed linen, bags and workwear. We supply laundries, hotels, Airbnb hosts, restaurants and more across the UK. Message us by WhatsApp, email or phone.";

export const metadata: Metadata = {
  title: "Contact UK Linen House | Linen Supplier for Hotels, Laundries & Airbnb",
  description,
  keywords: [
    "linen supplier UK",
    "wholesale towels",
    "hotel linen supplier",
    "laundry linen supplier",
    "Airbnb linen",
    "restaurant table linen",
    "bath linen wholesale",
    "workwear supplier UK",
    "contact UK Linen House",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact UK Linen House",
    description,
    type: "website",
  },
};

// Structured data so search engines understand who we are and how to reach us.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  description,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  areaServed: "GB",
  address: { "@type": "PostalAddress", addressCountry: "GB", addressLocality: siteConfig.address },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: siteConfig.email,
    telephone: siteConfig.phone,
    areaServed: "GB",
    availableLanguage: "English",
  },
};

const whatsappLink = `https://wa.me/${siteConfig.whatsapp}`;

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Contact UK Linen House
        </h1>
        <p className="mt-3 text-grey-600">
          We&apos;d love to hear from you about orders, trade enquiries or support. As a UK linen and
          towel supplier, we work with laundries, hotels, Airbnb hosts, restaurants, cafes, spas and
          households across the country, delivered nationwide with our own fleet.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {/* Contact details */}
        <div className="space-y-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 rounded-2xl border border-grey-200 p-5 transition-colors hover:border-[#25D366]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
              <MessageCircle size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">WhatsApp us directly</p>
              <p className="mt-1 text-sm text-grey-500">Tap to start a chat. Fastest way to reach our team.</p>
            </div>
          </a>

          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-start gap-4 rounded-2xl border border-grey-200 p-5 transition-colors hover:border-grey-300"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-grey-100 text-foreground">
              <Mail size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Email</p>
              <p className="mt-1 break-all text-sm text-grey-500">{siteConfig.email}</p>
            </div>
          </a>

          <a
            href={`tel:${siteConfig.phone}`}
            className="flex items-start gap-4 rounded-2xl border border-grey-200 p-5 transition-colors hover:border-grey-300"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-grey-100 text-foreground">
              <Phone size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Phone</p>
              <p className="mt-1 text-sm text-grey-500">{siteConfig.phone}</p>
            </div>
          </a>

          <div className="flex items-start gap-4 rounded-2xl border border-grey-200 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-grey-100 text-foreground">
              <MapPin size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Based in</p>
              <p className="mt-1 text-sm text-grey-500">{siteConfig.address}</p>
            </div>
          </div>
        </div>

        {/* Message form */}
        <ContactForm />
      </div>

      {/* SEO copy: who we supply */}
      <div className="mt-14 rounded-2xl bg-grey-50 p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Who we supply</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-grey-600">
          UK Linen House is a trusted supplier of premium cotton towels, table linen, bath linen, bed
          linen, bags and workwear. We support businesses of every size with reliable, quality stock and
          fast UK delivery, including:
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-grey-600 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Commercial laundries",
            "Hotels and B&Bs",
            "Airbnb and serviced lets",
            "Restaurants and cafes",
            "Spas and salons",
            "Airlines and hospitality",
          ].map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
