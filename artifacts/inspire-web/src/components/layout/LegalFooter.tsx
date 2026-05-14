import { Link } from "wouter";

const legalLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund-policy", label: "Refund Policy" },
];

export function LegalFooter() {
  return (
    <footer className="border-t border-slate-400/10 bg-[#070817] px-4 py-7 text-slate-400 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-slate-500">© 2026 INSPIRE Framework</p>
        <nav aria-label="Legal links" className="flex flex-wrap gap-x-5 gap-y-2">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-bold transition-colors hover:text-rose-200">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
