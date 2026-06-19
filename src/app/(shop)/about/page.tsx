import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, MapPin, Calendar, Clock, Truck } from "lucide-react";
import { siteConfig } from "@/config/site";

const description =
  "UK Linen House is a customer-oriented, family run business established in 2013 in Bedford, supplying premium wet refreshment towels, table linen, kitchen linen, napkins and workwear to laundries, hotels, restaurants and more across the UK.";

export const metadata: Metadata = {
  title: "About UK Linen House | Family-Run Linen Supplier Since 2013",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About UK Linen House", description, type: "website" },
};

// Image paths (the folder name contains spaces, so they are URL-encoded).
const IMG = {
  hero: "/About%20Us%20Images/uk-linen-house-about-us-image.png",
  beginnings: "/About%20Us%20Images/uk-linen-house-about-images.png",
  fleet: "/fleet-image/uk-linen-house-fleet.png",
  cotton: "/About%20Us%20Images/uk-linen-house-cotton-tree.png",
};

const stats = [
  { icon: Calendar, value: "Since 2013", label: "Family run" },
  { icon: MapPin, value: "Bedford", label: "Heart of Bedfordshire" },
  { icon: Clock, value: "24/7", label: "Service to fit you" },
  { icon: Truck, value: "Nationwide", label: "Delivered across the UK" },
];

export default function AboutPage() {
  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent">
              Our Story
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Quality linen, trusted by UK businesses since 2013
            </h1>
            <p className="mt-5 max-w-xl text-grey-600">
              UK Linen House is a customer-oriented, family run business established in 2013. We are
              situated in the heart of Bedfordshire, in the countryside town of Bedford. What began as a
              simple idea has grown into a trusted name in linen and laundry supplies across the country.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Shop the range <ArrowRight size={16} />
              </Link>
              <Link
                href="/brochure"
                className="inline-flex items-center gap-2 rounded-lg border border-grey-300 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-grey-50"
              >
                <BookOpen size={16} /> View our brochure
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-grey-200 bg-[#f3f1ee]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.hero} alt="UK Linen House premium linen" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* ---- Stats band ---- */}
      <section className="border-y border-grey-200 bg-grey-50">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent">
                <s.icon size={22} />
              </span>
              <p className="mt-3 text-lg font-semibold text-foreground">{s.value}</p>
              <p className="text-sm text-grey-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Our Beginnings ---- */}
      <StorySection title="Our beginnings" image={IMG.beginnings} imageAlt="UK Linen House products">
        <p>
          We started our journey wholesaling refreshment wet towels for laundries. With early success,
          our product line grew quickly and we became able to provide the best quality laundry items to
          our customers.
        </p>
        <p>
          Today we specialise in wholesaling wet refreshment towels alongside kitchen workwear, table
          linen, kitchen linen and napkins. We deliver laundry products throughout the UK for laundry
          service providers, and we are always happy to accept retail orders too.
        </p>
      </StorySection>

      {/* ---- Our Mission ---- */}
      <StorySection title="Our mission" image={IMG.fleet} imageAlt="UK Linen House delivery fleet" reverse muted>
        <p>
          UK Linen House is a customer-oriented and innovative company, dedicated to providing excellent
          quality products while saving our customers money.
        </p>
        <p>
          Since 2013 we have built a significant customer base, serving everyone from small owner
          operators right up to multinational groups, including hotels, restaurants, laundries,
          engineering companies and healthcare providers. Our service runs around the clock to satisfy
          your needs, helping your business exceed your own customers&apos; expectations. Our customers are
          the main reason for our success, and we want to thank them for being part of the journey.
        </p>
      </StorySection>

      {/* ---- Our Goals ---- */}
      <StorySection title="Our goals" image={IMG.cotton} imageAlt="Cotton, the heart of our products">
        <p>
          UK Linen House has achieved a great deal through commitment and passion. Our goal is simple: to
          reach the highest levels of quality by exploring new horizons in technology and materials. So if
          your company has a textile requirement, UK Linen House is the right partner for you.
        </p>
        <p>
          We are continually exploring new services and products to help our customers become more
          successful, while always improving the services we already offer.
        </p>
      </StorySection>

      {/* ---- Closing CTA ---- */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-accent px-6 py-12 text-center text-white sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Let&apos;s work together</h2>
          <p className="mx-auto max-w-lg text-sm text-white/80">
            Whether you run a single site or a multinational group, our team is ready to help with quality
            linen, towels and workwear, delivered nationwide with our own fleet.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/wholesale"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-grey-100"
            >
              Trade enquiry <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contact us
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-grey-400">
          {siteConfig.name} · Family run business established 2013 · Bedford, Bedfordshire · Company
          registration number 15946655
        </p>
      </section>
    </div>
  );
}

function StorySection({
  title,
  image,
  imageAlt,
  children,
  reverse,
  muted,
}: {
  title: string;
  image: string;
  imageAlt: string;
  children: React.ReactNode;
  reverse?: boolean;
  muted?: boolean;
}) {
  return (
    <section className={muted ? "bg-grey-50" : ""}>
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
        <div className={`overflow-hidden rounded-3xl border border-grey-200 bg-[#f3f1ee] ${reverse ? "lg:order-2" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
        </div>
        <div className={reverse ? "lg:order-1" : ""}>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-grey-600">{children}</div>
        </div>
      </div>
    </section>
  );
}
