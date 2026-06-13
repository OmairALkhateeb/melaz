import { Link } from "@tanstack/react-router";
import { ArrowLeft, Car } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { cn } from "@/lib/utils";

export function CarNotFoundState() {
  const { lang, tr } = useTr();

  return (
    <div className="glass rounded-2xl p-10 md:p-14 text-center max-w-xl mx-auto">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
        <Car className="w-8 h-8 text-primary-glow" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-foreground">{tr(t.cars.detail.notFoundTitle)}</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {tr(t.cars.detail.notFoundDesc)}
      </p>
      <Link
        to="/cars"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white btn-browse"
      >
        <ArrowLeft className={cn("w-4 h-4", lang === "ar" && "rotate-180")} />
        {tr(t.cars.detail.browseCars)}
      </Link>
    </div>
  );
}
