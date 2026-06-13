import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, MessageCircle, Instagram, Phone, Sparkles, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import { translations as t, links } from "@/lib/i18n";
import { SiteShell, SectionHeader, useTr } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { HeroSearch } from "@/features/home/components/HeroSearch";
import { BrowseByBrand } from "@/features/home/components/BrowseByBrand";
import { BrowseByBodyType } from "@/features/home/components/BrowseByBodyType";
import { FeaturedCars } from "@/features/home/components/FeaturedCars";
import { NewArrivals } from "@/features/home/components/NewArrivals";
import { WhyUs } from "@/features/home/components/WhyUs";
import { Faq } from "@/features/home/components/Faq";
import {
  carFiltersQueryOptions,
  featuredCarsQueryOptions,
  latestCarsQueryOptions,
} from "@/lib/api/queries";

export const Route = createFileRoute("/")({
  component: Index,
  loader: ({ context }) => {
    // Warm the caches the homepage renders so the first paint has data.
    void context.queryClient.prefetchQuery(carFiltersQueryOptions());
    void context.queryClient.prefetchQuery(featuredCarsQueryOptions(8));
    void context.queryClient.prefetchQuery(latestCarsQueryOptions(8));
  },
  head: () => ({
    meta: [
      { title: "AL MELAZ MOTORS — معرض سيارات | Car Marketplace" },
      {
        name: "description",
        content:
          "AL MELAZ MOTORS — تصفح وابحث عن سيارتك القادمة. معرض سيارات احترافي مع مواصفات وأسعار وصور حقيقية.",
      },
      { property: "og:title", content: "AL MELAZ MOTORS" },
      { property: "og:description", content: "تصفح وابحث عن سيارتك القادمة مع AL MELAZ MOTORS." },
    ],
  }),
});

function Index() {
  const { lang, tr } = useTr();

  return (
    <SiteShell>
      {/* HERO + SEARCH */}
      <section id="home" className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 lg:pt-40">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="light-streak top-1/4 w-1/2 left-0 animate-streak"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="light-streak top-2/3 w-1/3 left-1/2 animate-streak"
            style={{ animationDelay: "3s" }}
          />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/20 blur-[140px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-5 relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="relative animate-fade-up">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse-glow" />
              <img
                src={logo}
                alt="AL MELAZ MOTORS"
                className="relative w-52 sm:w-72 lg:w-[26rem] object-contain drop-shadow-[0_0_60px_oklch(0.62_0.22_290_/_0.7)]"
              />
            </div>

            <span
              className="mt-4 inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs glass text-primary-glow animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {tr(t.hero.badge)}
            </span>

            <h1
              className="mt-4 text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-gradient animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              {tr(t.hero.title)}
            </h1>

            <p
              className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              {tr(t.hero.desc)}
            </p>
          </div>

          <div
            className="mt-8 sm:mt-10 max-w-4xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* MARKETPLACE SECTIONS */}
      <BrowseByBrand />
      <FeaturedCars />
      <BrowseByBodyType />
      <NewArrivals />
      <WhyUs />

      {/* HOW */}
      <section id="how" className="relative py-20 scroll-mt-24">
        <div className="container mx-auto px-5 relative">
          <Reveal>
            <SectionHeader title={tr(t.how.title)} subtitle={tr(t.how.subtitle)} />
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.how.steps.map((s, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="relative glass rounded-2xl p-6 group hover:border-primary/60 transition-all h-full">
                  <div className="text-5xl font-display font-bold text-gradient opacity-90">
                    0{i + 1}
                  </div>
                  <p className="mt-4 text-sm text-foreground/90 leading-relaxed">{tr(s)}</p>
                  <div className="absolute top-4 end-4 w-2 h-2 rounded-full bg-primary-glow shadow-[0_0_12px_oklch(0.72_0.24_295)] group-hover:scale-150 transition-transform" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Faq />

      {/* INSTAGRAM */}
      <section className="relative py-20">
        <div className="container mx-auto px-5">
          <Reveal>
            <SectionHeader title={tr(t.ig.title)} subtitle={tr(t.ig.subtitle)} />
          </Reveal>
          <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Reveal delay={80}>
              <IgCard
                handle="al_melaz_motors"
                name="AL MELAZ MOTORS"
                desc={tr(t.ig.office)}
                url={links.igOffice}
              />
            </Reveal>
            <Reveal delay={180}>
              <IgCard
                handle="obada.alkhateeb1"
                name="Eng. Obada Alkhateeb"
                desc={tr(t.ig.owner)}
                url={links.igOwner}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-20 scroll-mt-24">
        <div className="container mx-auto px-5">
          <Reveal>
            <div className="relative glass rounded-3xl p-10 md:p-16 text-center overflow-hidden">
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[120px] pointer-events-none" />
              <div className="relative">
                <h2 className="text-3xl md:text-5xl font-bold text-gradient leading-tight">
                  {tr(t.contact.title)}
                </h2>
                <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{tr(t.contact.desc)}</p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={links.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-medium text-primary-foreground bg-[var(--gradient-purple)] hover:scale-[1.03] transition-transform glow"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {tr(t.contact.btn)}
                  </a>
                  <Link
                    to="/cars"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-white btn-browse"
                  >
                    <Car className="w-5 h-5" />
                    {tr(t.hero.ctaBrowse)}
                    <ArrowRight
                      className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </Link>
                </div>
                <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary-glow" />
                  <span className="text-sm">{tr(t.contact.phone)}:</span>
                  <a
                    href={`tel:+963994396648`}
                    className="text-foreground font-medium tracking-wider"
                    dir="ltr"
                  >
                    {links.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}

function IgCard({
  handle,
  name,
  desc,
  url,
}: {
  handle: string;
  name: string;
  desc: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group relative glass rounded-2xl p-6 flex items-center gap-4 hover:border-primary/60 hover:-translate-y-1 transition-all duration-500"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full group-hover:bg-primary/60 transition-all" />
        <div className="relative w-14 h-14 rounded-2xl bg-[var(--gradient-purple)] flex items-center justify-center glow-soft">
          <Instagram className="w-7 h-7 text-primary-foreground" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-foreground truncate">{name}</div>
        <div className="text-xs text-muted-foreground mt-0.5 truncate">{desc}</div>
        <div className="text-xs text-primary-glow mt-1.5" dir="ltr">
          @{handle}
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary-glow group-hover:translate-x-1 transition-all rtl:rotate-180 rtl:group-hover:-translate-x-1" />
    </a>
  );
}
