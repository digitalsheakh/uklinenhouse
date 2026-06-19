import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import { siteConfig } from "@/config/site";
import { CategoryNode } from "@/lib/data";

export default function Footer({ categories }: { categories: CategoryNode[] }) {
  const year = new Date().getFullYear();
  const topCats = categories.slice(0, 6);

  return (
    <footer className="mt-20 border-t border-grey-200 bg-grey-50">
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
              <li><Link href="/brochure" className="text-sm text-grey-500 hover:text-foreground">Brochure</Link></li>
              <li><Link href="/compliance-report" className="text-sm text-grey-500 hover:text-foreground">Compliance Report</Link></li>
              <li><Link href="/delivery-policy" className="text-sm text-grey-500 hover:text-foreground">Delivery Policy</Link></li>
              <li><Link href="/return-and-refund-policy" className="text-sm text-grey-500 hover:text-foreground">Return &amp; Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Get in touch</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-grey-500">
              <li className="flex items-center gap-2"><Mail size={15} /> {siteConfig.email}</li>
              <li className="flex items-center gap-2"><Phone size={15} /> {siteConfig.phone}</li>
              <li className="flex items-center gap-2"><MapPin size={15} /> {siteConfig.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-grey-200 pt-6 sm:flex-row">
          <p className="text-xs text-grey-400">© {year} {siteConfig.name}. All rights reserved.</p>
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
