import { Car, MessageCircle, RotateCcw } from "lucide-react";
import { translations as t, links } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  onClearFilters?: () => void;
};

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  const { tr } = useTr();

  return (
    <div className="glass rounded-2xl p-10 md:p-14 text-center max-w-xl mx-auto" role="status">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-[var(--gradient-purple)] flex items-center justify-center glow-soft">
        <Car className="w-8 h-8 text-primary-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="mt-6 text-xl font-bold text-foreground">{tr(t.cars.empty.title)}</h3>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{tr(t.cars.empty.desc)}</p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        {onClearFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={onClearFilters}
            className="rounded-full glass border-border/80"
          >
            <RotateCcw className="w-4 h-4" />
            {tr(t.cars.filters.clearFilters)}
          </Button>
        )}
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-primary-foreground bg-[var(--gradient-purple)] hover:scale-[1.03] transition-transform glow"
        >
          <MessageCircle className="w-4 h-4" />
          {tr(t.contact.btn)}
        </a>
      </div>
    </div>
  );
}
