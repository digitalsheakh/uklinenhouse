import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, BookOpen, ArrowRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import { siteConfig } from "@/config/site";
import { CategoryNode } from "@/lib/data";

export default function Footer({ categories }: { categories: CategoryNode[] }) {
  const year = new Date().getFullYear();
  const topCats = categories.slice(0, 6);

  return (
    <footer className="mt-20 border-t border-grey-200 bg-grey-50">

      {/* ── Request Brochure band ─────────────────────────────────────── */}
      <div className="border-b border-grey-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:px-6 sm:flex-row">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent">
              <BookOpen size={22} />
            </span>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Request Our Product Brochure
              </h3>
              <p className="mt-0.5 max-w-md text-sm text-grey-500">
                Get our full catalogue of premium linen, towels and workwear sent directly to
                your inbox. Free, no obligation.
              </p>
            </div>
          </div>
          <Link
            href="/request-brochure"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Request Brochure
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* ── Main footer grid ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label={siteConfig.name} className="inline-flex items-center gap-2.5">
              <Image
                src="/linen-house-logo.png"
                alt={siteConfig.name}
                width={72}
                height={48}
                className="h-12 w-auto object-contain"
              />
              <span className="flex flex-col leading-none">
                <span className="text-base font-semibold tracking-[0.18em] text-foreground">
                  UK LINEN
                </span>
                <span className="text-[0.6rem] font-medium tracking-[0.42em] text-grey-500">
                  H O U S E
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-grey-500">{siteConfig.description}</p>
            <div className="mt-4 flex gap-3">
              {siteConfig.social.facebook && (
                <a href={siteConfig.social.facebook} className="text-grey-400 hover:text-foreground">
                  <FaFacebookF size={16} />
                </a>
              )}
              {siteConfig.social.instagram && (
                <a href={siteConfig.social.instagram} className="text-grey-400 hover:text-foreground">
                  <FaInstagram size={16} />
                </a>
              )}
              {siteConfig.social.twitter && (
                <a href={siteConfig.social.twitter} className="text-grey-400 hover:text-foreground">
                  <FaXTwitter size={16} />
                </a>
              )}
              {siteConfig.social.linkedin && (
                <a href={siteConfig.social.linkedin} className="text-grey-400 hover:text-foreground">
                  <FaLinkedinIn size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Shop</h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/shop" className="text-sm text-grey-500 hover:text-foreground">
                  All Products
                </Link>
              </li>
              {topCats.map((c) => (
                <li key={c._id}>
                  <Link href={`/shop/${c.slug}`} className="text-sm text-grey-500 hover:text-foreground">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/about" className="text-sm text-grey-500 hover:text-foreground">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-grey-500 hover:text-foreground">Contact</Link></li>
              <li><Link href="/request-brochure" className="text-sm font-medium text-accent hover:text-accent-hover">Request Brochure</Link></li>
              <li><Link href="/brochure" className="text-sm text-grey-500 hover:text-foreground">View Brochure</Link></li>
              <li><Link href="/compliance-report" className="text-sm text-grey-500 hover:text-foreground">Compliance Report</Link></li>
              <li><Link href="/delivery-policy" className="text-sm text-grey-500 hover:text-foreground">Delivery Policy</Link></li>
              <li><Link href="/return-and-refund-policy" className="text-sm text-grey-500 hover:text-foreground">Return &amp; Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Get in touch</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-grey-500">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-foreground">
                  <Mail size={15} /> {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 hover:text-foreground">
                  <Phone size={15} /> {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0" /> {siteConfig.address}
              </li>
            </ul>

            {/* Mini brochure CTA */}
            <Link
              href="/request-brochure"
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-grey-300 bg-white px-3 py-2 text-xs font-semibold text-grey-700 transition-colors hover:border-accent hover:text-accent"
            >
              <BookOpen size={13} /> Request our brochure
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-grey-200 pt-6 sm:flex-row">
          <p className="text-xs text-grey-400">
            &copy; {year} {siteConfig.name}. All rights reserved. Company Reg. 15946655
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-grey-400">
            <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms-of-using-our-website" className="hover:text-foreground">Website T&amp;Cs</Link>
            <Link href="/terms-for-online-shopping" className="hover:text-foreground">Online Shopping T&amp;Cs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
