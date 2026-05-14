import { Link } from "wouter";
import { ArrowRight, Linkedin, Mail, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";
import { localizePath } from "@/lib/locale-paths";

const supportEmail = "Haitham.haj@gmail.com";
const linkedInUrl = "https://www.linkedin.com/in/haithamhaj/";

export default function Contact() {
  const { locale, dir } = useI18n();
  const isAr = locale === "ar";
  const href = (path: string) => localizePath(path, locale);
  const copy = isAr
    ? {
        eyebrow: "تواصل معنا",
        title: "تواصل مع INSPIRE Framework",
        intro: "للاستفسارات عن المنتج، الدعم، أو مراجعة الطلبات، يمكنك التواصل مع فريق INSPIRE عبر البريد الإلكتروني.",
        support: "بريد الدعم",
        linkedIn: "حساب LinkedIn",
        supportHint: "اكتب البريد المستخدم في التقييم إذا كان سؤالك متعلقاً بتقرير أو حساب.",
        notes: [
          "INSPIRE منتج رقمي ذاتي يقدم تقييمات وتقارير عبر الموقع.",
          "التقرير الكامل يصل رقمياً بعد إكمال المسار وتفعيل الوصول.",
          "المخرجات مصممة لدعم الإنتاجية وبناء تعليمات أفضل للذكاء الاصطناعي.",
        ],
        beforeTitle: "ابدأ من المسار الأنسب",
        beforeBody:
          "يمكنك تجربة التقييم السريع المجاني، مراجعة الأسعار، أو الاطلاع على الشروط وسياسة الخصوصية من الروابط أسفل الصفحة.",
        quick: "جرّب التقييم السريع المجاني",
        pricing: "عرض الأسعار",
      }
    : {
        eyebrow: "Contact",
        title: "Contact INSPIRE Framework",
        intro: "For product questions, support, billing questions, or review inquiries, contact the INSPIRE team by email.",
        support: "Support email",
        linkedIn: "LinkedIn profile",
        supportHint: "Include the email used for your assessment if your question is about a report or account.",
        notes: [
          "INSPIRE is a self-serve digital product for online assessments and reports.",
          "The full report is delivered digitally after completion and access activation.",
          "Outputs are designed to support productivity and better AI instructions.",
        ],
        beforeTitle: "Choose the path that fits your next step",
        beforeBody:
          "You can try the free quick assessment, review pricing, or use the footer links for terms and privacy details.",
        quick: "Try the free quick assessment",
        pricing: "View pricing",
      };

  return (
    <div className="min-h-screen bg-[#070817] px-4 py-14 text-slate-100 sm:px-6 lg:px-8" dir={dir}>
      <div className="mx-auto max-w-4xl">
        <header>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-100">
            <Sparkles className="h-4 w-4" />
            {copy.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-black tracking-normal text-white sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            {copy.intro}
          </p>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
            <Mail className="mb-4 h-6 w-6 text-rose-200" />
            <h2 className="text-2xl font-black text-white">{copy.support}</h2>
            <a
              href={`mailto:${supportEmail}`}
              className="mt-3 inline-flex text-lg font-black text-rose-200 hover:text-rose-100"
            >
              {supportEmail}
            </a>
            <p className="mt-4 text-base leading-8 text-slate-300">
              {copy.supportHint}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-6">
            <Linkedin className="mb-4 h-6 w-6 text-rose-200" />
            <h2 className="text-2xl font-black text-white">{copy.linkedIn}</h2>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-lg font-black text-rose-200 hover:text-rose-100"
              dir="ltr"
            >
              linkedin.com/in/haithamhaj
            </a>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          {copy.notes.map((note) => (
            <div key={note} className="rounded-2xl border border-slate-400/10 bg-slate-950/45 p-5">
              <ShieldCheck className="mb-4 h-5 w-5 text-rose-200" />
              <p className="text-sm leading-7 text-slate-300">{note}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] p-6">
          <MessageSquare className="mb-4 h-6 w-6 text-rose-200" />
          <h2 className="text-2xl font-black text-white">{copy.beforeTitle}</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            {copy.beforeBody}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href={href("/assess/mini")} className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-400">
              {copy.quick}
            </Link>
            <Link href={href("/pricing")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-400/15 bg-slate-950/65 px-5 py-3 text-sm font-black text-white hover:border-rose-300/30">
              {copy.pricing}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
