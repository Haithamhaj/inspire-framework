import { Link } from "wouter";
import { useI18n } from "@/i18n";
import { localizePath } from "@/lib/locale-paths";

const legalLinks = [
  { href: "/pricing", label: "Pricing", labelAr: "الأسعار" },
  { href: "/guides", label: "Guides", labelAr: "الأدلة" },
  { href: "/about", label: "About", labelAr: "عن INSPIRE" },
  { href: "/research", label: "Research", labelAr: "البحث" },
  { href: "/contact", label: "Contact", labelAr: "تواصل معنا" },
  { href: "/terms", label: "Terms", labelAr: "الشروط" },
  { href: "/privacy", label: "Privacy", labelAr: "الخصوصية" },
  { href: "/refund-policy", label: "Refund Policy", labelAr: "سياسة الاسترداد" },
];

export function LegalFooter() {
  const { locale, dir } = useI18n();
  const isAr = locale === "ar";

  return (
    <footer className="border-t border-slate-400/10 bg-[#070817] px-4 py-7 text-slate-400 sm:px-6 lg:px-8" dir={dir}>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-slate-500">© 2026 INSPIRE Framework</p>
        <nav aria-label={isAr ? "روابط الموقع" : "Legal links"} className="flex flex-wrap gap-x-5 gap-y-2">
          {legalLinks.map((link) => (
            <Link key={link.href} href={localizePath(link.href, locale)} className="font-bold transition-colors hover:text-rose-200">
              {isAr ? link.labelAr : link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
