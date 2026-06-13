import { ShieldCheck, BadgeCheck, MessageCircle } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { SectionHeader, useTr } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { useCarsList, useCarFilters } from "@/lib/api/queries";

const CARD_ICONS = [BadgeCheck, ShieldCheck, MessageCircle];

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-gradient">{value}</div>
      <div className="mt-1 text-xs md:text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function WhyUs() {
  const { lang, tr } = useTr();
  const { data: list } = useCarsList({ per_page: 1 });
  const { data: filters } = useCarFilters();

  const fmt = (n: number) => new Intl.NumberFormat(lang === "ar" ? "ar-SY" : "en-US").format(n);
  // Marketing floor: never show a tiny inventory number. Once the real count
  // passes the floor, the real (rounded-down to a clean ten) number shows.
  const CARS_FLOOR = 100;
  const BRANDS_FLOOR = 10;
  const rawCars = list?.meta?.total ?? 0;
  const totalCars = Math.max(rawCars - (rawCars % 10), CARS_FLOOR);
  const totalBrands = Math.max(filters?.brands?.length ?? 0, BRANDS_FLOOR);

  return (
    <section className="relative py-20 scroll-mt-24">
      <div className="container mx-auto px-5">
        <Reveal>
          <SectionHeader title={tr(t.home.why.title)} subtitle={tr(t.home.why.subtitle)} />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 glass rounded-3xl p-8 md:p-10 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <StatBlock
              value={totalCars > 0 ? `+${fmt(totalCars)}` : "—"}
              label={tr(t.home.why.stats.cars)}
            />
            <StatBlock
              value={totalBrands > 0 ? `+${fmt(totalBrands)}` : "—"}
              label={tr(t.home.why.stats.brands)}
            />
            <StatBlock value="24/7" label={tr(t.home.why.stats.support)} />
          </div>
        </Reveal>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {t.home.why.cards.map((c, i) => {
            const Icon = CARD_ICONS[i] ?? BadgeCheck;
            return (
              <Reveal key={i} delay={i * 120}>
                <div className="group glass rounded-2xl p-8 h-full hover:-translate-y-2 hover:border-primary/60 transition-all duration-500">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[var(--gradient-purple)] glow-soft group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-primary-foreground" aria-hidden />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-foreground">{tr(c.t)}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{tr(c.d)}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
